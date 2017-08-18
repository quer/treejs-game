function MouseEvent(mapBlocks, camera, scale, scene, baseGame) {
	var scope = this;
	this.camera = camera;
	this.scale = scale;
	this.scene = scene;
	this.baseGame = baseGame;
	this.gameObjeckt = new GameObject(scene, scale);
	this.lastClick;
	this.cubes = [];
	this.mapBlocks = mapBlocks;
	this.hoverGraphics = null;
	this.clickGraphics = null;
	this.lastClickID = null;
	this.mapBlocksObject = [];
	for (var i = 0; i < this.mapBlocks.length; i++) {
		if(this.mapBlocks[i].plane != null){
			this.mapBlocksObject.push(this.mapBlocks[i].plane);
		}
	}
	this.raycaster = new THREE.Raycaster();
	this.mouse = new THREE.Vector2();
	this.mouseDown = false;
	var PI_2 = Math.PI / 2;
	var onMouseMove = function(event) {
		scope.mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		scope.mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		
		scope.raycaster.setFromCamera( scope.mouse, scope.camera );

		// calculate objects intersecting the picking ray
		var intersects = scope.raycaster.intersectObjects( scope.mapBlocksObject );

		if (intersects.length > 0) {
			var intersectObject = intersects[ 0 ].object;
			scope.setHoverGraphicPosition(intersectObject.position);
			var realIntersectObject = scope.findmapBlockFromId(intersectObject.id);
		}
	}
	var onMouseClick = function (event) {
		var clickPosition = new THREE.Vector2();
		clickPosition.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
		clickPosition.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
		
		scope.raycaster.setFromCamera( clickPosition, scope.camera );

		// calculate objects intersecting the picking ray
		var intersects = scope.raycaster.intersectObjects( scope.mapBlocksObject );
		
		if (intersects.length > 0) {
			var intersectObject = intersects[ 0 ].object;
			var objId = intersectObject.id;
			var realPoss = scope.findmapBlockFromId(objId);
			
			if (scope.lastClickID == null) {
				scope.lastClickID = objId;
			}else{
				if (scope.baseGame.buildBuilding != null && scope.lastClickID == objId) {
					console.log('addbuilding');
					console.log(scope.baseGame.buildBuilding);
					scope.gameObjeckt.addbuilding(scope.baseGame.buildBuilding, intersectObject.position.x, intersectObject.position.z);
					scope.lastClickID = null;
					scope.baseGame.buildBuilding = null;
				}else{
					console.log(scope.lastClickID , objId);
					scope.lastClickID = objId;
				}

			}
			scope.setClickGraphicPosition(intersectObject.position);
			scope.baseGame.clickTile(realPoss.x, realPoss.y);
		}
	}
	document.addEventListener( 'mousemove', onMouseMove, false );
	document.addEventListener( 'click', onMouseClick, false );


	this.setClickGraphicPosition = function (position) {
		if (this.clickGraphics == null) {
			this.makeClickGraphic(position);
		}else{
			this.clickGraphics.position.x = position.x;
			this.clickGraphics.position.z = position.z;
		}
	}

	/**
	 * Add hoverElement to map
	 * @param  {obj} position x , y
	 */
	this.makeClickGraphic = function (position) {
		
		this.clickGraphics = new THREE.Object3D();
		this.clickGraphics.position.x = position.x;
		this.clickGraphics.position.z = position.z;
		
		var material = new THREE.MeshBasicMaterial( {color: 0x453156} );
		
		/*
		 * make the coners
		 */
		var topRight = this.makeConerObjs(material, 4);
		this.clickGraphics.add( topRight ); 

		var topLeft = this.makeConerObjs(material, 4);
		this.rotateObject(topLeft, 0, 90, 0);
		this.clickGraphics.add( topLeft ); 

		var bottomRight = this.makeConerObjs(material, 4);
		this.rotateObject(bottomRight, 0, -90, 0);
		this.clickGraphics.add( bottomRight ); 

		var bottomLeft = this.makeConerObjs(material, 4);
		this.rotateObject(bottomLeft, 0, 180, 0);
		this.clickGraphics.add( bottomLeft ); 

		
		/**
		 * make the blocks between
		 */
		var ConerScale = 6

		var topGeometry = new THREE.BoxGeometry( this.scale/ConerScale, this.scale/10, this.scale/10 );
		var top = new THREE.Mesh( topGeometry, material );
		top.position.z += (this.scale/2) - (this.scale/ConerScale)/2;
		this.clickGraphics.add(top);

		var bottomGeometry = new THREE.BoxGeometry( this.scale/ConerScale, this.scale/10, this.scale/10 );
		var bottom = new THREE.Mesh( bottomGeometry, material );
		bottom.position.z -= (this.scale/2) - (this.scale/ConerScale)/2;
		this.clickGraphics.add(bottom);

		var leftGeometry = new THREE.BoxGeometry( this.scale/10, this.scale/10, this.scale/ConerScale );
		var left = new THREE.Mesh( leftGeometry, material );
		left.position.x -= (this.scale/2) - (this.scale/ConerScale)/2;
		this.clickGraphics.add(left);

		var rightGeometry = new THREE.BoxGeometry( this.scale/10, this.scale/10, this.scale/ConerScale );
		var right  = new THREE.Mesh( rightGeometry, material );
		right.position.x += (this.scale/2) - (this.scale/ConerScale)/2;
		this.clickGraphics.add(right);

		/**
		 * add it to the screen
		 */
		this.scene.add(this.clickGraphics);
	}

	/**
	 * it make the hover effect on a tile
	 * @param {position} position {x,y}
	 */
	this.setHoverGraphicPosition = function (position) {
		if (this.hoverGraphics == null) {
			this.makeHoverGraphic(position);
		}else{
			this.hoverGraphics.position.x = position.x;
			this.hoverGraphics.position.z = position.z;
		}
	}

	/**
	 * Add hoverElement to map
	 * @param  {obj} position x , y
	 */
	this.makeHoverGraphic = function (position) {
		
		this.hoverGraphics = new THREE.Object3D();
		this.hoverGraphics.position.x = position.x * this.scale;
		this.hoverGraphics.position.z = position.z * this.scale;
		var material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		
		var topRight = this.makeConerObjs(material, 3);
		this.hoverGraphics.add( topRight ); 

		var topLeft = this.makeConerObjs(material, 3);
		this.rotateObject(topLeft, 0, 90, 0);
		this.hoverGraphics.add( topLeft ); 

		var bottomRight = this.makeConerObjs(material, 3);
		this.rotateObject(bottomRight, 0, -90, 0);
		this.hoverGraphics.add( bottomRight ); 

		var bottomLeft = this.makeConerObjs(material, 3);
		this.rotateObject(bottomLeft, 0, 180, 0);
		this.hoverGraphics.add( bottomLeft ); 


		this.scene.add(this.hoverGraphics);
	}

	
	this.makeConerObjs = function (material, ConerScale) {
		var cubeContainer = new THREE.Object3D();
		
		var geometry1 = new THREE.BoxGeometry( this.scale/ConerScale, this.scale/10, this.scale/10 );
		var cube1 = new THREE.Mesh( geometry1, material );
		cube1.position.x += (this.scale/2) - (this.scale/ConerScale)/2;
		cube1.position.z += (this.scale/2) - (this.scale/10)/2;
		cubeContainer.add(cube1);

		var geometry2 = new THREE.BoxGeometry( this.scale/10, this.scale/10, this.scale/ConerScale );
		var cube2 = new THREE.Mesh( geometry2, material );
		cube2.position.x += (this.scale/2) - (this.scale/10)/2;
		cube2.position.z += (this.scale/2) - (this.scale/ConerScale)/2;
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

	this.moveObject = function (object, position) {
		object.position.add(position);
	}

	this.findmapBlockFromId = function (id) {
		for (var i = 0; i < this.mapBlocks.length; i++) {
			if (this.mapBlocks[i].plane != null && this.mapBlocks[i].plane.id == id) {
				return this.mapBlocks[i];
			}
		}
		return null;
	}
}