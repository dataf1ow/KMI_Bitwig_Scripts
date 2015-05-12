/*

Copyright 2014 Evan Bogunia_____evanbeta@keithmcmillen.com


*/



//Load the bitwig API, obviously.
loadAPI(1);

//Define/set our controller properties [ company, device, version, uuid ]
host.defineController("Keith McMillen Instruments", "12Step", "1.0", "63723F80-4FEE-11E4-916C-0800200C9A66");
host.defineMidiPorts(1, 1);

//Define/set input/output port names (both i/o are the same)
var portNames 	= 	["12Step Port 1"];
host.addDeviceNameBasedDiscoveryPair(portNames, portNames);

//Loading external Files
load("12Step_functions.js")

//Declare some global vars for a few of the interface types defined in the API
var application, arranger, mixer, transport;
var HIGHEST_CC = 119;
var LOWEST_CC = 1;
var NUM_TRACKS = 7;
var NUM_SCENES = 1;
var NUM_SENDS = 2;
var hasContent = initArray(0, 8);
var isPlaying = initArray(0, 8);
var isRecording = initArray(0, 8);
var isQueued = initArray(0, 8);
var pendingLEDs = initArray(0, 8);
var currentLEDs = initArray(0,8);
var selectedTrack = 0;
var canScrollUp = false
//------------------------------------ Init -----------------------------------//
function init()
{
	//-------- Set MIDI callbacks / port
	host.getMidiInPort(0).setMidiCallback(onMidi);
	
	//host.getMidiInPort(0).setSysexCallback(onSysexPort1);
	
	
	//-------- Note Inputs (see REF below for argument details
	noteIn = host.getMidiInPort(0).createNoteInput("12Step Port 1");
	noteIn.setShouldConsumeEvents(false);
	

	 userControls = host.createUserControlsSection(HIGHEST_CC - LOWEST_CC + 1);

   for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
   {
      userControls.getControl(i - LOWEST_CC).setLabel("CC" + i);
   }

	
	application = host.createApplication();
	trackBankMain = host.createTrackBank(NUM_TRACKS, NUM_SENDS, NUM_SCENES);
	trackBankAbove = host.createTrackBank(NUM_TRACKS, NUM_SENDS, NUM_SCENES)
	trackBankBelow = host.createTrackBank(NUM_TRACKS, NUM_SENDS, NUM_SCENES)
	cursorTrack = host.createCursorTrack(2, NUM_SCENES);
	transport = host.createTransport();
	arranger = host.createArranger(0);
	master = host.createMasterTrack(8);
	cursorTrack = host.createCursorTrack(2, 0);
	primaryDevice = cursorTrack.getPrimaryDevice();
	//println("This is the SoftStep Script")

	cursorTrack.addPositionObserver(function(track)
	{
		selectedTrack = track
		trackBankMain.scrollToTrack(track)
	})

	trackBankMain.addCanScrollScenesUpObserver(function(scrollUp)
	{
		
		if (scrollUp == true)
		{
			
			sendMidi(176, 21, 1)
		}else 
		{
			
			sendMidi(176, 21, 0)
			
		}
	})

	trackBankMain.addCanScrollScenesDownObserver(function(scrollDown)
	{
		
		if (scrollDown == true)
		{
			
			sendMidi(176, 23, 1)
		}else
		{
			
			sendMidi(176, 23, 0)
		}
	})

	for (var t = 0; t < NUM_TRACKS; t++)
		{
			var track = trackBankMain.getTrack(t); 
			var clipLauncher = track.getClipLauncher();
			clipLauncher.setIndication(true);
			
			clipLauncher.addHasContentObserver(getGridObserverFunc(t, hasContent));
      		clipLauncher.addIsPlayingObserver(getGridObserverFunc(t, isPlaying));
      		clipLauncher.addIsRecordingObserver(getGridObserverFunc(t, isRecording));
      		clipLauncher.addIsQueuedObserver(getGridObserverFunc(t, isQueued));
		}
	
}

//--------------------------- MIDI Callbacks / Port ---------------------------//
function onMidi(status, data1, data2)
{
	//println("Port 1 [status, data1, data2]: " + status + ", " + data1 + ", " + data2);

	
	if(status == 233)
	{
		//println("pitchBend" + " " + data1 + " " + data2)

	}else if(status == 145){

		//println("Notes"  + " " + data1 + " " + data2)
		launchClipSlots(data1, data2);
		scrollTrackBank(data1, data2);
		launchScenes(data1, data2)

	}else if (status == 185){

		//println("CC"  + " " + data1 + " " + data2)
		
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







