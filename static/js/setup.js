const CUBE_SIZE = 8;

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer({ antialias: true });

let texture_loader = new THREE.CubeTextureLoader();

scene.background = new THREE.Color(0x111111);
renderer.shadowMapSoft = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.set(0, 0, 15);

// Lights setup

let lights = {
	directional_1: new THREE.DirectionalLight(0xff59ac, 0.8),
	directional_2: new THREE.DirectionalLight(0x00e1ff, 0.8),
	ambient: new THREE.AmbientLight(0xe2e2e2)
}

lights.directional_1.position.set(5, 20, 10).normalize();
lights.directional_2.position.set(-5, 20, -10).normalize();

lights.directional_1.castShadow = true;
lights.directional_2.castShadow = true;

scene.add(lights.directional_1);
scene.add(lights.directional_2);
scene.add(lights.ambient);

// Cube setup

let cube_material = new THREE.MeshBasicMaterial({ 
	map: THREE.ImageUtils.loadTexture("textures/face.png"), 
	transparent: true, 
	opacity: 0.4, 
	color: 0xffffff 
});

let cube_geometry = new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
let cube = new THREE.Mesh(cube_geometry, cube_material);
cube.castShadow = true;
cube.recieveShadow = true;
cube.position.set(0, 0, 0);
scene.add(cube);

// Plane setup
/*
let plane_geometry = new THREE.PlaneGeometry(100, 100, 8);
let plane_material = new THREE.MeshPhongMaterial({ color: 0x222222 });
let plane = new THREE.Mesh(plane_geometry, plane_material);
plane.position.z = -10;
plane.castShadow = false;
plane.recieveShadow = true;
scene.add(plane);
*/

function on_window_resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function load_font() {
	let loader = new THREE.FontLoader();
	
	loader.load('js/helvetiker_regular.typeface.js', (res) => {
		font = res;
	      	create_text("hello!");
	});
}

let height = 0.2;
let size = 0.5;
let curve_segments = 32;
let bevel_thickness = 0.1;
let bevel_size = 0.1;
let bevel_segments = 3;
let bevel_enabled = false;
let font = undefined;
let weight = "normal";

function create_text(content) {
	let text_geo = new THREE.TextGeometry(content, {
      		font: font,
		size: size,
	      	height: height,
	      	curveSegments: curve_segments,
	      	weight: weight,
		bevelThickness: bevel_thickness,
      		bevelSize: bevel_size,
      		bevelSegments: bevel_segments,
      		bevelEnabled: bevel_enabled
   	});

    	text_geo.computeBoundingBox();
    	text_geo.computeVertexNormals();
  	
	let material = new THREE.MeshLambertMaterial({ color: 0x0000ff })
	let text = new THREE.Mesh(text_geo, material)
    
	text.position.set(0, 0, 10);
	//-text_geo.boundingBox.max.x / 2, -text_geo.boundingBox.max.y / 2, -text_geo.boundingBox.max.z / 2)
    	text.castShadow = true;
    	scene.add(text);

	return text;
}
