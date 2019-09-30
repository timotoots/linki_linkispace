

const cmd = require('node-cmd');
 
 var colors = require('colors');


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

var SerialPort = require('serialport');
const Readline = SerialPort.parsers.Readline;

try{
	var serialport = new SerialPort(serialDevice, {
	  baudRate: 115200
	});

} catch(e){
  console.log("No Arduino connected to " + serialDevice);
  process.exit();
}

serialport.on('open', function(){
  console.log('Serial port opened'.green);
  // writeToSerial();
  setTimeout(function(){

  	addSound("cache/httpssoundcloud.comvulvulpessetsvv001-fusion-of-horizons-2016/httpssoundcloud.comvulvulpessetsvv001-fusion-of-horizons-2016.mp3_mono.wav");
  	// addSound("sine1000.wav");
  	changeMatrix(4);
  	changeLed(0,"color","blue");


  },2000);
  

 
});


const parser = new Readline({delimiter: '\n'});
serialport.pipe(parser);

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


 parser.on('data', function(data){

   // DEBUG

   data = trim(data);
   datas = data.split(":");

   if(activeSound == ""){
   	return false;
   }


   if(datas[0]=="POTX" || datas[0]=="POTY"){

	   	console.log("POT: X=" + currentPotX + ", Y=" +currentPotY);

   	   	var centeredJoystick = check_a_point(currentPotX, currentPotY, 127.5, 127.5, 120);


		if(datas[0]=="POTX"){

		   	currentPotX = datas[1];

			   	// console.log("INPUT: Joystick movement X".yellow);


			   	// console.log(datas[1]);
			   	// var matrix = mapValues(datas[1],0,255,0,9);
			   	// changeMatrix(Math.round(matrix));

			   	// joystickPosition[0] = parseFloat(mapValues(datas[1],0,255,-1,1, false));
			   	// console.log(joystickPosition);
			   	// positionSound(activeSound,joystickPosition);

		 

		   } else if(datas[0]=="POTY"){

		   	  currentPotY = datas[1];

		 //   	var distance = joystickDistance(currentPotX,currentPotY);

		 //    console.log("POT: X=" + currentPotX + ", Y=" +currentPotY);
		 //  	// console.log("Distance:" + distance);
			// console.log(check_a_point(currentPotX, currentPotY, 127.5, 127.5, 60));



		   	// console.log("INPUT: Joystick movement Y".yellow);

		   	// console.log(datas[1]);

		   	// joystickPosition[2] = parseFloat(mapValues(datas[1],0,255,-1,1, false));
		   	// positionSound(activeSound,joystickPosition);


		   //////////////////////////////////////////////////////////////////////
		   	
		   }

		   if(!centeredJoystick){

		   		joystickPosition[0] = parseFloat(mapValues(currentPotX,0,255,-1.5,1.5, false));
	  			joystickPosition[2] = parseFloat(mapValues(currentPotY,0,255,-1.5,1.5, false));
			   	positionSound(activeSound,joystickPosition);
			   	soundstates[activeSound].orbit_speed  = 0;
			   		changeAllLeds();

		   }
		   
		   


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
	
	changeAllLeds();

	 //console.log("New speed:" + soundstates[activeSound].level_orbit_speed);

	 // soundstates[activeSound].soundspace_speed = mapValues(soundstates[activeSound].orbit_speed,0,100,-1,1, false);

	// soundstates[activeSound].soundspace_speed = soundstates[activeSound].orbit_speed/100;
	// rotateSound(activeSound,soundstates[activeSound].soundspace_speed,60);

   	
   	
//////////////////////////////////////////////////////////////////////

   } else if(datas[0]=="ENC_VOLUME"){
   	console.log("INPUT: Volume encoder".yellow);

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


   	changeAllLeds();	
   	setSoundGain(activeSound,soundstates[activeSound].volume*0.01);



//////////////////////////////////////////////////////////////////////

   } else if(datas[0]=="TOUCH"){
   	var dbg = "INPUT: Touch: " + datas[1];
   	console.log(dbg.yellow);
   	if(datas[1]=="UNLOAD_ALL"){



   	} else if(typeof soundstates[activeSound] != undefined){

   	

		if(datas[1]=="CCW"){

			soundstates[activeSound].orbit_direction = "CCW";
			if(soundstates[activeSound].orbit_speed==0){
	   			soundstates[activeSound].orbit_speed = 10;
	   		}
	    	changeAllLeds();

			// rotateSound(activeSound,soundstates[activeSound].soundspace_speed,60);


	   	} else if(datas[1]=="CW"){

			soundstates[activeSound].orbit_direction = "CW";
			if(soundstates[activeSound].orbit_speed==0){
	   			soundstates[activeSound].orbit_speed = 10;
	   		}
    		changeAllLeds();

	   	} else if(datas[1]=="PAUSE"){

	   		if(soundstates[activeSound].playstate == "paused"){
				playSound(activeSound);	
	   		} else {
	   			pauseSound(activeSound);
	   		}

    		changeAllLeds();	

	   	} else if(datas[1]=="REWIND"){
			
			rewindSound(activeSound);
	   		
    		changeAllLeds();	

	   	}  else if(datas[1]=="CENTER"){
			
	   		positionSound(activeSound,[0,0,-1]);

    		changeAllLeds();	
	   	}


   	}





   } else if(data=="START"){
   	console.log("INPUT: Serial port READY".yellow);
   //	setTimeout(silence, 5000);
   } else {
   	console.log('data received:', data);
   }

    });


function changeAllLeds(){

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



function changeLed(id,type,value){

	var cmd = "led " + id;

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
		}

	}

	cmd = cmd + '\n';
	console.log(cmd);
	serialport.write(cmd);

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


var soundstates = {};

var activeSound = "";

var joystickPosition = [0,0,-1];

////////////////////////////////////////

function addSound(filename){

	if(typeof soundstates[filename] != undefined){

		var state = {};
		state.file = filename;
		state.volume = 50;
		state.loop = true;
		state.orbit_speed = 0;
		state.orbit_degree = 0;

		state.orbit_direction = "CCW";
		state.position = [0,0,-1];
		state.playstate = "paused";


		soundstates[filename] = state;

		loadSound(filename);
	   	changeLed(4,"rainbow",soundstates[filename].volume);


		var dbg = "Load sound: " + filename;

		console.log(dbg.magenta);

	} else {
		console.log("Sound already loaded");
	}

	activeSound = filename;


}

////////////////////////////////////////

function loadSound(filename){


		var cmd = {};
		cmd.cmd = "add_source";
		cmd.file = filename;
		cmd.gain = 1;
		cmd.loop = true;

		sendSpacesoundCmd(cmd);

}


////////////////////////////////////////

function playSound(filename){

	var cmd = {};
	cmd.cmd = "play";
	cmd.ids = filename;
	soundstates[filename].playstate = "playing";

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

	var cmd = {};
	cmd.cmd = "gain";
	cmd.gain = gain;

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
	processRef.stdin.write(cmd);

}

////////////////////////////////////////


setInterval(checkRotations,50);


function checkRotations(){

if(typeof soundstates[activeSound] != "undefined"){


	if(soundstates[activeSound].orbit_speed>0){

		var orbitDelta = mapValues(soundstates[activeSound].orbit_speed,0,100,0,45);

		if(soundstates[activeSound].orbit_direction=="CCW"){
			orbitDelta = orbitDelta * -1;
		}


		soundstates[activeSound].orbit_degree = soundstates[activeSound].orbit_degree + orbitDelta;

		if(soundstates[activeSound].orbit_degree > 360){
			soundstates[activeSound].orbit_degree = 0;
		} else if(soundstates[activeSound].orbit_degree < 0){
			soundstates[activeSound].orbit_degree = 360;
		}

		var new_point_x = 1 * Math.cos(soundstates[activeSound].orbit_degree * 3.1415926 / 180.0);
        var new_point_y = 1 * Math.cos(soundstates[activeSound].orbit_degree * 3.1415926 / 180.0);

        console.log(soundstates[activeSound].orbit_degree+" => " +new_point_x +":"+new_point_y);

        positionSound(activeSound,[new_point_x,-1,new_point_y]);



	}
		
}
}


 setTimeout(function(){

	playSound("cache/httpssoundcloud.comvulvulpessetsvv001-fusion-of-horizons-2016/httpssoundcloud.comvulvulpessetsvv001-fusion-of-horizons-2016.mp3_mono.wav");
	//playSound("uss_mono.wav");
	// playSound("sine1000.wav");


	setInterval(function(){

		/*
		console.log(soundstates["karnkonn_mono.wav"]);
		if(soundstates["karnkonn_mono.wav"].position[0] >= 1){
			soundstates["karnkonn_mono.wav"].position[0] = -1;
		}
		soundstates["karnkonn_mono.wav"].position[0] = soundstates["karnkonn_mono.wav"].position[0] + 0.1;

		positionSound("karnkonn_mono.wav",soundstates["karnkonn_mono.wav"].position);
		
		*/

	},300);


	// rotateSound("karnkonn_mono.wav");


 },10000);



