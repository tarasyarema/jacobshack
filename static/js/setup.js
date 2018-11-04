const CUBE_SIZE = 10;
const RAD = 6;
const SEGMENTS = 32;

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
// scene.add(cube);


let sphere = create_sphere(RAD, SEGMENTS);
scene.add(sphere);

function create_pos() {
	return new THREE.Mesh(
		new THREE.SphereGeometry(1, 8, 8),
		new THREE.MeshPhongMaterial({
			color: 0xff0000
		})
	);
}

function create_sphere(radius, segments) {
	return new THREE.Mesh(
		new THREE.SphereGeometry(radius, segments, segments),
		new THREE.MeshPhongMaterial({
			map: THREE.ImageUtils.loadTexture('textures/earth.jpg')
		})
	);
}

function get_position(lat, lon) {
	let phi   = (90 - lat)*(Math.PI/180);
	let theta = (lon + 180)*(Math.PI/180);

	let x = -((RAD) * Math.sin(phi)*Math.cos(theta));
	let z = ((RAD) * Math.sin(phi)*Math.sin(theta));
	let y = ((RAD) * Math.cos(phi));

	return new THREE.Vector3(x,y,z);
}

function on_window_resize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
