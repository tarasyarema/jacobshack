const MAX_ROT_TIME = 30;

let LEVEL = 0;
let LEVEL_DATA;
let SELECT = null;
let ORIGIN = "BCN";
let DESTINATION = null;
let TIME;
let ROT = false;
let ROT_TIME = 0;
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
	if ((left_down || right_down || up_down || down_down) && ROT == false)
		ROT = true;

	if (ROT) {
		if (left_down) {
			Cube.ry = (ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			SELECT = 0;
			DESTINATION = LEVEL_DATA[SELECT];
		} else if (right_down) {
			Cube.ry = -(ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			SELECT = 1;
			DESTINATION = LEVEL_DATA[SELECT];
		} else if (up_down) {
			Cube.rx = (ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			SELECT = 2;
			DESTINATION = LEVEL_DATA[SELECT];
		} else if (down_down) {
			Cube.rx = -(ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
			SELECT = 3;
			DESTINATION = LEVEL_DATA[SELECT];
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

	$.get("/top/" + ORIGIN, (data) => {
		LEVEL_DATA = data["destinations"]

		$("#cities").append("<div id=\"top\"style=\" top: 25% \">" + LEVEL_DATA[0]["name"] + "</div>");
		$("#cities").append("<div id=\"left\">" + LEVEL_DATA[1]["name"] + "</div>");
		$("#points").append("<div style=\" font-size: xx-large \">" + POINTS + "</div>");
		$("#cities").append("<div id=\"right\">" + LEVEL_DATA[2]["name"] + "</div>");
		$("#cities").append("<div id=\"down\">" + LEVEL_DATA[3]["name"] + "</div>");

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
