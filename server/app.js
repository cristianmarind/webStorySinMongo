var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var storyParts = [];
app.use(express.static('public'));


io.on('connection', function(socket) {
	console.log('Alguien se ha conectado con Sockets');
	socket.emit('story', storyParts);
  
	socket.on('story', function(data) {
	  storyParts.push(data);
	  io.sockets.emit('story', storyParts);
	});
  });

server.listen(8080, function(){
	console.log("Corriendo por el puerto 8080")
});