function GameObject(scene) {
	this.scene = scene;
	this.scale = scale;
	this.roadMaterial = new THREE.MeshBasicMaterial( {color: 0xece8d9} );
}
GameObject.prototype.addbuilding = function(dataId, x, z) {
	switch ( dataId.dataId ) {
		case 'road':
			this.getNewRoad(function (newRoad) {
				newRoad.position.x = x;
				newRoad.position.z = z;
				this.scene.add(newRoad);
			});
			break;
		case 'hovel': // w
			this.getNewHouse(function (newHouse) {
				newHouse.position.x = x;
				newHouse.position.z = z;
				this.scene.add(newHouse);
			});
			break;
		default:
			console.log(dataId.dataId, 'ikke fundet');
			break;
		
	}
	
};
GameObject.prototype.getNewRoad = function(callback) {
	var loader = new THREE.JSONLoader();
        loader.load( "json/road.json", function (geometry, materials) {
        	var material = new THREE.MeshFaceMaterial( materials );
            obj = new THREE.Mesh( geometry, material );
            obj.scale.set(this.scale/4, this.scale/4, this.scale/4);
            callback( obj );
        } );
};
GameObject.prototype.getNewHouse = function(callback) {

	var loader = new THREE.JSONLoader();
        loader.load( "json/house.json", function (geometry, materials) {
        	var material = new THREE.MeshFaceMaterial( materials );
            obj = new THREE.Mesh( geometry, material );
            obj.scale.set(this.scale/3, this.scale/3, this.scale/3);
            callback( obj );
        } );
};