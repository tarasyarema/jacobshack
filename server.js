let express = require("express");
let request = require("request");
var logger = require("morgan");
require('dotenv').config();

let app = express();
app.use(logger('dev'));

const key = "apiKey=" + process.ENV.KEY;
const base = "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/ES/EUR/es-ES/"

function get_value(data, key, value) {
	return data.filter((data) => {
	  	return data[key] == value;
	});
}


app.get("/", (req, res) => {
	res.send("Hi!");
});

app.get("/top/:origin", (req, res) => {
	if (req.params.origin == undefined) res.send("404 :(");
	
	let origin = req.params.origin;
	const query = base + origin + "/anywhere/anytime?" + key;

	request(query, (err, req_res, body) => {
		if (err) return err;
	
		data = JSON.parse(body);

		let quotes = data["Quotes"];
		let places = data["Places"];
		
		let all_dest = [];
		let i = Math.floor(Math.random() * quotes.length); 
		
		while (all_dest.length < 10) {
			let quote = quotes[i]; 
			let dest_id = quote["OutboundLeg"]["DestinationId"];
			let tmp = get_value(places, "PlaceId", dest_id)[0];

			if (all_dest.indexOf(tmp) == -1)
				all_dest.push({
					"price": quote["MinPrice"],
					"name": tmp["Name"], 
					"id": tmp["SkyscannerCode"]
				});
			
			i = Math.floor(Math.random() * quotes.length); 
		}

		res.json({ "origin": origin, "destinations": all_dest});
	});
});

app.listen(3000, () => {
	console.log("http://localhost:3000");
});
