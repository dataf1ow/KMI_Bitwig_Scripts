/*

Copyright 2014 Evan Bogunia_____evanbeta@keithmcmillen.com


*/



//Load the bitwig API, obviously.
loadAPI(1);

//Define/set our controller properties [ company, device, version, uuid ]
host.defineController("Keith McMillen Instruments", "QuNexus", "1.0", "860FA290-9111-11E3-BAA8-0800200C9A66");
host.defineMidiPorts(3, 3);

//Define/set input/output port names (both i/o are the same)
var portNames 	= 	["QuNexus Port 1", "QuNexus Port 2", "QuNexus Port 3"];
host.addDeviceNameBasedDiscoveryPair(portNames, portNames);

//Define/set sysex call/response (deprecated, included for good measure)
host.defineSysexDiscovery("F0 7E 7F 06 01 F7", "F0 7E 00 06 02 00 01 5F 19 00 00 00 ?? ?? ?? ?? ?? ?? F7"); 

//Declare some global vars for a few of the interface types defined in the API
var application, arranger, mixer, transport;
var HIGHEST_CC = 119;
var LOWEST_CC = 1;
//------------------------------------ Init -----------------------------------//
function init()
{
	//-------- Set MIDI callbacks / port
	host.getMidiInPort(0).setMidiCallback(onMidiPort1);
	host.getMidiInPort(1).setMidiCallback(onMidiPort2);
	host.getMidiInPort(2).setMidiCallback(onMidiPort3);
	host.getMidiInPort(0).setSysexCallback(onSysexPort1);
	host.getMidiInPort(1).setSysexCallback(onSysexPort2);
	host.getMidiInPort(2).setSysexCallback(onSysexPort3);
	
	//-------- Note Inputs (see REF below for argument details
	noteIn = host.getMidiInPort(0).createNoteInput("QuNexus Port 1");
	noteIn.setShouldConsumeEvents(false);
	noteIn2 = host.getMidiInPort(1).createNoteInput("QuNexus Port 2", "80????", "90????");
	noteIn3 = host.getMidiInPort(2).createNoteInput("QuNexus Port 3", "80????", "90????");

	 userControls = host.createUserControlsSection(HIGHEST_CC - LOWEST_CC + 1);

   for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
   {
      userControls.getControl(i - LOWEST_CC).setLabel("CC" + i);
   }

	//-------- Initialize bitwig interfaces
	//application = host.createApplication();
	//arranger = host.createArranger(0);
	//mixer = host.createMixer("perspective?",0);
	transport = host.createTransport();
	println("This is the QuNexus Script")
}

//--------------------------- MIDI Callbacks / Port ---------------------------//
function onMidiPort1(status, data1, data2)
{
	//println("Port 1 [status, data1, data2]: " + status + ", " + data1 + ", " + data2);

	
	if(status == 233)
	{
		println("pitchBend" + " " + data1 + " " + data2)

	}else if(status == 153){

		println("Notes"  + " " + data1 + " " + data2)

	}else if (status == 185){

		println("CC"  + " " + data1 + " " + data2)
		sendMidi(status, data1, data2)
	}


   if (isChannelController(status))
   {
      if (data1 >= LOWEST_CC && data1 <= HIGHEST_CC)
      {
         var index = data1 - LOWEST_CC;
         userControls.getControl(index).set(data2, 128);
      }
   }	 


}

function onMidiPort2(status, data1, data2)
{
	println("Port 2 [status, data1, data2]: " + status + ", " + data1 + ", " + data2);
}

function onMidiPort3(status, data1, data2)
{
	println("Port 3 [status, data1, data2]: " + status + ", " + data1 + ", " + data2);
}

function onSysexPort1(data)
{
	println("Port 1 [sysex data]: " + data);
}

function onSysexPort2(data)
{
	println("Port 2 [sysex data]: " + data);
}

function onSysexPort3(data)
{
	println("Port 3 [sysex data]: " + data);
}

function exit()
{
	println("exit.");
}

//--------------------------------- Interfaces --------------------------------//





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////// REF ////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//--------------------- Note Input Filters

// These filters args are used in the createNoteInput method/function for a midi input port [ see init() ].

// See http://www.midi.org/techspecs/midimessages.php for midi message types. 

// Studying up on hexadecimal could be helpful also if it's new to you.


//---- Note Off
// "80????" - Sees all note offs on channel 1 
// "8?????" - Sees all note offs on any channel

//---- Note On
// "90????" - Sees all note ons on channel 1
// "9?????" - Sees all note offs on any channel
// "90607F" - Sees all note number 60s with a velocity of 127 (this is a very specific filter)

//---- Polyphonic Aftertouch
// "A0????" - Sees all note ons on channel 1
// "A?????" - Sees all note offs on any channel

//---- Controller Messages
// "B0????" - Sees all cc messages on channel 1
// "B?????" - Sees all cc messages on all channels

//---- Program Changes
// "C0????" - Sees all pgm changes on channel 1
// "C?????" - Sees all pgm changes on all channels

//---- Channel Aftertouch
// "D0????" - Sees all ch. aftertouch on channel 1
// "D?????" - Sees all ch. aftertouch on all channels

//---- Pitch Wheel
// "E0????" - Sees all ch. aftertouch on channel 1
// "E?????" - Sees all ch. aftertouch on all channels
// "E???00" - Sees all ch. aftertouch on all channels with an MSB of zero
// "E?00??" - Sees all ch. aftertouch on all channels with an LSB of zero

//---- SysEx start/end, esoteric MIDI mysticism (wouldn't use these filters unless your traversing some kind of musical 3-byte worm hole)
//---- For sysex, just use the callbacks defined above
// "F0????" - Sees all ch. aftertouch on channel 1
// "D?????" - Sees all ch. aftertouch on all channels







