function WaterBorder(mapBlocks, mapRenderBlocks, screen, scale) {
	this.mapBlocks = mapBlocks;
	this.waterWallList = [];
	this.mapRenderBlocks = mapRenderBlocks;
	this.scale = scale;
	this.screen = screen;

	/*var geometry = new THREE.PlaneGeometry( scale, scale);
	var materialWater = new THREE.MeshBasicMaterial( {color: 0x1e74ff, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( geometry, design );
	plane.position.x = x * scale;
	plane.position.z = y * scale;*/
	console.log(mapBlocks.length);

	for (var i = 0; i < mapBlocks.length; i++) {
		var planeObj = mapBlocks[i];
		if(planeObj.type !== 0){
			continue;
		}
		
		var topBlock = this.getListItem(this.getIndex(planeObj.x, planeObj.y-1));
		var bottomBlock = this.getListItem(this.getIndex(planeObj.x, planeObj.y+1));
		var leftBlock = this.getListItem(this.getIndex(planeObj.x-1, planeObj.y));
		var rightBlock = this.getListItem(this.getIndex(planeObj.x+1, planeObj.y));
		if (topBlock !== null && topBlock.type != 0) {
			console.log("MakeTop");
			//console.log(topBlock);
			this.MakePlate(topBlock.x, topBlock.y+0.5, {y: 0, x:0, z:0});
		}
		if (bottomBlock !== null && bottomBlock.type != 0) {
			console.log("Makebottom");
			//console.log(bottomBlock);
			this.MakePlate(bottomBlock.x, bottomBlock.y - 0.5, {y: 0, x:0, z:0});
		}
		if (leftBlock !== null && leftBlock.type != 0) {
			console.log("Makeleft");
			//console.log(leftBlock);
			this.MakePlate(leftBlock.x + 0.5, leftBlock.y, {y: 1.57, x:0, z: 0});
		}
		if (rightBlock !== null && rightBlock.type != 0) {
			console.log("Makeright");
			//console.log(rightBlock);
			this.MakePlate(rightBlock.x - 0.5, rightBlock.y, {y: 1.57, x:0, z: 0});
		}
	}

}

WaterBorder.prototype.getxy = function(index) {
	var returnX = Math.floor(index / this.mapRenderBlocks);
    var returnY =  index - (returnX * tilesAmountx);
    return {x: returnX, y: returnY};
}

WaterBorder.prototype.getIndex = function(x, y) {
	var index = (this.mapRenderBlocks * x) + y;
	if(index < 0 || index >= this.mapBlocks.length){
		return -1;
	}
	return index;
}

WaterBorder.prototype.getListItem = function(index) {
	if(index < 0 || index >= this.mapBlocks.length){
		return null;
	}
	return this.mapBlocks[index];
}
WaterBorder.prototype.MakePlate = function(x, y, rotation) {
	var geometry = new THREE.PlaneGeometry( scale, scale);
	var material = new THREE.MeshBasicMaterial( {color: 0x000000, side: THREE.DoubleSide} );
	var plane = new THREE.Mesh( geometry, material );
	plane.position.x = x * this.scale;
	plane.position.z = y * this.scale;
	plane.position.y = -this.scale*3 + -(this.scale /2);

	plane.rotation.x += rotation.x;
	plane.rotation.z += rotation.z;
	plane.rotation.y += rotation.y;
	this.screen.add( plane );
	this.waterWallList.push({plane: plane, x: x, y: y })
};