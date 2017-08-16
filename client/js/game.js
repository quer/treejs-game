var camera, scene, renderer;
var geometry, material, mesh;
var controls;
var objects = [];
var scale = 50;
var mapRenderBlocks = 100;
var waterBorder;
var raycaster;
var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );
// http://www.html5rocks.com/en/tutorials/pointerlock/intro/
var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
if ( havePointerLock ) {
	var element = document.body;
	var pointerlockchange = function ( event ) {
		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
			controlsEnabled = true;
			controls.enabled = true;
			blocker.style.display = 'none';
		} else {
			controls.enabled = false;
			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';
			instructions.style.display = '';
		}
	};
	var pointerlockerror = function ( event ) {
		instructions.style.display = '';
	};
	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
	instructions.addEventListener( 'click', function ( event ) {
		instructions.style.display = 'none';
		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
		element.requestPointerLock();
	}, false );
} else {
	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';
}
init();
animate();
var controlsEnabled = false;
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;
var canJump = false;
var prevTime = performance.now();
var velocity = new THREE.Vector3();
function init() {
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );
	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true; break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
				break;
			case 32: // space
				if ( canJump === true ) velocity.y += 350;
				canJump = false;
				break;
		}
	};
	var onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = false;
				break;
			case 37: // left
			case 65: // a
				moveLeft = false;
				break;
			case 40: // down
			case 83: // s
				moveBackward = false;
				break;
			case 39: // right
			case 68: // d
				moveRight = false;
				break;
		}
	};
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'keyup', onKeyUp, false );
	raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );
	

	var geometry = new THREE.PlaneGeometry( scale, scale);
	var materialWater = new THREE.MeshBasicMaterial( {color: 0x1e74ff, side: THREE.DoubleSide} );
	var materialGrass = new THREE.MeshBasicMaterial( {color: 0x4cff90, side: THREE.DoubleSide} );
	var materialStone = new THREE.MeshBasicMaterial( {color: 0x446970, side: THREE.DoubleSide} );
	for (var x = 0; x < mapRenderBlocks; x++) {
		for (var y = 0; y < mapRenderBlocks; y++) {
			var v = Math.abs(noise.simplex2((x * 20) / 400, (y * 20) / 400));
			var design = materialWater;
			var type = 0;
			if(v > 0.2){
				if(v <= 0.7){
					type = 1;
					design = materialGrass;
				}else{
					type = 2;
					design = materialStone;
				}
			}
			var plane = new THREE.Mesh( geometry, design );
			plane.position.x = x * scale;
			plane.position.z = y * scale;
			plane.position.y = -scale*3;
			if(type == 0){
			plane.position.y += -15;	
			}
			plane.rotation.x = 1.57;
			scene.add( plane );
			objects.push( {plane: plane, x: x, y: y, type });
		}
	}
	waterBorder = new WaterBorder(objects, mapRenderBlocks, scene, scale);
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
function animate() {
	requestAnimationFrame( animate );
	if ( controlsEnabled ) {
		raycaster.ray.origin.copy( controls.getObject().position );
		raycaster.ray.origin.y -= 10;
		//var intersections = raycaster.intersectObjects( objects );
		//var isOnObject = intersections.length > 0;
		var time = performance.now();
		var delta = ( time - prevTime ) / 1000;
		velocity.x -= velocity.x * 10.0 * delta;
		velocity.z -= velocity.z * 10.0 * delta;
		velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
		if ( moveForward ) velocity.z -= 1400.0 * delta;
		if ( moveBackward ) velocity.z += 1400.0 * delta;
		if ( moveLeft ) velocity.x -= 1400.0 * delta;
		if ( moveRight ) velocity.x += 1400.0 * delta;
		/*if ( isOnObject === true ) {
			velocity.y = Math.max( 0, velocity.y );
			canJump = true;
		}*/
		controls.getObject().translateX( velocity.x * delta );
		controls.getObject().translateY( velocity.y * delta );
		controls.getObject().translateZ( velocity.z * delta );
		if ( controls.getObject().position.y < 10 ) {
			velocity.y = 0;
			controls.getObject().position.y = 10;
			canJump = true;
		}
		prevTime = time;
	}
	renderer.render( scene, camera );
}
