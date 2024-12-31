class SettingScreen extends Scene{
	constructor() {
		super();
		this.divid = 'SettingScreen';
		this.CONFIGS = {
			UP:"UP",
			DOWN:"DOWN",
			LEFT:"LEFT",
			RIGHT:"RIGHT",
			INSERT:"INSERT MODE"
		};
		this.ChosenOption = null;
	}

	Unselect(OptionName) {
		document.getElementById(OptionName).style['border-color'] = 'black';
		this.ChosenOption = null;
	}

	Selected(OptionName) {
		if(this.ChosenOption) this.Unselect(this.ChosenOption);
		this.ChosenOption = OptionName;
		document.getElementById(OptionName).style['border-color'] = 'red';
		return;
	}

	SetOption(OptionName,KeyName) {
		console.log(OptionName,KeyName);
		playscreen[OptionName] = KeyName;
		let OptionObj = document.getElementById(OptionName);
		OptionObj.textContent = `${this.CONFIGS[OptionName]} : ${playscreen[OptionName]}`;
		this.Unselect(OptionName);
	}

	CreateOption(Description,OptionName) {
		let OptionObj = document.createElement('div');
		OptionObj.id = OptionName;
		OptionObj.classList.add('settings');
		console.log(`${OptionName} : ${playscreen[OptionName]}`);
		OptionObj.textContent = `${Description} : ${playscreen[OptionName]}`;
		OptionObj.addEventListener('click',() => {this.Selected(OptionName);});
		document.getElementById(this.divid).appendChild(OptionObj);
	}

	ValidKeySetting() {
		var UsedKeys = new Set();
		for(let OptionName in this.CONFIGS) {
			if(UsedKeys.has(playscreen[OptionName])) return false;
			UsedKeys.add(playscreen[OptionName]);
		}
		return true;
	}

	SaveQuit() {
		if(!this.ValidKeySetting()) alert('invalid key settings, all keys should be distinct!');
		else ChangeScene(this,openscreen,{});
	}

	Init(args) {
		ClearDiv(this.divid);
		console.log('hi');
		let SaveObj = CreateHTMLElement({
			id:"SaveQuit",
			type:"button",
			par:`${this.divid}`,
			style:'position:absolute;top:0%;left:0%;width:250px;height:70px;font-size:30px;',
			textContent:'Save & Quit'
		});
		SaveObj.addEventListener('click',() => {this.SaveQuit()});
		for(const OptionName in this.CONFIGS){
			this.CreateOption(this.CONFIGS[OptionName],OptionName);
		}
		return;
	}

	SendKey() {
		if(!PressedKeys.size)return;
		if(this.ChosenOption) this.SetOption(this.ChosenOption,PressedKeys.values().next().value);
		console.log(PressedKeys);
		return;
	}
}

settingscreen = new SettingScreen();
