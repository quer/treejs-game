function MouseEvent(mapBlocks, camera, scale, scene) {
	var scope = this;
	this.camera = camera;
	this.scale = scale;
	this.scene = scene;
	this.cubes = [];
	this.mapBlocks = mapBlocks;
	this.hoverGraphics = null;
	this.mapBlocksObject = [];
	for (var i = 0; i < this.mapBlocks.length; i++) {
		if(this.mapBlocks[i].plane != null){
			this.mapBlocksObject.push(this.mapBlocks[i].plane);
		}
	}
	this.raycaster = new THREE.Raycaster();
	this.mouse = new THREE.Vector2();
	
	this.render = function () {
		this.raycaster.setFromCamera( this.mouse, this.camera );

		// calculate objects intersecting the picking ray
		var intersects = this.raycaster.intersectObjects( this.mapBlocksObject );

		if (intersects.length > 0) {
			this.setHoverGraphicPosition(intersects[ 0 ].object.position);
		}else{
			console.log('ikke på nogle obj');
		}
		/*for ( var i = 0; i < intersects.length; i++ ) {

			intersects[ i ].object.material.color.set( 0xff0000 );

		}*/
	}
	/**
	 * Add hoverElement to map
	 * @param  {obj} position x , y
	 */
	this.makeHoverGraphic = function (position) {
		
		this.hoverGraphics = new THREE.Object3D();
		this.hoverGraphics.position.x = position.x * this.scale;
		this.hoverGraphics.position.z = position.z * this.scale;
		this.hoverGraphics.position.y = (-this.scale*2) + (-this.scale / 2);
		
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		
		var topRight = this.makeConerObjs(material);
		this.hoverGraphics.add( topRight ); 

		var topLeft = this.makeConerObjs(material);
		this.rotateObject(topLeft, 0, 90, 0);
		this.hoverGraphics.add( topLeft ); 

		var bottomRight = this.makeConerObjs(material);
		this.rotateObject(bottomRight, 0, -90, 0);
		this.hoverGraphics.add( bottomRight ); 

		var bottomLeft = this.makeConerObjs(material);
		this.rotateObject(bottomLeft, 0, 180, 0);
		this.hoverGraphics.add( bottomLeft ); 


		this.scene.add(this.hoverGraphics);
	}

	this.setHoverGraphicPosition = function (position) {
		if (this.hoverGraphics == null) {
			this.makeHoverGraphic(position);
		}else{
			this.hoverGraphics.position.x = position.x;
			this.hoverGraphics.position.z = position.z;
		}
	}
	this.makeConerObjs = function (material) {
		var cubeContainer = new THREE.Object3D();
		
		var geometry1 = new THREE.BoxGeometry( this.scale/3, this.scale/10, this.scale/10 );
		var cube1 = new THREE.Mesh( geometry1, material );
		cube1.position.x += (this.scale/2) - (this.scale/3)/2;
		cube1.position.z += (this.scale/2) - (this.scale/10)/2;
		cube1.position.y = -this.scale/2;
		cubeContainer.add(cube1);

		var geometry2 = new THREE.BoxGeometry( this.scale/10, this.scale/10, this.scale/3 );
		var cube2 = new THREE.Mesh( geometry2, material );
		cube2.position.x += (this.scale/2) - (this.scale/10)/2;
		cube2.position.z += (this.scale/2) - (this.scale/3)/2;
		cube2.position.y = -this.scale/2;
		//cube2.rotateY(90);
		cubeContainer.add(cube2);
		return cubeContainer;
	}
	/**
	 * rotate objeckt
	 * @param  {threejs obj} object 
	 * @param  {Number} degreeX 
	 * @param  {Number} degreeY 
	 * @param  {Number} degreeZ 
	 */
	this.rotateObject = function(object, degreeX=0, degreeY=0, degreeZ=0){

	   degreeX = (degreeX * Math.PI)/180;
	   degreeY = (degreeY * Math.PI)/180;
	   degreeZ = (degreeZ * Math.PI)/180;

	   object.rotateX(degreeX);
	   object.rotateY(degreeY);
	   object.rotateZ(degreeZ);

	}
}