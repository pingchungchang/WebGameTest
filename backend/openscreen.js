const Scene = require("./scene.js");


class OpenScreen extends Scene{
	constructor() {super();}
	Recv(title,playerid,args) {
		console.log(`openscreen received from ${playerid} : ${title}`);
	}
	Send(playerid,ws) {
		//todo
	}
	AddPlayer(playerid,args) {}
	RemovePlayer(playerid) {}
	Update() {}
};

module.exports = OpenScreen;
