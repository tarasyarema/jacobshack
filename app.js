var request = require("request");
var stdin = process.openStdin();

let city = "BCN";
let menu = [];
let data;
let points = 0;

stdin.setEncoding("utf8");
stdin.addListener("data", (key) => {
	let i = parseInt(key);
	city = menu[i]["id"];
	points += menu[i]["price"];
	menu = [];
	game();
});


function game() {
	request("http://localhost:3000/top/" + city, (err, req, body) => {
		data = JSON.parse(body);
		console.log("Points: %d", points);
		for (let i = 0; i < 4; ++i) {
			let tmp = data["destinations"][i];
			menu.push(tmp);
			console.log(i, tmp["price"], tmp["name"]);
		}
	});
}

game();
