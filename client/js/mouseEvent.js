function MouseEvent(mapBlocks, camera) {
	this.camera = camera;
	this.mapBlocks = mapBlocks;
	this.mapBlocksObject = [];
	for (var i = 0; i < this.mapBlocks.length; i++) {
		if(this.mapBlocks[i].plane != null){
			this.mapBlocksObject.push(this.mapBlocks[i].plane);
		}
	}
	this.raycaster = new THREE.Raycaster();
	this.mouse = new THREE.Vector2();

	this.onMouseMove = function(event) {
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
	}
	this.render = function () {
		this.raycaster.setFromCamera( this.mouse, this.camera );

		// calculate objects intersecting the picking ray
		var intersects = this.raycaster.intersectObjects( this.mapBlocksObject );

		for ( var i = 0; i < intersects.length; i++ ) {

			intersects[ i ].object.material.color.set( 0xff0000 );

		}
	}
}