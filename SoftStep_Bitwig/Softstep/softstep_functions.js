/*

Sofstep Controller Functions

Copyright 2014 Evan Bogunia_____evanbeta@keithmcmillen.com

*/

var stopAll = 0;
var device_select_state = 1;
var selectedTrack = 0
//var mode = 'clip'

function trackSelect(data1, data2)
{
	thisTrack = trackBank.getTrack(data1 - 104)
	thisTrack.selectInMixer()
	selectedTrack = data1 - 104
	trackLED()
}

function trackLED()
{
	for (i = 0; i < 4; i ++)
	{
		if (i == selectedTrack)
		{
			sendMidi(176, 110 + i, 1)
		}else{
			sendMidi(176, 110 + i, 0)
		}
	}
}

function deviceLED()
{
	if (deviceEnabled == 1)
	{
		sendMidi(176, 119, 1)
		sendMidi(176, 29, 0)
	}else{
		sendMidi(176, 119, 0)
		sendMidi(176, 29, 1)
	}
}

function macroControl(data1, data2)
{
	primaryDevice.getMacro(data1-100).getAmount().set(data2,128)
}

function deviceOn()
{
	primaryDevice.toggleEnabledState()
}

function deviceNavigation(data1, data2)
{
	if (device_select_state = 1)
	{
		if (data2 > 64)
		{
			primaryDevice.switchToDevice(DeviceType.ANY, ChainLocation.NEXT)
			device_select_state = 0
		}
		if (data2 < 64)
		{
			primaryDevice.switchToDevice(DeviceType.ANY, ChainLocation.PREVIOUS)
			device_select_state = 0
		}
	}	
	if (data2 == 64)
		device_select_state = 1
}

function launchClipSlots(data1, data2)
{
	if (data1 < 8 && data2 == 127)
		{
			trackBank.getTrack((data1)/2).getClipLauncher().launch(data1 % 2);				
		}
}

function stopClips(data1, data2)
{
	if (data1 >= 8 && data1 < 16 && data2 == 127)
		{	
			println("test")
			data1 = data1 - 8
			trackBank.getTrack((data1)/2).stop();			
		}
}

function launchScenes(data1, data2)
{
	if (data1 == 10 && data2 ==127)
	{
		trackBank.launchScene(0)
	}
	if (data1 == 11 && data2 == 127)
	{
		trackBank.launchScene(1)
	}

}

function getGridObserverFunc(track, varToStore)
{
   return function(scene, value)
   {
      varToStore[scene*4 + track] = value;
      LED()
   }
}

function scrollTrackBank(data1, data2)
{
	if (data1 == 16 && data2 == 127)
	{
		trackBank.scrollScenesUp()
		if (stopAll == 1)
		{
			for(i = 0; i < 4; i ++)
			{
				trackBank.getTrack(i).stop();
			}
		}
		stopAll = 1
		host.scheduleTask(function()
		{
			stopAll = 0
		},null, 250);


			


	}else if (data1 == 17 && data2 == 127)
	{
		trackBank.scrollScenesDown()
	}

}

function scrollLEDs()
{
	if (scrollUp == true)
			{
				sendMidi(176, 119, 1)
				sendMidi(176, 29, 0)
			}else 
			{
				sendMidi(176, 29, 1)
				sendMidi(176, 119, 2)				
			}
	if (scrollDown == true)
			{
				sendMidi(176, 114, 1)
				sendMidi(176, 24, 0)
			}else
			{
				sendMidi(176, 114, 0)
				sendMidi(176, 24, 1)
			}

}


function contentLED()
{
	for(i = 0; i < 8; i++){
		if (hasContent[i] == true){
			pendingLEDs[i] = 1 //Has Content
		}else if (hasContent[i] == false){
			pendingLEDs[i] = 0
		}
	}

}


function playingLED()
{
	for(i = 0; i < 8; i++){
		if (isPlaying[i] == true){
			pendingLEDs[i] = 2 //Is Playing
		}
	}
}

function recordingLED()
{
	for (i = 0 ; i <8; i ++){
		if (isRecording[i] == true){
			pendingLEDs[i] = 3 //Is Recording
		}
	}

}


function clipUpdate()
{
	for(i = 0; i < 8; i ++)
	{
		if (pendingLEDs[i] != currentLEDs[i]){
			currentLEDs[i] = pendingLEDs[i]
			sendClipLEDs(i)			
		}
	}
}

function LED()
{	
	if (mode == 1)
	{
		contentLED();
		playingLED();
		recordingLED();
		clipUpdate();
	}
	if (mode == 2)
	{

	}
}

function clearLEDs()
{
	for (i=20; i <= 30; i ++)
	{
		sendMidi(176, i, 0)
		sendMidi(176, (i + 90), 0)
	}
	if (mode == 1)
	{
		for(i = 0; i < 8; i ++)
		{
			sendClipLEDs(i)
		}
	}
}


function sendClipLEDs(index){
	switch(index){
		case 4:
			if(currentLEDs[index] == 0){
				sendMidi(176, 25, 0)
				sendMidi(176, 115, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 25, 2)
				sendMidi(176, 115, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 25, 0)
				sendMidi(176, 115, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 25, 3)
				sendMidi(176, 115, 0)
			}
			break;
		case 5:
			if(currentLEDs[index] == 0){
				sendMidi(176, 26, 0)
				sendMidi(176, 116, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 26, 2)
				sendMidi(176, 116, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 26, 0)
				sendMidi(176, 116, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 26, 3)
				sendMidi(176, 116, 0)
			}
			break;
		case 6:
			if(currentLEDs[index] == 0){
				sendMidi(176, 27, 0)
				sendMidi(176, 117, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 27, 2)
				sendMidi(176, 117, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 27, 0)
				sendMidi(176, 117, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 27, 3)
				sendMidi(176, 117, 0)
			}
			break;
		case 7:
			if(currentLEDs[index] == 0){
				sendMidi(176, 28, 0)
				sendMidi(176, 118, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 28, 2)
				sendMidi(176, 118, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 28, 0)
				sendMidi(176, 118, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 28, 3)
				sendMidi(176, 118, 0)
			}
			break;
		case 0:
			if(currentLEDs[index] == 0){
				sendMidi(176, 20, 0)
				sendMidi(176, 110, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 20, 2)
				sendMidi(176, 110, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 20, 0)
				sendMidi(176, 110, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 20, 3)
				sendMidi(176, 110, 0)
			}
			break;
		case 1:
			if(currentLEDs[index] == 0){
				sendMidi(176, 21, 0)
				sendMidi(176, 111, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 21, 2)
				sendMidi(176, 111, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 21, 0)
				sendMidi(176, 111, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 21, 3)
				sendMidi(176, 111, 0)
			}
			break;
		case 2:
			if(currentLEDs[index] == 0){
				sendMidi(176, 22, 0)
				sendMidi(176, 112, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 22, 2)
				sendMidi(176, 112, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 22, 0)
				sendMidi(176, 112, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 22, 3)
				sendMidi(176, 112, 0)
			}
			break;
		case 3:
			if(currentLEDs[index] == 0){
				sendMidi(176, 23, 0)
				sendMidi(176, 113, 0)

			}else if (currentLEDs[index] == 1){
				sendMidi(176, 23, 2)
				sendMidi(176, 113, 2)

			}else if (currentLEDs[index] == 2){
				sendMidi(176, 23, 0)
				sendMidi(176, 113, 3)
			}else if (currentLEDs[index] == 3){
				sendMidi(176, 23, 3)
				sendMidi(176, 113, 0)
			}
			break;
	}
}