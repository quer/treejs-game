function WorldMap(scale, scene, mapRenderBlocks) {
	this.scale = scale;
	this.waterPlane;
	this.scene = scene;
	this.mapRenderBlocks = mapRenderBlocks;
	this.objects = [];
	this.waterBorder;

	var geometry = new THREE.PlaneGeometry( this.scale, this.scale);
	var materialWater = new THREE.MeshBasicMaterial( {color: 0x1e74ff, side: THREE.BackSide} );
	//var materialGrass = new THREE.MeshBasicMaterial( {color: 0x4cff90, side: THREE.BackSide} );
	//var materialStone = new THREE.MeshBasicMaterial( {color: 0x446970, side: THREE.BackSide} );
	//ground water for hole map
	var waterGeometry = new THREE.PlaneGeometry( scale * (this.mapRenderBlocks + 2), scale * (this.mapRenderBlocks + 2));
	this.waterPlane = new THREE.Mesh( waterGeometry, materialWater );
	this.waterPlane.position.x += (( this.scale * (this.mapRenderBlocks + 2)) / 2)- this.scale;
	this.waterPlane.position.z += (( this.scale * (this.mapRenderBlocks + 2)) / 2)- this.scale;	
	this.waterPlane.position.y = -this.scale*3 + -(this.scale/2);
	this.waterPlane.rotation.x = 1.57;
	this.scene.add( this.waterPlane );
	//ground water addet!
	for (var x = 0; x < this.mapRenderBlocks; x++) {
		for (var y = 0; y < this.mapRenderBlocks; y++) {
			//var materialWater = new THREE.MeshBasicMaterial( {color: 0x1e74ff, side: THREE.BackSide} );
			var materialGrass = new THREE.MeshBasicMaterial( {color: 0x4cff90, side: THREE.BackSide} );
			var materialStone = new THREE.MeshBasicMaterial( {color: 0x446970, side: THREE.BackSide} );
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
			var plane = null;
			if(type !== 0){
				var plane = new THREE.Mesh( geometry, design );
				plane.position.x = x * scale;
				plane.position.z = y * scale;
				plane.position.y = -scale*3;
				//plane.position.y += -(scale/2);	
				plane.rotation.x = 1.57;
				this.scene.add( plane );
			}
			this.objects.push( {plane: plane, x: x, y: y, type });
		}
	}
	waterBorder = new WaterBorder(this.objects, this.mapRenderBlocks, this.scene, this.scale);
}