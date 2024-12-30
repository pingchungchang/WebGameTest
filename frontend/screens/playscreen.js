class PlayScreen extends Scene{

	static GameObject = class {
		constructor(id,x,y,ImgName,HeadText) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.ImgName = ImgName;
			this.HeadText = HeadText;
		}

	}

	constructor() {
		super();
		this.divid = 'PlayScreen';
		this.PlayScreen = document.getElementById('PlayScreen');
		this.GameObjects = new Set();
		this.counter = 0;
		this.INSERT = 'i';
		this.LEFT = 'h';
		this.RIGHT = 'l';
		this.UP = 'k';
		this.DOWN = 'j';
		this.insert_mode = 0;
		this.normal_mode = 0;

	}


	CreateGameObject(id,x,y,ImgName,HeadText) { //returns id
		var div = document.createElement("div");
		div.id = id.toString();
		div.classList.add("gameobject");
		var img = document.createElement("img");
		img.classList.add("objectimage");
		var txt = document.createElement('div');
		txt.classList.add("headtext");
		img.src = 'images/'+ImgName;
		txt.textContent = HeadText;
		div.appendChild(txt);
		div.appendChild(img);
		document.getElementById('PlayScreen').appendChild(div);
		div.style.left = x.toString()+"px";
		div.style.top = y.toString()+"px";
		this.GameObjects.add(div.id);
		return;
	}

	RemoveGameObject(id) {
		if(!this.GameObjects.has(id)) {
			return;
		}
		var div = document.getElementById(id)
		if(div) {
			div.remove();
		}
		this.GameObjects.delete(id);
		return;
	}

	ClearScreen() {
		document.getElementById('PlayScreenScore').textContent = `Score : 0`
		var buffer = [...this.GameObjects];//array<String>
		buffer.forEach((now) => {
			this.RemoveGameObject(now);
		});
	}

	UpdateScreen(args) {
		this.ClearScreen();
		console.log(args);
		let NewGameObjects = this.ParseObjects(args.ids,args.xs,args.ys,args.imgnames,args.headtexts);
		this.ShiftCenter(NewGameObjects);
		console.log(NewGameObjects);

		document.getElementById('PlayScreenScore').textContent = `Score : ${args.score}`;

		NewGameObjects.forEach((now) => { // Set<GameObject>
			this.CreateGameObject(now.id,now.x,now.y,now.ImgName,now.HeadText);
		});
		return;
	}

	ToNormalMode() {
		this.insert_mode = 0;
		this.normal_mode = 1;
		console.log('ToNormalMode!');
		hide('PlayScreenInputBox');
		return;
	}

	ToInsertMode() {
		this.normal_mode = 0;
		this.insert_mode = 1;
		show('PlayScreenInputBox');
		var inputbox = document.getElementById('PlayScreenInputBox');
		inputbox.value = '';
		inputbox.focus();
		return;
	}

	Init(args) {
		this.ClearScreen();
		this.ToNormalMode();
		return;
	}

	SendInsertModeKeys() {
		if(PressedKeys.has('Enter')) {
			var msg = document.getElementById('PlayScreenInputBox').value;
			let jsonobj = {};
			jsonobj.args = {
				word: msg
			};
			Send('INPUT',jsonobj);
			this.ToNormalMode();
		}
		return;
	}

	SendNormalModeKeys() {
		if(PressedKeys.has(this.INSERT))     this.ToInsertMode();
		else if(PressedKeys.has(this.LEFT))  Send("LEFT",{});
		else if(PressedKeys.has(this.RIGHT)) Send("RIGHT",{});
		else if(PressedKeys.has(this.UP))    Send("UP",{});
		else if(PressedKeys.has(this.DOWN))  Send("DOWN",{});
		return;
	}

	SendKey() {
		if(this.insert_mode)      this.SendInsertModeKeys();
		else if(this.normal_mode) this.SendNormalModeKeys();
		return;
	}

	ParseObjects(ids,xs,ys,imgnames,headtexts) {
		var obj = new Set();
		for(var i = 0;i<ids.length;i++){
			obj.add(new PlayScreen.GameObject(ids[i],xs[i],ys[i],imgnames[i],headtexts[i]));
		}
		return obj;
	}

	ShiftCenter(NewGameObjects) {
		NewGameObjects.forEach( (now) => {
			now.x += window.innerWidth/2;
			now.y += window.innerHeight/2;
		});
		return;
	}

	Recv(data) {
		console.log(data.title);
		switch(data.title) {
			case "UPDATE":
				this.UpdateScreen(data.args);
				break;
			case "GAMEOVER":
				ChangeScene(this,gameoverscreen,{score:data.args.score});
				console.log('Game Over!!!');
				break;
		}
		return;
	}

}

playscreen = new PlayScreen()
