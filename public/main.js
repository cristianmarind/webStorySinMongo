var socket = io.connect({ 'forceNew': true });
var pStory = document.getElementById('pStory');
var palabraActual;

socket.on('story', function (data) {
	renderStory(data);
	if (data.length > 0) {
		Materialize.toast('Hay una nueva oración en la historia', 2000);
	}
});

socket.on('new-word', function (data) {
	renderWord(data);
});

document.getElementById('enviar_historia').onclick = function () {
	var part = {
		author: document.getElementById('author').value,
		text: document.getElementById('message').value
	}
	socket.emit('story', part);
};

function renderWord(wordGet) {
	document.getElementById('wordText').innerHTML=wordGet;

}

function renderStory(data) {
	var html = data.map(function (elem, index) {
		return (`<span class="tooltipped" data-position="top" data-delay="50" data-tooltip="Autor: ${elem.author}">${elem.text}</span>`);
	}).join(" ");
	document.getElementById('pStory').innerHTML = html;
	$('.tooltipped').tooltip();
}

(function ($) {
	$(function () {
		$('.parallax').parallax();
	}); // end of document ready
})(jQuery); // end of jQuery name space
