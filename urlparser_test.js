
const exec = require('child_process').exec;

var urlparser = require('./urlparser.js');

urlparser.getUrl("https://soundcloud.com/vulvulpes/sets/vv001-fusion-of-horizons-2016",true,convertMedia);

function convertMedia(file){

	console.log("Convert file "+ file);
	var cmd = "sox '" + file +"' '" + file +"_mono.wav' remix 1-2";
	exec(cmd,{maxBuffer:200*1024*1000},function(error,stdout,stderr){ 
		console.log(stderr);
		
    	console.log("Convert to mono!");
    	playMedia(file + "_mono.wav");

    });

}

function playMedia(file){
	console.log("Play "+ file);
}