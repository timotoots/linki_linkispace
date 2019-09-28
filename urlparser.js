
// Handles URL parsing, downloading, converting, caching

var fs = require('fs');
var sanitize = require("sanitize-filename");
var request = require("request")
var querystring = require("querystring");

var cache_path = "/opt/linki_linkispace/data/cache/"


exports.getUrl = function (url, enable_caching = true, callback) {

      var dirname = sanitize(url);

	  // Create directory for URL
	  if (!fs.existsSync(cache_path + dirname)) {
	      fs.mkdirSync(cache_path + dirname);
	  }

	  var cache_file = dirname + "/" + dirname + ".mp3";

	  // Check if file exists
	  if (fs.existsSync(cache_path + cache_file)) {

	    console.log("Cache found, lets play the sound! " + cache_file);
	    callback(cache_path + cache_file);

	  } else {
	   
	    console.log("No cache found, lets download! " + url);

	    var proxy_url = "http://localhost:5000/?" + querystring.stringify({"url":url});

		request({
		    url: proxy_url,
		    json: true
		}, function (error, response, body) {

		    if (!error && response.statusCode === 200) {
		    	if(body.media_url[0]){

					request(body.media_url[0], {encoding: 'binary'}, function(error, response, body) {
						console.log("Writing to "+ cache_path + cache_file);
					  fs.writeFile(cache_path + cache_file, body, 'binary', function (err) {});
					  callback(cache_path + cache_file);
					});

		    	}
		    	console.log(JSON.stringify(body));
	 		   	var full_filename = cache_path + dirname+'/' + dirname + ".m4a";
	 		   	return full_filename;
		    } else {
	 		    console.log(error)
		    }
		});


	  }

}; 
 




