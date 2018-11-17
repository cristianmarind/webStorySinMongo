'use strict'
class WordSchema{
    constructor(word){
        this.word = word;
    }

    getWord(){
        return this.word;
    }
}


// para exportar el modelo y que se pueda usar desde cualquier
// parte de la aplicación 

module.exports=WordSchema