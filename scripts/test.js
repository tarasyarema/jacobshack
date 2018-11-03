var request = require("request");

const key = "apiKey=ha581372883634613097311886436280";
const base = "http://partners.api.skyscanner.net/apiservices/browsequotes/v1.0/ES/EUR/es-ES/"

let query = base + "BARC/anywhere/anytime?" + key;

// console.log(query);

function get_value(data, code) {
  return data.filter((data) => {
	  return data["PlaceId"] == code;
  });
}

request(query, (err, res, body) => {
	if (err) return err;
	
	console.log(res.statusCode);
	data = JSON.parse(body);

	let quotes = data["Quotes"];
	let places = data["Places"];

	console.log(quotes.length, places.length);

	for (let i = 0; i < quotes.length; ++i) {
		let quote = quotes[i];
		let dest_id = quote["OutboundLeg"]["DestinationId"];
		let dest = get_value(places, dest_id)[0];

		console.log(quote["MinPrice"], dest["Name"]);
	}
});
