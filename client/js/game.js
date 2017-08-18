var camera, scene, renderer, controls, cameraContaimer;
var stats;
var scale = 50;
var mapRenderBlocks = 100;
var worldMap;
var mouseEvent;
var baseGame = new BaseGame();
var clock = new THREE.Clock();
var velocity = new THREE.Vector3();
$("body").on('click', '#buildMenu div.list', function () {
	baseGame.clikcBuildMenu($(this).attr('data-id'));
})
var moveForward = false;
var moveBackward = false;
var moveLeft = false;
var moveRight = false;

init();
animate();

function init() {
	cameraContaimer = new THREE.Object3D();
	stats = new Stats();
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 5000 );
	scene = new THREE.Scene();
	//scene.fog = new THREE.Fog( 0xffffff, 0, 750 );
	cameraContaimer.add(camera);
	scene.add( cameraContaimer );
	var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
	light.position.set( 0.5, 1, 0.75 );
	scene.add( light );
	
	controls = new THREE.OrbitControls( camera );
	controls.target.set( 0.0, 100.0, 0.0 );
	controls.userPanSpeed = 100;
	
	var onKeyDown = function ( event ) {
		switch ( event.keyCode ) {
			case 38: // up
			case 87: // w
				moveForward = true;
				break;
			case 37: // left
			case 65: // a
				moveLeft = true; 
				break;
			case 40: // down
			case 83: // s
				moveBackward = true;
				break;
			case 39: // right
			case 68: // d
				moveRight = true;
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
	

	worldMap = new WorldMap(scale, scene, mapRenderBlocks, baseGame);
	mouseEvent = new MouseEvent(worldMap.objects, camera, scale, scene, baseGame);


	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor( 0xffffff );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	
	document.body.appendChild( renderer.domElement );
	document.body.appendChild( stats.dom );
	
	window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}
var cameraWorld;
function animate() {
	requestAnimationFrame( animate );
	controls.update( clock.getDelta() );
	renderer.render( scene, camera );
	stats.update();
}
