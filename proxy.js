
// Youtube-dl proxy service, run locally or publicly

// Install youtubedl

// sudo wget https://yt-dl.org/downloads/latest/youtube-dl -O /usr/local/bin/youtube-dl
// sudo chmod a+rx /usr/local/bin/youtube-dl

//////////////////////////////////////////////////////////////////////////////

const youtubedl = "/usr/local/bin/youtube-dl";
const port = 5000

//////////////////////////////////////////////////////////////////////////////

var colors = require('colors');
var request = require("request")

const exec = require('child_process').exec;

const express = require('express')
const app = express()

console.log('LINKI URL PROXT STARTED!'.green);

app.listen(port, () => console.log(`Listening commands on port ${port}!`.green))


//////////////////////////////////////////////////////////////////////////////

// Update Youtube DL

updateYoutubeDl();
 
//////////////////////////////////////////////////////////////////////////////

app.get('/', function (req, res) {

	var out = {};

	res.setHeader('Content-Type', 'application/json');

	//////////////////////////
	// Check input

	if(!req.query.url){
		out.error = "No url specified";
		res.end(JSON.stringify(out));
		return false;
	}

	if(req.query.playlist_start){
		var playlist_start = parseInt(req.query.playlist_start);
	} else {
		var playlist_start = 0;
	}

	if(req.query.playlist_end){
		var playlist_end = parseInt(req.query.playlist_end);
	} else {
		var playlist_end = 1;
	}

	var url  = trim(req.query.url);


	//////////////////////////
	// Execute Youtube-dl

  	var cmd = youtubedl + " -g --quiet --no-warnings --ignore-errors -f best" + ' --playlist-start ' + (playlist_start+1) + ' --playlist-end ' + (playlist_end+1) + " " + url;

	console.log(cmd.yellow);

    exec(cmd,{maxBuffer:200*1024*1000},function(error,stdout,stderr){ 

    	console.log("Youtube dl result:".green);
		stdout = trim(stdout);
		if(stderr){

			console.log(stderr.red);
			if(stderr.includes("ERROR: Unsupported URL")){

				console.log("Check this url for linki.json: " + url + "/linki.json");

				// Check if special linki url
				request({
				    url: url+ "/linki.json",
				    json: true
				}, function (error, response, body) {

				    if (!error && response.statusCode === 200) {
				        out.linkijson = body;
	 	 		 		res.end(JSON.stringify(out));
				    } else {
				    	out.error = "unsupported url";
	 	 		 		res.end(JSON.stringify(out));
				    }
				})

	 	 		 return false;
			}

		} else if(stdout) {

			console.log(stdout.blue);
			out.media_url = stdout.split("\n");
			out.playlist_start = playlist_start;
			

			if(playlist_end - playlist_start > out.media_url.length){
				out.playlist_total = playlist_start + out.media_url.length;
				out.playlist_done = true;
			} else {
				out.playlist_end = playlist_end;
				out.playlist_done = false;
			}

	 	 	res.end(JSON.stringify(out));
	 	 	return true;

		}
		
    });
  
});

// app.use(express.static('html'));

//////////////////////////////////////////////////////////////////////////////

function trim(str){

  str = str.replace(/^\s+|\s+$/g,'');
  return str;

}

//////////////////////////////////////////////////////////////////////////////

function updateYoutubeDl(){

	var cmd = youtubedl + " -U";

	exec(cmd,{maxBuffer:200*1024*1000},function(error,stdout,stderr){ 
		console.log(stdout);
	});

}

//////////////////////////////////////////////////////////////////////////////
