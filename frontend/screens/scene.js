function show(ElementId) {
	document.getElementById(ElementId).classList.remove('hide')
	document.getElementById(ElementId).classList.add('show')
}

function hide(ElementId) {
	document.getElementById(ElementId).classList.remove('show')
	document.getElementById(ElementId).classList.add('hide')
}

function ChangeScene(PrevScene, NewScene, args) {
	console.log('change scene!');
	PrevScene.Init();
	hide(PrevScene.divid);
	show(NewScene.divid);
	let jsonobj = {};
	jsonobj.args = {
		OldScreen: PrevScene.divid,
		NewScreen: NewScene.divid
	};
	Send("ChangeScreen",jsonobj);
	NewScene.Init(args);
	NowScene = NewScene;
}

class Scene {
	SendKey() {}
	Recv(args) {}
	Init(args) {}
}

var openscreen;
var playscreen;
var gameoverscreen;
