function GameObject(scene) {
	this.scene = scene;
	this.scale = scale;
	this.roadMaterial = new THREE.MeshBasicMaterial( {color: 0xece8d9} );
}
GameObject.prototype.addbuilding = function(dataId, x, z) {
	switch ( dataId.dataId ) {
		case 'road': // w
			var newRoad = this.getNewRoad();
			newRoad.position.x = x;
			newRoad.position.z = z;
			this.scene.add(newRoad);
			break;
		default:
			console.log(dataId.dataId, 'ikke fundet');
			break;
		
	}
	
};
GameObject.prototype.getNewRoad = function() {
	var roadContainer = new THREE.Object3D();
	var topBottomGeometry = new THREE.BoxGeometry( this.scale/3, this.scale/10, this.scale );
	var topBottom = new THREE.Mesh( topBottomGeometry, this.roadMaterial );
	//topBottom.position.y = this.scale/2;
	roadContainer.add(topBottom);

	var rightLeftGeometry = new THREE.BoxGeometry( this.scale, this.scale/10, this.scale/3 );
	var rightLeft = new THREE.Mesh( rightLeftGeometry, this.roadMaterial );
	//rightLeft.position.y = this.scale/2;
	roadContainer.add(rightLeft);
	return roadContainer;
};