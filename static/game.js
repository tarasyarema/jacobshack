const MAX_ROT_TIME = 30;

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
    	} else if (key === "ArrowRight" && EVENT_LISTENERS_ENABLED) {
        	key_down_right(Cube);
    	} else if (key === "ArrowUp" && EVENT_LISTENERS_ENABLED) {
        	key_down_up(Cube)
    	} else if (key === "ArrowDown" && EVENT_LISTENERS_ENABLED) {
        	key_down_down(Cube)
    	}
}

function update(Cube, camera) {
	if ((left_down || right_down || up_down || down_down) && ROT == false)
		ROT = true;

	if (ROT) {
		if (left_down) {
			Cube.ry = (ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
		} else if (right_down) {
			Cube.ry = -(ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
		}
		
		if (up_down) {
			Cube.rx = (ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
		} else if (down_down) {
			Cube.rx = -(ROT_TIME / MAX_ROT_TIME) * Math.PI / 2;
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
		Cube.rx = 0;
		Cube.ry = 0;
	}
	
	if (ROT) 
		++ROT_TIME;
	
	++TIME;
}

function init() {
	let Cube = {
		cube: cube,	
		rx: 0,
		ry: 0
	};
	TIME = 0;

	$.get("http://localhost:3000/top/BCN", (data) => {
		alert(data);
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
