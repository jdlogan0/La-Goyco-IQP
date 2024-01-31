const express = require('express');
const wkx = require('wkx');
const { Client } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

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

app.post('/api/geojson', async (req, res) => {
    try {
        const { geojson } = req.body; // Assuming data is part of the request body
        console.log(geojson);

        //  insert data into the noise_reports table
        console.log('Inserting data:');
        await client.query(`
            INSERT INTO noise_reports (avgdB, avgLoud, geometry)
            VALUES ($1, $2, ST_SetSRID(ST_GeomFromGeoJSON($3), 4326))
        `, [geojson.properties.avgdB, geojson.properties.avgLoud, JSON.stringify(geojson.geometry)]);
        console.log('Inserted data:', geojson.properties);

        // Retrieve the report_id of the inserted record
        const reportIdQuery = await client.query('SELECT lastval()');
        const reportId = reportIdQuery.rows[0].lastval;
        const dataPoint = geojson.properties;

        await client.query(`
                INSERT INTO noise_report_data (report_id, decibel_avg, decibel_max, decibel_device, time, loudness, feeling, tags)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            `, [reportId, dataPoint.avgdB, dataPoint.avgLoud, dataPoint.data.device, dataPoint.data.time, dataPoint.data.loudness, dataPoint.data.feeling, dataPoint.data.tags]);



        res.status(201).json({ message: 'GeoJSON data added successfully' });
    } catch (error) {
        console.error('Error creating GeoJSON data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.get('/api/geojson', async (req, res) => {
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

        // Print GeoJSON
        // console.log(JSON.stringify(geojsonFeatures, null, 2));
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

app.post('/api/updateDataToTile', (req, res) => {
    const { tile, data } = req.body;

    const matchingTileIndex = geojson.findIndex(
        (tileFeature) =>
            tileFeature.geometry.coordinates[0][0][0] === tile[1] &&
            tileFeature.geometry.coordinates[0][0][1] === tile[0]
    );

    if (matchingTileIndex !== -1) {
        // Update the tile with new data
        geojson[matchingTileIndex].properties.data.push(data);

        // Recalculate averages
        let avgdb = 0,
            dbCount = 0,
            avgloud = 0;

        for (let j = 0; j < geojson[matchingTileIndex].properties.data.length; j++) {
            if (geojson[matchingTileIndex].properties.data[j].decibel !== null) {
                avgdb += geojson[matchingTileIndex].properties.data[j].decibel.avg;
                dbCount += 1;
            }
            avgloud += geojson[matchingTileIndex].properties.data[j].loudness;
        }

        geojson[matchingTileIndex].properties.avgdB = Math.round((avgdb / dbCount) * 100) / 100;
        geojson[matchingTileIndex].properties.avgLoud = Math.round(
            (avgloud / geojson[matchingTileIndex].properties.data.length) * 100
        ) / 100;

        res.json({ success: true, message: 'Data updated successfully' });
    } else {
        res.status(404).json({ success: false, message: 'Tile not found' });
    }
});

function parseTags(tagsString) {
    try {
        if (typeof tagsString !== 'string') {
            throw new Error('Tags are not in string format');
        }

        // Split the comma-separated string into an array
        const tagsArray = tagsString.split(',').map(tag => tag.trim());
        return tagsArray;
    } catch (error) {
        console.error(`Error parsing tags: ${error.message}`);
        return [tagsString];
    }
}


