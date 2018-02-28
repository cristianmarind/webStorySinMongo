var socket = io.connect('http://localhost:4100/', {'forceNew': true});
var pStory = document.getElementById('pStory');

socket.on('story-new-part', function (data) {
    renderStoryPart(data);
});

socket.on('initial', function (data) {
    renderStory(data);
});

document.getElementById('enviar').onclick = function(){
	var part = {
		author: document.getElementById('author').value,
		text: document.getElementById('text').value
	}
	socket.emit('new-part', part);
};

function renderStoryPart(newPart){
	console.log(pStory);
	pStory.innerHTML = pStory.innerHTML+newPart.text+" ";
}

function renderStory(story){
	for (var i = 0; i < story.length; i++) {
		pStory.innerHTML = pStory.innerHTML+story[i].text+" ";
	}
}