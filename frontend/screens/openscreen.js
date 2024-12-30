class OpenScreen extends Scene{
	constructor() {
		super();
		this.divid = 'OpenScreen';
	}

	Init() {
		var heading = document.getElementById("OpenScreenButton");
		heading.addEventListener('click',() => ChangeScene(this,playscreen));
	}

	SendKey() {
		return;
	}
}

openscreen = new OpenScreen();
