const express = require('express');
const wkx = require('wkx');
const { Client } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

//set up the database connection
const client = new Client({
    user: 'admin',
    host: 'localhost',
    database: 'noise-db',
    password: 'admin',
    port: 5432,
});
console.log("Connecting to database...");
client.connect();

app.use(express.json());
app.use(express.static('public'));

// Serve static files (including page.js)
app.use(express.static(path.join(__dirname, 'public')));

// Create new entry (new tile) in the database
app.post('/api/addTile', async (req, res) => {
    try {
        const { geojson } = req.body; // Assuming data is part of the request body
        console.log(geojson);

        //  insert data into the noise_reports table

        await client.query(`
            INSERT INTO noise_reports (avgdB, avgLoud, geometry)
            VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326))
        `, [geojson.properties.avgdB, geojson.properties.avgLoud, JSON.stringify(geojson.geometry)]);


        // Retrieve the report_id of the inserted record
        const reportIdQuery = await client.query('SELECT lastval()');
        const reportId = reportIdQuery.rows[0].lastval;
        const dataPoint = geojson.properties;

        // Assuming dataPoint is an object containing the required data
        const firstData = dataPoint.data[0]; // Assuming dataPoint.data[0] is already an object

        await client.query(`
    INSERT INTO noise_report_data (report_id, dbavg, dbmax, dbdevice, time, date, loudness, feeling, tags)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
`, [
            reportId,   // $1
            firstData.decibel.avg,      // $2
            firstData.decibel.max,      // $3 (assuming dbmax is the same as avgdB, adjust accordingly)
            firstData.decibel.max,      // $4
            firstData.time,       // $5
            firstData.date,       // $6
            firstData.loudness,   // $7
            firstData.feeling,    // $8
            ["firstData.tags"]       // $9
        ]);


        res.status(201).json({ message: 'GeoJSON data added successfully' });
    } catch (error) {
        console.error('Error creating GeoJSON data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/getTileInfo', async (req, res) => {
    try {
        const { coords } = req.body;


        // Use the WKT in the query with ST_MakeValid
        const query = `
    SELECT * 
    FROM noise_reports 
    WHERE ST_DWithin(
        ST_MakeValid(geometry),
        ST_SetSRID(ST_MakePoint($1, $2), 4326),
        0.000001
    )`;

        const tileData = (await client.query(query, [coords[0][0], coords[0][1]])).rows;

        res.json(tileData);

    } catch (error) {
        console.error('Error reading GeoJSON data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/api/getReports', async (req, res) => {
    try {
        const { id } = req.body;

        const query = `SELECT * FROM noise_report_data WHERE report_id = $1`;
        console.log(id);

        // Execute the query with the provided id
        const reportData = await client.query(query, [id]);

        // Send the results back in the response
        res.json(reportData.rows);

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/api/getTiles', async (req, res) => {
    try {
        const reports = (await client.query('SELECT * FROM noise_reports')).rows;
        const data = (await client.query('SELECT * FROM noise_report_data')).rows;

        const geojsonFeatures = reports.map((dbResponse) => {
            // Decode WKB (Well Known Binary) to coordinates
            const geometry = wkx.Geometry.parse(Buffer.from(dbResponse.geometry, 'hex'));
            const coordinates = geometry.toGeoJSON().coordinates;

            // Filter data for the current report_id
            const reportData = data.filter((d) => d.report_id === dbResponse.id);

            // Convert database response and reportData to GeoJSON feature
            const geojsonFeature = {
                type: 'Feature',
                properties: {
                    avgdB: parseInt(dbResponse.avgdb),
                    avgLoud: parseInt(dbResponse.avgloud),
                    data: reportData.map((d) => ({
                        decibel: {
                            avg: parseInt(d.decibel_avg),
                            max: parseInt(d.decibel_max),
                            device: d.decibel_device,
                        },
                        time: d.time,
                        loudness: parseInt(d.loudness),
                        feeling: parseInt(d.feeling),
                        tags: parseTags(d.tags), // Parse the tags
                    })),
                },
                geometry: {
                    type: 'Polygon',
                    coordinates,
                },
            };

            return geojsonFeature;
        });

        res.send(JSON.stringify(geojsonFeatures, null, 2));

    } catch (error) {
        console.error('Error reading GeoJSON data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'page.js'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Update data of a specific tile
//the query will first add thje new data to the noise_report_data table and then update the noise_reports table by updating the average 
app.post('/api/updateTile', async (req, res) => {
    const { tileCoord, data } = req.body;

    try {
        // Find the tile in the noise_reports table based on coordinates
        const matchingTileQuery = await client.query(
            'SELECT id, avgdB, avgLoud FROM noise_reports WHERE ST_DWithin(ST_MakeValid(geometry), ST_SetSRID(ST_MakePoint($1, $2), 4326), 0.000001)',
            [tileCoord[1], tileCoord[0]]
        );



        if (matchingTileQuery.rows.length > 0) {
            const matchingTile = matchingTileQuery.rows[0];

            // Update the noise_report_data table with new data
            await client.query(`
                INSERT INTO noise_report_data (report_id, dbavg, dbmax, dbdevice, time, date, loudness, feeling, tags)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            `, [
                matchingTile.id,         // $1
                data.decibel.avg,        // $2
                data.decibel.max,        // $3 (assuming dbmax is the same as avgdB, adjust accordingly)
                data.decibel.max,        // $4
                data.time,               // $5
                data.date,               // $6
                data.loudness,           // $7
                data.feeling,            // $8
                ["0"],    // $9 (assuming data.tags is an array)
            ]);

            // Recalculate averages in the noise_reports table
            const newAveragesQuery = await client.query(`
                SELECT AVG(dbavg) AS newAvgdB, AVG(loudness) AS newAvgLoud
                FROM noise_report_data
                WHERE report_id = $1
            `, [matchingTile.id]);

            const newAvgdB = newAveragesQuery.rows[0].newavgdb;
            const newAvgLoud = newAveragesQuery.rows[0].newavgloud;

            // Update averages in the noise_reports table
            await client.query(`
                UPDATE noise_reports
                SET avgdB = $1, avgLoud = $2
                WHERE id = $3
            `, [newAvgdB, newAvgLoud, matchingTile.id]);

            res.json({ success: true, message: 'Data updated successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Tile not found' });
        }
    } catch (error) {
        console.error('Error updating tile data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});


//used to parse array inputs for sources
function parseTags(tagsInput) {
    try {
        // Check if the input is a string
        if (typeof tagsInput === 'string') {
            // Split the comma-separated string into an array, trim whitespaces, and remove duplicates
            const tagsArray = [...new Set(tagsInput.split(',').map(tag => tag.trim()))];
            return tagsArray;
        }
        // Check if the input is an array
        else if (Array.isArray(tagsInput)) {
            // Convert the array to a comma-separated string
            const tagsString = tagsInput.join(', ');
            // Split the comma-separated string into an array, trim whitespaces, and remove duplicates
            const tagsArray = [...new Set(tagsString.split(',').map(tag => tag.trim()))];
            return tagsArray;
        }
        // Throw an error if the input is neither a string nor an array
        else {
            throw new Error('Tags are not in string or array format');
        }
    } catch (error) {
        console.error(`Error parsing tags: ${error.message}`);
        // If there's an error, return the original input
        return tagsInput;
    }
}


