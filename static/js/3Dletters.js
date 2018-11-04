const PROP = 1.5;

function creaCube(x, y, z, p, col) {
	var geometry = new THREE.BoxGeometry(p, PROP * p, PROP * p);
	var material = new THREE.MeshPhongMaterial({ color: col });
	var cube = new THREE.Mesh(geometry, material);
	
	cube.position.x = x;
	cube.position.y = y;
	cube.position.z = z;
	
	cube.castShadow = true;
	cube.receiveShadow = true;
	
	scene.add(cube);
	return cube;
}

function creaGrid (x, y, z, p) {
	var pos = [];
	for (let i = 0; i < 5; ++i ) pos[i] = [[],[],[]];
	
	pos[0][0] = [x,y,z];
	
	let dx = 1.2 * p;
	let dy = 1.1 * PROP * p;
	
	for (let i = 0; i < 5; ++i)
		for (let j = 0; j < 5; ++j)
			pos[i][j] = [i * dx + x, -j * dy + y, z];
	
	return pos;
}

function normalizePos( x, y, z, p) {
	var realpos = [];

	let dx = 5 * (1.2 * p);
	let dy = 5 * (1.1 * PROP * p);
	let dz = 5 * PROP * z;

	realpos[0] = x - (1 / 2) * dx;
	realpos[1] = y + (1 / 2) * dy;
	realpos[2] = z + (1 / 2) * dz;
	
	return realpos;
}

function printLetter (x, y, z, n, p, col) {
	let pos = normalizePos(x, y, z, p);
	let grid = creaGrid(pos[0], pos[1], pos[2], p);
	
	let letter = new THREE.Object3D();

	for (let i = 0; i < asciiChars[n].length; ++i)
		for (let j = 0; j < asciiChars[n][0].length; ++j)
			if (asciiChars[n][j][i] != 0) {
				let tmp = creaCube(grid[i][j][0], grid[i][j][1], grid[i][j][2], p, col);
				letter.add(tmp);
			}

	return letter;
}

function str2Num (str) {
	let num = [];
	let ucstr = str.toUpperCase();
	
	for ( let i = 0; i < ucstr.length; ++i) {
		if (ucstr.charCodeAt(i) < 96)
			num[i] = ucstr.charCodeAt(i) - 32;
		else
			num[i] = 0;
	}

	return num;
}

function printCombo ( x, y, z, letts, p, col) {
	let nums = str2Num(letts);
	let it = 5 * 1.3 * p;
	let temp = (nums.length * it) / 2;

	let combo = new THREE.Object3D();

	for (let i = 0; i < nums.length; ++i) {
		let letter = printLetter(x - temp + (i * it), y, z, nums[i], p, col);
		combo.add(letter);
	}

	return combo;
}
