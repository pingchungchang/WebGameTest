const EmptyScreen = require("./emptyscreen.js");
const PlayScreen = require("./playscreen.js");

const PORT = 48763;
const WebSocket = require('ws');
const wss = new WebSocket.Server({
  port: PORT
});

var TotalPlayerCount = 0;
var PlayerCount = 0;
var PlayerScreenMap = {};
var PlayerClientMap = {};
var ClientPlayerMap = {};

const ScreenMap = {
	OpenScreen: new EmptyScreen(),
	PlayScreen: new PlayScreen('./data/demo.txt'),
	GameOverScreen: new EmptyScreen(),
	SettingScreen: new EmptyScreen()
};

//ChangeScreen doesn't send stuff to client!!
function ChangeScreen(PlayerId,OldScreenName,NewScreenName,args) {
	console.log(`id=${PlayerId}, old=${OldScreenName}, new = ${NewScreenName}`);
	if(OldScreenName in ScreenMap)ScreenMap[OldScreenName].RemovePlayer(PlayerId);
	ScreenMap[NewScreenName].AddPlayer(PlayerId,args);
	PlayerScreenMap[PlayerId] = ScreenMap[NewScreenName];
	return;
}

console.log('hi');


wss.on('connection', ws => {
	PlayerCount ++;
	TotalPlayerCount ++;
	let jsonobj = {};
	let playerid = "player"+TotalPlayerCount.toString();
	jsonobj.title = "GivePlayerId";
	jsonobj.id = playerid;
	jsonobj.args = {};
	ws.send(JSON.stringify(jsonobj));

	PlayerScreenMap[playerid] = ScreenMap.OpenScreen;
	PlayerScreenMap[playerid].AddPlayer(playerid);
	PlayerClientMap[playerid] = ws;
	ClientPlayerMap[ws] = playerid;

	ws.on('message', data => {
		console.log(`received: \n${data}`);
		data = JSON.parse(data);
		if(data.title === "ChangeScreen")ChangeScreen(data.id,data.args.OldScreen,data.args.NewScreen,data.args);
		else PlayerScreenMap[data.id].Recv(data.title,data.id,data.args);
	});

	var tid = null;
	var PlayerUpdate = function() {
		if(!(playerid in PlayerScreenMap))clearInterval(tid);
		else {
			//console.log(PlayerScreenMap[playerid]);
			PlayerScreenMap[playerid].Send(playerid,ws);
		}
	};
	tid = setInterval(PlayerUpdate,60);

    ws.on('close', () => {
		PlayerScreenMap[playerid].RemovePlayer(playerid);
		clearInterval(tid);
		delete ClientPlayerMap[ws];
        delete PlayerScreenMap[playerid];
        delete PlayerClientMap[playerid];
        console.log('Close connected')
    })
});

setInterval(() => {
	for(ScreenName in ScreenMap){
		ScreenMap[ScreenName].Update();
	}
},100);
