
function Sign(k) {
	return k>0?1:k<0?-1:0;
}

function RandInt(l,r) {
	return Math.floor(Math.random()*(r-l)+l);
}

module.exports = {RandInt,Sign};
