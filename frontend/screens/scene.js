function show(ElementId) {
	document.getElementById(ElementId).classList.remove('hide')
	document.getElementById(ElementId).classList.add('show')
}

function hide(ElementId) {
	document.getElementById(ElementId).classList.remove('show')
	document.getElementById(ElementId).classList.add('hide')
}

function CreateHTMLElement(args) {
	if(!args.type) return;
	let Obj = document.createElement(args.type);
	for(var argname in args) {
		if(argname === 'type' || argname === 'par') continue;
		Obj[argname] = args[argname];
	}
	if(args.par)document.getElementById(args.par).appendChild(Obj);
	return Obj;
}

function ClearDiv(divid) {
	let Obj = document.getElementById(divid);
	Obj.innerHTML = '';
	return;
}

function ChangeScene(PrevScene, NewScene, args) {
	console.log('change scene!');
	console.log(`Prev=${PrevScene}, New = ${NewScene}`);
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
var settingscreen;
