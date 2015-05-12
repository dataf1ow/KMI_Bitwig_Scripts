/*

Copyright 2014 Evan Bogunia_____evanbeta@keithmcmillen.com


*/



//Load the bitwig API, obviously.
loadAPI(1);

//Define/set our controller properties [ company, device, version, uuid ]
host.defineController("Keith McMillen Instruments", "K-BoardScales", "1.0", "138433C0-5B06-11E4-8ED6-0800200C9A66");
host.defineMidiPorts(1, 1);

//Define/set input/output port names (both i/o are the same)
var portNames 	= 	["K-Board"];
host.addDeviceNameBasedDiscoveryPair(portNames, portNames);

//Define/set sysex call/response (deprecated, included for good measure)
host.defineSysexDiscovery("F0 7E 7F 06 01 F7", "F0 7E 00 06 02 00 01 5F 19 00 00 00 ?? ?? ?? ?? ?? ?? F7"); 

load ("KBoard_Scales.js")

var HIGHEST_CC = 119;
var LOWEST_CC = 1;
var selectMode = false;
var translationTable = initArray(-1, 128)
var noteOffTable = initArray(-1, 128)



//------------------------------------ Init -----------------------------------//
function init()
{
	//-------- Set MIDI callbacks / port
	host.getMidiInPort(0).setMidiCallback(onMidi);
	
	
	//-------- Note Inputs (see REF below for argument details
	noteIn = host.getMidiInPort(0).createNoteInput("K-Board", "80????", "90????");
	noteIn.setShouldConsumeEvents(false);
	updateTranslationTable()
	noteIn.setKeyTranslationTable(translationTable);

	userControls = host.createUserControlsSection(HIGHEST_CC - LOWEST_CC + 1);

	for(var i=LOWEST_CC; i<=HIGHEST_CC; i++)
	{
	  userControls.getControl(i - LOWEST_CC).setLabel("CC" + i);
	}


	notif = host.getNotificationSettings();

    notif.setShouldShowChannelSelectionNotifications(true);
    notif.setShouldShowDeviceLayerSelectionNotifications(true);
    notif.setShouldShowDeviceSelectionNotifications(true);
    notif.setShouldShowMappingNotifications(false);
    notif.setShouldShowPresetNotifications(true);
    notif.setShouldShowSelectionNotifications(true);
    notif.setShouldShowTrackSelectionNotifications(true);
    notif.setShouldShowValueNotifications(false);


	//println("This is the K-Board_SCales Script")
	lights()
}

//--------------------------- MIDI Callbacks / Port ---------------------------//
function onMidi(status, data1, data2)
{
	//println(status, data2)
	if(status == 224)
	{
		//println("pitchBend" + " " + data1 + " " + data2)
		if(data2 != 64){
			for (i = 0; i < 24; i ++){
				sendMidi(144, i, 16)
			}
			selectMode = true
			noteIn.setKeyTranslationTable(noteOffTable)
		}else if(data2 == 64){
			for (i = 0 ;i < 26; i ++){
				sendMidi(144, i, 0)		
			}
			selectMode = false
			lights()
			host.showPopupNotification("Root = " + root + " : Scale =" + scaleName)
			noteIn.setKeyTranslationTable(translationTable)

		}	

	}


	if(status == 144){
		//println(data1, data2)
		if (selectMode == true)
		{
			selector = data1 % 24
			if (selector < 12){
				scaleSelect(selector)
				host.showPopupNotification("Scale =" + scaleName)
			}else if(selector>=12){
				rootSelect(selector - 12)
				host.showPopupNotification("Root = " + root)
			}
		}
	}

	if(status == 128)
	{
		lights()
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

function lights()
{
	for (i = 0 ; i < scale.length ; i ++)
	{
		if(scale[i] + offset == 24){
			sendMidi(144, 24, 16)
			sendMidi(144, 0, 16)
		}else if (scale[i] + offset > 24)
		{
			sendMidi(144, (scale[i] + offset) - 24, 16)
			//println  ((scale[i] + offset) - 25)
		}else{
			sendMidi(144, scale[i] + offset, 16)
			//println (scale[i] + offset)
		}
		
	}

}

function updateTranslationTable()
{
	for (i = 0; i < 128; i ++)
	{
		translationTable[i] = i
	}
}


function exit()
{
	println("exit.");
}





