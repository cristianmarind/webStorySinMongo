var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var storyParts = [];

var Word=require('./Model/word');
const port=3000;
var nowWord = ""; 

var arr = []

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// ingresar palabra a la bd
app.post('/api/setWord',function(req, res){
    let word;
    if (req.param('inputWord') === undefined) {
        res.status(500) // los 500 son errores del Servidor
        res.send({ message: `No se tiene parametro para el servicio` });
    }else {
        word = new Word(req.param('inputWord'));
        arr.push(word);
        res.status(200);
        res.redirect('/'); // luego de insertar redireciona
        res.end(); // finalizar la petición
    } 
});

app.get('/api/words', function(req, res){
    if (words.length == 0) return res.status(404).send({ message: `No hay palabras` });
    res.status(200).send({ words: arr });
});

io.on('connection', function (socket) {
    console.log('Alguien se ha conectado con Sockets');
    socket.emit('story', storyParts);
    socket.emit('new-word', nowWord);

    socket.on('sent-story', function (data) {
        storyParts.push(data);
        io.sockets.emit('story', storyParts);
        randomWord(function (err, data) {
            io.emit('new-word', data);
        });

    });
});

function randomWord(callback){
    var number=Math.floor(Math.random()*arr.length);  
    if(number == 0){
        callback(0, "");
        return;
    }
    nowWord = arr[number].getWord();
    callback(0, nowWord);
}

server.listen(process.env.PORT || port, function(){
	console.log("Corriendo por el puerto "+port)
});

