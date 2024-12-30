const Scene = require("./scene.js");
const {Name,Namer} = require("./namer.js");
const {RandInt,Sign} = require("./tools.js");

class PlayScreen extends Scene{
	static GameObject = class{
		constructor(id,x,y,ImgName,Names) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.ImgName = ImgName;
			this.PublName = Names.PublName;
			this.PrivName = Names.PrivName;
		}
		clone() {
			return new this.constructor(this.id,this.x,this.y,this.ImgName,new Name(this.PublName,this.PrivName));
		}
	};
	static PlayerInfo = class extends PlayScreen.GameObject{
		constructor(id,x,y,ImgName,Names) {
			super(id,x,y,ImgName,Names);
			this.score = 0;
		}
		clone() {
			return new this.constructor(this.id,this.x,this.y,this.ImgName,new Name(this.PublName,this.PrivName));
		}
	};
	constructor(NameFile) {
		super();
		this.RADIUS = 300;
		this.STEP = 5;
		this.H = 2500;
		this.W = 2500;
		this.ScreenWidth = 1200;
		this.ScreenHeight = 600;

		this.NameHandler = new Namer(NameFile);
		this.Players = new Map();
		this.LoggedInPlayers = new Map();
		this.Enemies = new Map();
		this.TotalEnemies = 0;
	}

	Aimed(player,enemy) {
		return Math.sqrt(Math.pow(player.x-enemy.x,2)+Math.pow(player.y-enemy.y,2)) <= this.RADIUS;
	}
	Seen(player,enemy) {
		return Math.abs(player.x-enemy.x) <= this.ScreenWidth/2 && Math.abs(player.y-enemy.y) <= this.ScreenHeight/2;
	}
	ValidKill(PlayerObj,EnemyObj,word) {
		return this.Aimed(PlayerObj,EnemyObj) && word == EnemyObj.PrivName;
	}
	Dead(playerid) {
		while(!this.LoggedInPlayers.has(playerid));
		return !this.Players.has(playerid);
	}

	Fire(playerid,word) {
		let dead = []
		var PlayerFired = this.Players.get(playerid);
		this.Players.forEach((PlayerObj,PlayerId) => {
				if(this.ValidKill(PlayerFired,PlayerObj,word)) {
					dead.push(PlayerId);
				}
		});
		this.Enemies.forEach((EnemyObj,EnemyId) => {
				if(this.ValidKill(PlayerFired,EnemyObj,word)) {
					dead.push(EnemyId);
				}
		});
		PlayerFired.score += dead.length;
		dead.forEach((ObjId) => {
			if(this.Enemies.has(ObjId))this.Enemies.delete(ObjId);
			if(this.Players.has(ObjId))this.Players.delete(ObjId);
		});
		return;
	}

	JSONAddGameObj(args,id,x,y,ImgName,HeadText) {
		args.ids.push(id);
		args.xs.push(x);
		args.ys.push(y);
		args.imgnames.push(ImgName);
		args.headtexts.push(HeadText);
		return;
	}

	Recv(title,playerid,args) {
		if(this.Dead(playerid)){
			return;
		}
		console.log(`playscreen received from ${playerid} : ${title}`);
		let player = this.Players.get(playerid);
		switch(title) {
			case "LEFT"  : player.x -= this.STEP; break;
			case "RIGHT" : player.x += this.STEP; break;
			case "UP"    : player.y -= this.STEP; break;
			case "DOWN"  : player.y += this.STEP; break;
			case "INPUT" : this.Fire(playerid,args.word); break;
		}
		return;
	}

	SendScreen(playerid,ws) {
		var jsonobj = {};
		jsonobj.args = {
			ids:[],
			xs:[],
			ys:[],
			imgnames:[],
			headtexts:[]
		};
		var PlayerObj = this.Players.get(playerid);
		//console.log(`send screen to ${playerid}`);
		console.log(PlayerObj);

		this.Players.forEach((OtherPlayer,OtherPlayerId) => {
			if(this.Seen(PlayerObj,OtherPlayer)) {
				var Shifted = OtherPlayer.clone();
				Shifted.x -= PlayerObj.x;
				Shifted.y -= PlayerObj.y;
				if(OtherPlayerId != playerid) Shifted.ImgName = 'miku.jpg';
				this.JSONAddGameObj(jsonobj.args,Shifted.id,Shifted.x,Shifted.y,Shifted.ImgName,Shifted.PublName);
			}
		});
		this.Enemies.forEach((EnemyObj,EnemyId) => {
			if(this.Seen(PlayerObj,EnemyObj)) {
				var Shifted = EnemyObj.clone();
				if(this.Aimed(PlayerObj,EnemyObj)) Shifted.ImgName = 'orange.jpg'
				Shifted.x -= PlayerObj.x;
				Shifted.y -= PlayerObj.y;
				this.JSONAddGameObj(jsonobj.args,Shifted.id,Shifted.x,Shifted.y,Shifted.ImgName,Shifted.PublName);
			}
		});

		jsonobj.args.score = PlayerObj.score;
		jsonobj.title = "UPDATE";
		//console.log(JSON.stringify(JSON.parse(JSON.stringify(jsonobj))));
		ws.send(JSON.stringify(jsonobj));
		return;
	}
	SendGameOver(playerid,ws) {
		var jsonobj = {};
		jsonobj.args = {
			score: this.LoggedInPlayers.get(playerid).score
		};
		jsonobj.title = "GAMEOVER";
		ws.send(JSON.stringify(jsonobj));
		return;
	}

	Send(playerid,ws) {
		if(this.Dead(playerid))this.SendGameOver(playerid,ws);
		else this.SendScreen(playerid,ws);
	}

	AddPlayer(playerid,args) {
		console.log(`PlayScreen add player:${playerid}`);
		const name = this.NameHandler.GetName();
		this.Players.set(playerid,new PlayScreen.PlayerInfo(playerid,
				RandInt(0,this.H),RandInt(0,this.W),'blue.jpg',name));
		this.LoggedInPlayers.set(playerid,this.Players.get(playerid));
	}
	RemovePlayer(playerid) {
		if(this.Players.has(playerid))this.Players.delete(playerid);
		if(this.LoggedInPlayers.has(playerid))this.LoggedInPlayers.delete(playerid);
	}
	Update() {
		while(this.Enemies.size < 100) {
			this.TotalEnemies ++;
			const name = this.NameHandler.GetName();
			const enemyid = "enemy"+this.TotalEnemies.toString();
			this.Enemies.set(enemyid,new PlayScreen.GameObject(enemyid,
					RandInt(0,this.H),RandInt(0,this.W),'red.jpg',name));
		}
		console.log(`update play screen!,playercount = ${this.LoggedInPlayers.size}`)
	}
};

module.exports = PlayScreen;
