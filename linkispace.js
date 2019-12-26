

const cmd = require('node-cmd');
 
 var colors = require('colors');

var fs = require("fs");
var path = require('path');

var datapath = "/opt/linki_linkispace/data";

var linkies = JSON.parse(fs.readFileSync(datapath + "/linkies.json"));

// get linki files

var linkisounds = {};


var soundstates = {};

var activeSound = "";

var joystickPosition = [0,0,-1];

var currentNumLoaded = 0;

var currentNfcUrl = "";

const processRef = cmd.get('/usr/local/bin/soundspace  --stdin -s /opt/linki_linkispace/data/');
let data_line = '';
 
//listen to the python terminal output
processRef.stdout.on(
  'data',
  function(data) {
    data_line += data;
    if (data_line[data_line.length-1] == '\n') {
      console.log(data_line.gray);
    }
  }
);


var _getAllFilesFromFolder = function(dir) {

    var filesystem = require("fs");
    var results = [];

    filesystem.readdirSync(dir).forEach(function(file) {

        file = dir+'/'+file;
        var stat = filesystem.statSync(file);

        if (stat && stat.isDirectory()) {
            results = results.concat(_getAllFilesFromFolder(file))
        } else results.push(file);

    });

    return results;

};


for (var i = 1; i <= 12; i++) {

  if(  fs.existsSync(datapath+"/yleheli2019_converted/"+i) ){

    var sounds = _getAllFilesFromFolder(datapath+"/yleheli2019_converted/"+i);

	if(sounds.length>0){
		linkisounds[i] = {};
	    if(sounds.length==1){
	    	linkisounds[i].channels = 1;
	    	linkisounds[i].files = ["yleheli2019_converted/" + i +"/1.wav"];
	    	addSound(linkisounds[i].files[0]);
	    } else if(sounds.length==4){
	    	linkisounds[i].channels = 4;
	    	linkisounds[i].files = ["yleheli2019_converted/" + i + "/1.wav","yleheli2019_converted/" + i + "/2.wav","yleheli2019_converted/" + i + "/3.wav","yleheli2019_converted/" + i + "/4.wav"];
	    }
    }
  }
}


function getLinkiFilesById(uid){

	if(typeof linkies[uid] != "undefined"){

		linki_id = linkies[uid];

		if(typeof linkisounds[linki_id] != "undefined"){
			return linkisounds[linki_id];
		}

		console.log("No sound for this linki");
		return false;
	}
	
	console.log("No linki in database");
	return false;


}

////////////////////////////////////////

const express = require('express')
const app = express()
const port = 3000


app.listen(port, () => console.log(`Listening commands on port ${port}!`))

app.get('/rotation', function (req, res) {
  res.send('rotation changed!')
  console.log(req.query.test);
  
})

app.get('/soundstates', function (req, res) {
  res.send(JSON.stringify(soundstates))
  console.log(req.query.test);
})

app.use(express.static('html'))

////////////////////////////////////////

// var urlparser = require('./urlparser.js');

// urlparser.getUrl()

////////////////////////////////////////////////////////////////////////////////////////////////////
// Serial

var serialDevice = "/dev/ttyUSB0";
var serialDevice2 = "/dev/ttyUSB1";

var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

try{
	var serialport = new SerialPort(serialDevice, {
	  baudRate: 115200
	});

} catch(e){
  console.log("No device connected to " + serialDevice);
  process.exit();
}

try{
	var serialport2 = new SerialPort(serialDevice2, {
	  baudRate: 115200
	});

} catch(e){
  console.log("No device connected to " + serialDevice2);
  process.exit();
}

var serialport_opened = false;

function boot(){
  	changeMatrix(0);
 	changeLed(0,"color","blue");
		changeLed(1,"white",0);
		changeLed(2,"white",0);
		changeLed(3,"white",0);
		changeLed(4,"white",0);

}

serialport2.on('open', function(){
  console.log('Serial port2 opened'.green);
  if(serialport_opened==true){
  	boot();
  }
  serialport_opened = true;
});


serialport.on('open', function(){
  console.log('Serial port1 opened'.green);
  if(serialport_opened==true){
  	boot();
  }
  serialport_opened = true;
});



const parser = new Readline({delimiter: '\n'});
serialport.pipe(parser);
serialport2.pipe(parser);

////////////////////////////////////////////////////////////////////////////////////////////////////

function checkSerialPort(){

	const exec = require('child_process').exec;
	exec("ls "+serialDevice,{maxBuffer:200*1024*1000},function(error,stdout,stderr){ 
		setTimeout(checkSerialPort,5000);
		
		if(trim(stdout)==serialDevice){
			// console.log("USB device alive".green);
		} else {
			console.log("Arduino device not connected!".red);
		}

	});


}

checkSerialPort();


function joystickDistance(pointX,pointY) {

	var point = {};
	point.latitude = pointX;
	point.longitude = pointY;

	var interest = {"latitude":134,"longitude":126};


  let deg2rad = (n) => { return Math.tan(n * (Math.PI/180)) };

  let dLat = deg2rad(interest.latitude - point.latitude );
  let dLon = deg2rad( interest.longitude - point.longitude );

  let a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(point.latitude)) * Math.cos(deg2rad(interest.latitude)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  let c = 2 * Math.asin(Math.sqrt(a));

  c = c.toFixed(2);

  return c;
}

/*

Input:
Center of the circle (x, y)
Radius of circle: r
Point inside a circle (a, b)

*/

function check_a_point(a, b, x, y, r) {
    var dist_points = (a - x) * (a - x) + (b - y) * (b - y);
    r *= r;
    if (dist_points < r) {
        return true;
    }
    return false;
}



////////////////////////////////////////////////////////////////////////////////////////////////////

var currentPotX = 127.5
var currentPotY = 127.5

var currentNfcUid = "";

 parser.on('data', function(data){

   // DEBUG

   data = trim(data);
   datas = data.split(":");

   var data_spaces = data.split(" ");


	if(data=="START"){
   		console.log("INPUT: Serial port READY".yellow);

   	} else if(data_spaces[0]=="Payload" && data_spaces[1]!="Length" && currentNfcUrl==""){

   		var nfc_url = data_spaces;
   		nfc_url.shift();
   		var urlStart = 0;
   		var urlOut = "";

   		for(var i =0;i < nfc_url.length;i++){
   			if(urlStart==1){
   				urlOut = urlOut + nfc_url[i];
   			} else if(nfc_url[i].length!=2){
   				urlStart = 1;
   				urlOut = urlOut + nfc_url[i];
   			} else {
   				nfc_url.shift();
   				
   			}
   		}
   		if(urlOut[0]=="."){
   			urlOut = urlOut.substr(1,urlOut.length-1);
   		}

   		if(urlOut[urlOut.length]=="."){
   			urlOut = urlOut.substr(0,urlOut.length-1);
   		}

   		if(urlOut.substr(0,4)!="http"){
   			urlOut = "http://" + urlOut;
   		}
   		

   		currentNfcUrl = urlOut;

   		console.log("NFC_URL: " + urlOut);
    	console.log(data);
  		
   } else if(datas[0]=="NFC_STATUS" && datas[1]=="NO" && currentNfcUid!=""){

   		currentNfcUid = "";
   		currentNfcUrl = "";

   		 console.log("NFC_REMOVED!");

   		 activeSound = "";

   		 // change LEDS
   		
   } else if(data_spaces[0]=="UID"){

   		var nfc_uid = data_spaces;
   		nfc_uid.shift();
   		nfc_uid = nfc_uid.join("");

   		if(currentNfcUid!=nfc_uid){

   			if(typeof linkies[nfc_uid] === "undefined"){
   				console.log("Linkie not allowed");
   			} else {

   				if(currentNumLoaded<=5){

   					currentNfcUid = nfc_uid;
	   				currentNfcUrl = "";
	   				currentLinkie = linkies[nfc_uid];

	   				var currentLinkiSound = getLinkiFilesById(nfc_uid);

	   				if(currentLinkiSound.channels==1){
	   					// addSound(currentLinkiSound.files[0]);
	   					activeSound = currentLinkiSound.files[0];
	   					playSound(activeSound);

	  					console.log("Load 1ch sound");
	   				}

		   			console.log("NFC_UID: " + nfc_uid);

	   			} 
	   			

   			}
   			

   		}

   		
   }


    if(datas[0]=="TOUCH"){
   		var dbg = "INPUT: Touch: " + datas[1];
   		console.log(dbg.yellow);
	   	if(datas[1]=="UNLOAD_ALL"){

	   		for(var soundId in soundstates){
				if(soundstates[soundId].loadstate == "loaded"){
					unloadSound(soundId);
				}
			} // for
		}

    }





   if(activeSound == ""){
   	console.log("No activeSound");
   	return false;
   }

	//////////////////////////////////////////////////////////////////////
	// Joystick input

   if(datas[0]=="POTX" || datas[0]=="POTY"){

	   	console.log("POT: X=" + currentPotX + ", Y=" +currentPotY);

   	   	var centeredJoystick = check_a_point(currentPotX, currentPotY, 127.5, 127.5, 120);

		if(datas[0]=="POTX"){
		   	currentPotX = datas[1];	 
	    } else if(datas[0]=="POTY"){
			currentPotY = datas[1];   	
		}

	   if(!centeredJoystick){
	   		joystickPosition[0] = parseFloat(mapValues(currentPotX,0,255,-1.5,1.5, false));
  			joystickPosition[2] = parseFloat(mapValues(currentPotY,0,255,-1.5,1.5, false));
		   	positionSound(activeSound,joystickPosition);
		   	soundstates[activeSound].orbit_speed  = 0;
	   }
		   
	//////////////////////////////////////////////////////////////////////
	// Encoder input

   } else if(datas[0]=="ENC_SPEED"){

	   	//console.log("INPUT: Speed encoder".yellow);
	   	if(datas[1]=="UP"){
			if(soundstates[activeSound].orbit_speed < 99){
		   		soundstates[activeSound].orbit_speed = soundstates[activeSound].orbit_speed +2;
		   	}

	   	} else if(datas[1]=="DOWN"){
			if(soundstates[activeSound].orbit_speed > 1){
		   		soundstates[activeSound].orbit_speed = soundstates[activeSound].orbit_speed -2;
		   	} 
	   	}
   	
   	
	//////////////////////////////////////////////////////////////////////
	// Volume input

   	} else if(datas[0]=="ENC_VOLUME"){

   	// console.log("INPUT: Volume encoder".yellow);

	   	 if(datas[1]=="UP"){
			if(soundstates[activeSound].volume < 99){
		   		soundstates[activeSound].volume = soundstates[activeSound].volume +2;
		   	}

	   	} else if(datas[1]=="DOWN"){
			if(soundstates[activeSound].volume > 1){
		   		soundstates[activeSound].volume = soundstates[activeSound].volume -2;
		   	} 
	   	}

   	if(soundstates[activeSound].playstate=="paused"){
   		playSound(activeSound);
   	}
   		
   	setSoundGain(activeSound,soundstates[activeSound].volume*0.01);


	//////////////////////////////////////////////////////////////////////
	// Touch input

   } else if(datas[0]=="TOUCH"){


   	
   		if(datas[1]=="UNLOAD_THIS"){

   			unloadSound(activeSound);


   		} else if(datas[1]=="CCW"){

			soundstates[activeSound].orbit_direction = "CCW";
			if(soundstates[activeSound].orbit_speed==0){
	   			soundstates[activeSound].orbit_speed = 10;
	   		}

			// rotateSound(activeSound,soundstates[activeSound].soundspace_speed,60);


	   	} else if(datas[1]=="CW"){

			soundstates[activeSound].orbit_direction = "CW";
			if(soundstates[activeSound].orbit_speed==0){
	   			soundstates[activeSound].orbit_speed = 10;
	   		}

	   	} else if(datas[1]=="PAUSE"){

	   		if(soundstates[activeSound].playstate == "paused"){
				playSound(activeSound);	
	   		} else {
	   			pauseSound(activeSound);
	   		}


	   	} else if(datas[1]=="REWIND"){
			
			playSound(activeSound);
	   		

	   	}  else if(datas[1]=="CENTER"){
			
	   		positionSound(activeSound,[0,0,0]);
			soundstates[activeSound].orbit_speed  = 0;

	   	}


   	} else {
   		// console.log(data);
   	}


    });


function changeAllLeds(){


	if(typeof soundstates[activeSound] === "undefined"){

		changeLed(0,"color","none");
		changeLed(1,"white",0);
		changeLed(2,"white",0);
		changeLed(3,"white",0);
		changeLed(4,"white",0);

		return false;
	}

	if(soundstates[activeSound].loadstate == "loaded"){

		changeLed(0,"color","green");

	}

	// ORBIT LEDS

	if(soundstates[activeSound].orbit_speed == 0){

		changeLed(1,"rainbow",0);
		changeLed(2,"white",0);
	   	changeLed(3,"white",0); 

	} else {

		changeLed(1,"rainbow",soundstates[activeSound].orbit_speed);

		if(soundstates[activeSound].orbit_direction=="CCW"){
			changeLed(2,"white",100);
	   		changeLed(3,"white",0); 
		} else if(soundstates[activeSound].orbit_direction=="CW"){
			changeLed(2,"white",0);
	   		changeLed(3,"white",100); 
		}


	}

	// VOLUME LED

	if(soundstates[activeSound].playstate=="playing"){
		changeLed(4,"rainbow",soundstates[activeSound].volume);
	} else {
		changeLed(4,"rainbow",0);
	}






}


function changeMatrix(number){
	var cmd = 'matrix ' + number + '\n';
	serialport.write(cmd);
	serialport2.write(cmd);

}


function perc2color(perc) {
	var r, g, b = 0;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * perc);
	}


	return [r,g,b];
	
}

var currentLedStates = {};


function changeLed(id,type,value){


	if(typeof currentLedStates[id] === "undefined"){
		currentLedStates[id] = "";
	}

	var cmd_prefix = "led " + id;

	var cmd = "";

	if(type=="white"){

		 value = mapValues(value,0, 100, 0, 20);
		 cmd = cmd + " " + value + " " + value + " " + value;

	} else if(type=="rainbow"){

		if(value==0){
			cmd = cmd + " 0 0 0";
		} else {
			value = mapValues(value,0, 100, 100, 0);
			var rgb = perc2color(value);
			cmd = cmd + " " + Math.round(rgb[0]*0.15) + " " + Math.round(rgb[1]*0.15) + " " + Math.round(rgb[2]*0.15); 

		}




		// if(value>0 && value <33){
		// 	var green_value = mapValues(value,0, 33, 0, 20);
		// 	cmd = cmd + " " + red_value + " " + 0 + " " + 0;
		// } else if(value>33 && value <66){
		// 	var blue_value = mapValues(value,33, 66, 0, 20);
		// 	cmd = cmd + " " + 0 + " " + 0 + blue_value;
		// } else {
		// 	var red_value = mapValues(value,66, 100, 0, 20);
		// 	cmd = cmd + " " + red_value + " 0 0";

		// }
		 
		//  cmd = cmd + " " + value + " " + value + " " + value;

	} else if(type=="color"){
		
		if(value == "red"){
		 cmd = cmd + " 20 0 0";
		} else if(value == "green"){
		 cmd = cmd + " 0 20 0";
		} else if(value == "blue"){
		 cmd = cmd + " 0 8 12";
		} else if(value == "none"){
		 cmd = cmd + " 0 0 0";
		}

	}

	if(currentLedStates[id]!=cmd){
		var cmd_out = cmd_prefix + cmd + '\n';
		console.log(cmd_out);
		serialport.write(cmd_out);
			serialport2.write(cmd_out);

		currentLedStates[id] = cmd;
	}



} // changeLed

////////////////////////////////////////////////////////////////////////////////////////////////////

function trim(str){

  str = str.replace(/^\s+|\s+$/g,'');
  return str;

}
////////////////////////////////////////////////////////////////////////////////////////////////////

function mapValues(value,in_min, in_max, out_min, out_max, rounded = true) {
	var val = (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
	if(rounded==true){
		return Math.round(val);
	} else {
		val = val.toFixed(3);
		return val;

	}
  
}
////////////////////////////////////////////////////////////////////////////////////////////////////





////////////////////////////////////////

function addSound(filename){

	if(typeof soundstates[filename] === "undefined"){

		var state = {};
		state.file = filename;
		state.volume = 50;
		state.loop = true;
		state.orbit_speed = 0;
		state.orbit_degree = 0;

		state.orbit_direction = "CCW";
		state.position = [0,0,0];
		state.playstate = "paused";
		state.loadstate = "unloaded";


		soundstates[filename] = state;

		loadSound(filename);


		var dbg = "Load sound: " + filename;

		// playSound(filename);

		console.log(dbg.magenta);

	} else {
		console.log("Sound already loaded");
	}

	// activeSound = filename;
	// console.log("Active sound:" + activeSound);


}

function unloadSound(filename){

	if(typeof soundstates[filename] != "undefined"){

		var state = {};
		state.file = filename;
		state.volume = 50;
		state.loop = true;
		state.orbit_speed = 0;
		state.orbit_degree = 0;

		state.orbit_direction = "CCW";
		state.position = [0,0,0];
		state.playstate = "paused";
		state.loadstate = "unloaded";

		soundstates[filename] = state;

		pauseSound(filename);

		var dbg = "Unload sound: " + filename;

		console.log(dbg.magenta);

	} else {
		console.log("Sound not loaded");
	}

	// activeSound = filename;
	// console.log("Active sound:" + activeSound);


}

////////////////////////////////////////

function loadSound(filename){


		var cmd = {};
		cmd.cmd = "add_source";
		cmd.file = filename;
		cmd.gain = 0.35;
		cmd.loop = true;

		sendSpacesoundCmd(cmd);

}


////////////////////////////////////////

function playSound(filename){

	var cmd = {};
	cmd.cmd = "play";
	cmd.ids = filename;
	soundstates[filename].playstate = "playing";
	soundstates[filename].loadstate = "loaded";


	sendSpacesoundCmd(cmd);

}

////////////////////////////////////////

function rewindSound(filename){

	var cmd = {};
	cmd.cmd = "rewind";
	cmd.ids = filename;

	sendSpacesoundCmd(cmd);

}

////////////////////////////////////////

function pauseSound(filename){

	var cmd = {};
	cmd.cmd = "pause";
	cmd.ids = filename;
	soundstates[filename].playstate = "paused";

	sendSpacesoundCmd(cmd);

}
////////////////////////////////////////

function removeSound(filename){

	var cmd = {};
	cmd.cmd = "remove_source";
	cmd.ids = filename;

	delete soundstates[filename];

	sendSpacesoundCmd(cmd);

}

////////////////////////////////////////

function positionSound(filename,coordinates){

	var cmd = {};
	cmd.cmd = "position";
	cmd.position = coordinates;

	cmd.ids = filename;

	sendSpacesoundCmd(cmd);

}

////////////////////////////////////////

function setSoundGain(filename,gain){

	gain = mapValues(gain,0,1,0,0.7,false);

	var cmd = {};
	cmd.cmd = "gain";
	cmd.gain = parseFloat(gain);

	cmd.ids = filename;

	sendSpacesoundCmd(cmd);

}

////////////////////////////////////////

function rotateSound(filename, speed, time){

	var cmd = {};
	cmd.cmd = "rotate";
	cmd.speed = speed;
	cmd.time = time;

	cmd.ids = filename;

	sendSpacesoundCmd(cmd);

}

////////////////////////////////////////

function sendSpacesoundCmd(cmd){

	cmd = JSON.stringify(cmd) + "\n";
	console.log(cmd.green);
	try{
		processRef.stdin.write(cmd);
	}
	catch(e){
		console.log("Soundspace not working!".red);
		// console.log(e);
	}

}

////////////////////////////////////////


setInterval(checkRotations,50);

function checkRotations(){

	for(var soundId in soundstates){

		if(soundstates[soundId].playstate=="playing" && soundstates[soundId].orbit_speed > 0 ){

			var orbitDelta = mapValues(soundstates[soundId].orbit_speed,0,100,0,45);

			if(soundstates[soundId].orbit_direction=="CCW"){
				orbitDelta = orbitDelta * -1;
			}

			soundstates[soundId].orbit_degree = soundstates[soundId].orbit_degree + orbitDelta;

			if(soundstates[soundId].orbit_degree > 360){
				soundstates[soundId].orbit_degree = 0;
			} else if(soundstates[soundId].orbit_degree < 0){
				soundstates[soundId].orbit_degree = 360;
			}

			var new_point_x = 0.7 * Math.cos(soundstates[soundId].orbit_degree * 3.1415926 / 180.0);
	        var new_point_y = 0.7 * Math.sin(soundstates[soundId].orbit_degree * 3.1415926 / 180.0);

	        // console.log(soundstates[soundId].orbit_degree + " => " +new_point_x +":"+new_point_y);

	        positionSound(soundId,[new_point_x,0,new_point_y]); // X points right, Y points up, and Z points towards the viewer/camera

   		}

	}
}


setInterval(checkLoadedSounds,50);

setInterval(changeAllLeds,50);



function checkLoadedSounds(){


	var numLoaded = 0;

	for(var soundId in soundstates){

		if(soundstates[soundId].loadstate=="loaded"){
			numLoaded++;
		}

	}
	if(currentNumLoaded!=numLoaded){
		changeMatrix(numLoaded);
		currentNumLoaded = numLoaded;
	}

}


////////////////////////////////////////

