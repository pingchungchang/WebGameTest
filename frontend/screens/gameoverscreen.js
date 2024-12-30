class GameOverScreen extends Scene{
	constructor() {
		super();
		this.divid = 'GameOverScreen';
	}

	Init(args) {
		console.log(args.score);
		document.getElementById('GameOverScreenScore').textContent=`Score : ${args.score}`;
	}

	SendKey() {
		return;
	}
}

gameoverscreen = new GameOverScreen();
console.log(gameoverscreen.divid);
