const Scene = require("./scene.js");


class EmptyScreen extends Scene{
	constructor() {super();}
	Recv(title,playerid,args) {
		console.log(`emptyscreen received from ${playerid} : ${title}`);
	}
	Send(playerid,ws) {
		//todo
	}
	AddPlayer(playerid,args) {}
	RemovePlayer(playerid) {}
	Update() {}
};

module.exports = EmptyScreen;

