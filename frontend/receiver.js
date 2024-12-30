
socket.addEventListener('message', function(e) {
	var msg = JSON.parse(e.data);
	console.log(msg);
	console.log('----');
	if(msg.title === 'GivePlayerId') PlayerId = msg.id;
	else NowScene.Recv(msg);
	console.log(`playerid = ${PlayerId}`);
});
