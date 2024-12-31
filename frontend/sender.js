const IP_ADDR = 'localhost'
const socket = new WebSocket(`ws://${IP_ADDR}:48763`);

var PlayerId = 'mikumikudayo';//should be implemented in recv or sth
var NowScene;

function Send(title,args) { // args should be a json
	args.title = title;
	args.id = PlayerId;
	console.log(JSON.stringify(JSON.parse(JSON.stringify(args))));
	socket.send(JSON.stringify(args));
}
PressedKeys = new Set();

document.onkeydown = function(e) {
	if(e.key == 'Alt' || e.key == 'Tab')return;
	PressedKeys.add(e.key);
	return;
};

document.onkeyup = function(e) {
	PressedKeys.delete(e.key);
	return;
};

function SendSceneKey() {
	if (NowScene && typeof NowScene.SendKey === 'function') {
		NowScene.SendKey();
	} 
	else {
		console.warn('NowScene is not set or does not have a SendKey method.');
	}
	return;
}

setInterval(SendSceneKey,60);
