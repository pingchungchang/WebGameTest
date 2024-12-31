class OpenScreen extends Scene{
	constructor() {
		super();
		this.divid = 'OpenScreen';
	}

	Init(args) {
		let StartGameButton = document.getElementById("OpenScreenStartGameButton");
		StartGameButton.addEventListener('click',() => ChangeScene(this,playscreen));
		let SettingButton = document.getElementById("OpenScreenSettingButton");
		SettingButton.addEventListener('click',() => ChangeScene(this,settingscreen));
	}

	SendKey() {
		return;
	}
}

openscreen = new OpenScreen();
