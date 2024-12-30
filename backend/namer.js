const {RandInt} = require("./tools.js");
const fs        = require('fs');
const readline  = require('readline');

class Name{
	constructor(PublName,PrivName) {
		this.PublName = PublName;
		this.PrivName = PrivName;
	}
}

class Namer{

	LoadFile(FileName) {
		var inputStream = fs.createReadStream(FileName);
		var lineReader = readline.createInterface({ input: inputStream });
		lineReader.on('line', (line) => {
				var data = line.split(':');
				if(data.length != 2) {
					console.log(`data size error!`);
					return;
				}
				this.AllNames.push(new Name(data[0],data[1]));
				return;
		});
		return;
	}

	constructor(FileName) {
		this.AllNames = [];
		this.loaded = this.LoadFile(FileName);
	}
	GetName() {
		while(this.AllNames.length < 1){
			console.log(`loading:${this.AllNames}`);
		}
		var pos = RandInt(0,this.AllNames.length-1);
		return this.AllNames[pos];
	}
};

module.exports = {Name,Namer};
