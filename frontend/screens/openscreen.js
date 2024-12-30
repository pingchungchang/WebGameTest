class OpenScreen extends Scene{
	constructor() {
		super();
		this.divid = 'OpenScreen';
	}

	Init() {
		let StartGameButton = document.getElementById("OpenScreenStartGameButton");
		StartGameButton.addEventListener('click',() => ChangeScene(this,playscreen));
	}

	SendKey() {
		return;
	}
}

openscreen = new OpenScreen();
