var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var storyParts = [];

var mongoose = require('mongoose');
var Word=require('./Model/word');
const dbMongo='mongodb://localhost:27017/bdStory';
const port=8080;
var nowWord = "-"; 

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

/*
app.options('*', cors())
app.use(function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*')
   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
   next()
 })
*/

mongoose.connect(dbMongo, function(err, res){
    if (err) {
        return console.log(`Error al conectarse a la base de datos: ${err}`);
    } else {
        console.log("conecion establecida");
    }
});

// ingresar palabra a la bd
app.post('/api/setWord',function(req, res){
	let word = new Word();
    word.word=req.param('inputWord');
	word.save((err, storedWord) => {
        if (err) {
            res.status(500) // los 500 son errores del Servidor
            res.send({ message: `Error al guardar elemento en la BD ${err}` });
        }else {
            res.status(200);
            res.redirect('/'); // luego de insertar redireciona
            res.end(); // finalizar la petición
        }
    });
});

app.get('/api/words', function(req, res){
    // con el {} trae todas las palabras
    Word.find({}, (err, words) => {
        if (err) return res.status(500).send({ message: `Error al buscar ${err}` });
        if (!words) return res.status(404).send({ message: `No hay palabras` });
        res.status(200).send({ words: words });
    });
});

io.on('connection', function(socket) {
	console.log('Alguien se ha conectado con Sockets');
	socket.emit('story', storyParts);
    socket.emit('new-word', nowWord);

	socket.on('story', function(data) {
	  storyParts.push(data);
      io.sockets.emit('story', storyParts);
      randomWord(function(err , data){
        io.emit('new-word', data);
      });
     
});
});

function randomWord(callback){
    Word.find({}, (err, words) => {
        var number=Math.floor(Math.random()*words.length);  
        nowWord = words[number].word;
        callback(0, nowWord);
    });
}

server.listen(port, function(){
	console.log("Corriendo por el puerto "+port)
});

