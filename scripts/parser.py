import json
from random import randint

out = { }

with open("../static/data/all_geo.json", "r") as geo:
    data = json.load(geo)
    for continent in data["Continents"]:
        for country in continent["Countries"]:
            for city in country["Cities"]:
                for airport in city["Airports"]:
                    location = airport["Location"].split()

                    location[0] = float(location[0][:-1])
                    location[1] = float(location[1])
                    
                    out[airport["Id"]] = location
                    #out['data'].append({ "id": airport["CityId"], "name": airport["Name"], "location": location })

with open("../static/data/geo.json", "w") as f:
    json.dump(out, f)
