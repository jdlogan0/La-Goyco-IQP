//THIS IS FOR TESTING STUFF

let geojson = 
[{
    "type": "Feature",
    "properties": {
        "avgdB": 50,
        "avgLoud": 5,
        "data" : [
            {
                "decibel" : {
                    "avg" : 50,
                    "max" : 67,
                    "device" : "NIOSH App"
                },
                "time" : "idk the format",
                "loudness" : 6,
                "feeling" : "😐",
                "tags" : ["Traffic", "Wildlife"]
            },
            {
                "decibel" : null,
                "time" : "idk the format",
                "loudness" : 7,
                "feeling" : "🙁",
                "tags" : ["Traffic", "Contruction", "Motorcycle"]
            }
        ]
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-66.066199, 18.454677],
            [-66.050924, 18.454677],
            [-66.050924, 18.447166],
            [-66.066199, 18.447166]
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
                "time" : "idk the format",
                "loudness" : 9,
                "feeling" : "😢",
                "tags" : ["Aircraft", "Construction"]
            }
        ]
    },
    "geometry": {
        "type": "Polygon",
        "coordinates": [[
            [-66.057467, 18.446881],
            [-66.055086, 18.4468],
            [-66.054957, 18.446026],
            [-66.058454, 18.445904]
        ]]
    }
}];