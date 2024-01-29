//THIS IS FOR TESTING STUFF

let geojson = 
[{
    "type": "Feature",
    "properties": {
        "avgdB": 50,
        "avgLoud": 7,
        "data" : [
            {
                "decibel" : {
                    "avg" : 50,
                    "max" : 67,
                    "device" : "NIOSH App"
                },
                "time" : "08:55",
                "loudness" : 6,
                "feeling" : 1,
                "tags" : ["Traffic", "Wildlife"]
            },
            {
                "decibel" : null,
                "time" : "09:25",
                "loudness" : 8,
                "feeling" : 3,
                "tags" : ["Traffic", "Contruction", "Motorcycle"]
            }
        ]
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-66.06101, 18.451],
            [-66.06029, 18.451],
            [-66.06029, 18.45028],
            [-66.06101, 18.45028]
        ]]
    }
}, 
{
    "type": "Feature",
    "properties": {
        "avgdB": 90,
        "avgLoud": 5,
        "data" : [
            {
                "decibel" : {
                    "avg" : 90,
                    "max" : 93,
                    "device" : "real professional device tm"
                },
                "time" : "13:30",
                "loudness" : 9,
                "feeling" : 4,
                "tags" : ["Aircraft", "Construction"]
            }
        ]
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-66.06101, 18.45172],
            [-66.06029, 18.45172],
            [-66.06029, 18.451],
            [-66.06101, 18.451]
        ]]
    }
}];