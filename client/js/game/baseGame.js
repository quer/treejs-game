function BaseGame() {
	this.mapblocks;
	this.gameObjeckts = [];
	this.buildBuilding = null;
};

BaseGame.prototype.init = function(mapblocks) {
	this.mapblocks = mapblocks;
};

BaseGame.prototype.clickTile = function(x, y) {
	console.log(x,y);
};

BaseGame.prototype.getDomElement = function() {
	// body...
};
BaseGame.prototype.clikcBuildMenu = function(dataId) {
	console.log(dataId);
	var scope = this;
	this.buildBuilding = {
		dataId: dataId, 
		callback: function (x, y) {
			scope.gameObjeckts.push({dataId:dataId, x:x, y:y});
		}
	}
};