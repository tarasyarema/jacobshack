import json
from random import randint

out = { 'data': [] }

with open("../data/all_geo.json", "r") as geo:
    data = json.load(geo)
    for continent in data["Continents"]:
        for country in continent["Countries"]:
            for city in country["Cities"]:
                for airport in city["Airports"]:
                    out['data'].append({ "id": airport["CityId"], "name": airport["Name"] })

with open("../data/geo.json", "w") as f:
    json.dump(out, f)

data_len = len(out["data"])
print(out["data"][randint(0, data_len)])
