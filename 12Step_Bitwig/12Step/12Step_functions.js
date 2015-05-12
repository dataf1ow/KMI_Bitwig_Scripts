/*

Sofstep Controller Functions

Copyright 2014 Evan Bogunia_____evanbeta@keithmcmillen.com

*/


function launchClipSlots(data1, data2)
{
	if (data1 < 8 & data2 == 127)
		{
			trackBank.getTrack((data1)/2).getClipLauncher().launch(data1 % 2);
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
      clipLED()
   }
}

function scrollTrackBank(data1, data2)
{
	if (data1 == 8 && data2 == 127)
	{
		trackBank.scrollScenesUp()

	}else if (data1 == 9 && data2 == 127)
	{
		trackBank.scrollScenesDown()
	}

}



function contentLED()
{
	for(i = 0; i < 8; i++){
		if (hasContent[i] == true){
			pendingLEDs[i] = 1
		}else if (hasContent[i] == false){
			pendingLEDs[i] = 0
		}
	}

}


function playingLED()
{
	for(i = 0; i < 8; i++){
		if (isPlaying[i] == true){
			pendingLEDs[i] = 2
		}
	}
}

function recordingLED()
{
	for (i = 0 ; i <8; i ++){
		if (isRecording[i] == true){
			pendingLEDs[i] = 3
		}
	}

}


function clipUpdate()
{
	for(i = 0; i < 8; i ++){
		if (pendingLEDs[i] != currentLEDs[i]){
			currentLEDs[i] = pendingLEDs[i]
			sendClipLEDs(i)

		}



	}

}

function clipLED()
{
	contentLED();
	playingLED();
	recordingLED();
	clipUpdate();

}


function sendClipLEDs(index){
	switch(index){
		case 0:
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
		case 1:
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
		case 2:
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
		case 3:
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
		case 4:
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
		case 6:
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
		case 7:
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