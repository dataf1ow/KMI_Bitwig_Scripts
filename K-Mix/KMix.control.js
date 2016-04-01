/*

Copyright 2016 Evan Bogunia_____evanbeta@keithmcmillen.com


*/


//Load the bitwig API
loadAPI(1);

//Define/set our controller properties [ company, device, version, uuid ]
host.defineController("Keith McMillen Instruments", "K-Mix", "1.0", "4034A480-F81D-11E5-A837-0800200C9A66");
host.defineMidiPorts(1,1);

//Define/set input/output port names
var portNames 	= 	"K Mix Audio Control";
host.addDeviceNameBasedDiscoveryPair(["K Mix Control Surface"],["K Mix Control_Surface"]);

var transport;
var HIGHEST_CC = 119;
var LOWEST_CC = 1;
var position = 0;
var rewind_length = 1.0 //this is a value in bars
//------------------------------------ Init -----------------------------------//
function init()
{
	//-------- Set MIDI callbacks / port
	host.getMidiInPort(0).setMidiCallback(onMidiPort1);
	transport = host.createTransport();
	time = transport.getPosition();

	//getting the transport position. 
	time.addRawValueObserver(function(value)
		{
			position = Math.round(value);
		}
	)
	println("This is the K-Mix Script")
}

//--------------------------- MIDI Callbacks / Port ---------------------------//
function onMidiPort1(status, data1, data2)
{
	//println("Port 1 [status, data1, data2]: " + status + ", " + data1 + ", " + data2);
	if(status == 144){
		if(data1 == 91){
			//setting the new transport position
			time.setRaw(position - rewind_length)
			transport.rewind();

		}else if(data1 == 93){
			transport.stop();

		}else if(data1 == 94){
			transport.play();

		}else if(data1 == 95){
			transport.record();

		}
	}

}


function exit()
{
	println("exit.");
}



