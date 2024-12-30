const Scene = require("./scene.js");


class GameOverScreen extends Scene{
	constructor() {super();}
	Recv(title,playerid,args) {
		console.log(`gameoverscreen received from ${playerid} : ${title}`);
	}
	Send(playerid,ws) {
		//todo
	}
	AddPlayer(playerid, args) {}
	RemovePlayer(playerid) {}
	Update() {}
};

module.exports = GameOverScreen;

