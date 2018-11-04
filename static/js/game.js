const MAX_ROT_TIME = 60;

let LEVEL = 0;
let LEVEL_DATA = undefined;
let ORIGIN = "BCN";
let ORIGIN_NAME = "Barcelona";
let DESTINATION = null;
let TRAVEL = false;
let TIME;
let TRIP;
let ROT = false;
let ROT_TIME = 0;
let MIN = 0;
let POINTS = 0;
let EVENT_LISTENERS_ENABLED = true;
let Cube;

let left_down = false;
let right_down = false;
let up_down = false;
let down_down = false;

function key_down_left(Cube){
    	left_down = true;
}

function key_down_right(Cube){
    	right_down = true;
}

function key_down_up(Cube) {
    	up_down = true;
}

function key_down_down(Cube) {
    	down_down = true;
}

function key_down_listener(event, Cube) {
    	let key = event.key;

    	if (key === "ArrowLeft" && EVENT_LISTENERS_ENABLED) {
        	key_down_left(Cube);
		EVENT_LISTENERS_ENABLED = false;
	} else if (key === "ArrowRight" && EVENT_LISTENERS_ENABLED) {
        	key_down_right(Cube);
		EVENT_LISTENERS_ENABLED = false;
    	} else if (key === "ArrowUp" && EVENT_LISTENERS_ENABLED) {
        	key_down_up(Cube)
		EVENT_LISTENERS_ENABLED = false;
    	} else if (key === "ArrowDown" && EVENT_LISTENERS_ENABLED) {
        	key_down_down(Cube)
		EVENT_LISTENERS_ENABLED = false;
    	}
}

function update(Cube, camera) {
	if ((left_down || right_down || up_down || down_down) && ROT == false) {
		ROT = true;
		TRAVEL = true;
	}

	if (ROT && LEVEL_DATA != undefined) {
		if (left_down) {
			Cube.ry = (ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			if (TRAVEL) DESTINATION = LEVEL_DATA[1];
		} else if (right_down) {
			Cube.ry = -(ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			if (TRAVEL) DESTINATION = LEVEL_DATA[2];
		} else if (up_down) {
			Cube.rx = (ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			if (TRAVEL) DESTINATION = LEVEL_DATA[0];
		} else if (down_down) {
			Cube.rx = -(ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			if (TRAVEL) DESTINATION = LEVEL_DATA[3];
		}
	
		if (DESTINATION != undefined && TRAVEL) {
			TRAVEL = false;
			let tmp = DESTINATION["id"];
			POINTS += DESTINATION["price"];
			ORIGIN = tmp;
			ORIGIN_NAME = DESTINATION["name"];
			DESTINATION = undefined;
			
			$.get("/top/" + tmp, (data) => {
				LEVEL_DATA = data["destinations"];
				
				$("#title").html("from <b>" + ORIGIN_NAME + "</b> to");
				$("#top").html("<div id=\"top\"style=\" top: 25% \">" + LEVEL_DATA[0]["name"] + "</div>");
				$("#left").html("<div id=\"left\">" + LEVEL_DATA[1]["name"] + "</div>");
				$("#points").html("<div>" + (MIN - POINTS) + " €</div>");
				$("#right").html("<div id=\"right\">" + LEVEL_DATA[2]["name"] + "</div>");
				$("#down").html("<div id=\"down\">" + LEVEL_DATA[3]["name"] + "</div>");
				$("#footer").html("min: " + MIN + "€ ~ you: " + POINTS + " €");

				let tmp_min = 10000;
				let tmp_name;

				for (let i = 0; i < LEVEL_DATA.length; ++i) {
					if (LEVEL_DATA[i]["price"] < tmp_min) {
						tmp_min = LEVEL_DATA[i]["price"];
						tmp_name = LEVEL_DATA[i]["name"];
					}
				}

				MIN += tmp_min;
				TRIP.push(tmp_name);
			});
		}
	}

	Cube.cube.rotation.x = Cube.rx;
	Cube.cube.rotation.y = Cube.ry;

	if (ROT_TIME == MAX_ROT_TIME) {
		ROT = false;
		ROT_TIME = 0;

		left_down = false;
		right_down = false;
		up_down = false;
		down_down = false;
		
		EVENT_LISTENERS_ENABLED = true;
		
		Cube.rx = 0;
		Cube.ry = 0;
	}
	
	if (ROT) ++ROT_TIME;
	++TIME;
}

function init() {
	let Cube = {
		cube: cube,	
		rx: 0,
		ry: 0
	};

	TIME = 0;
	TRIP = [ ORIGIN ];

	$.get("/top/" + ORIGIN, (data) => {
		LEVEL_DATA = data["destinations"]
		
		$("#title").html("from <b>" + ORIGIN_NAME + "</b> to");
		$("#top").html(LEVEL_DATA[0]["name"]);
		$("#left").html(LEVEL_DATA[1]["name"]);
		$("#points").html((MIN - POINTS) + " €");
		$("#right").html(LEVEL_DATA[2]["name"]);
		$("#down").html(LEVEL_DATA[3]["name"]);
		
		let tmp = 10000;
		let tmp_name;

		for (let i = 0; i < LEVEL_DATA.length; ++i) {
			if (LEVEL_DATA[i]["price"] < tmp) {
				tmp = LEVEL_DATA[i]["price"];
				tmp_name = LEVEL_DATA[i]["name"];
			}
		}

		MIN += tmp;
		TRIP.push(tmp_name);
	});
	
	document.addEventListener('keydown', function (event){
        	key_down_listener(event, Cube);
    	});

	window.addEventListener("resize", on_window_resize, false);
	
	let render = function () {
		requestAnimationFrame(render);
		camera.lookAt(Cube.cube.position);
		
		update(Cube, camera);
		renderer.render(scene, camera);
	}

	render();
}

init();
