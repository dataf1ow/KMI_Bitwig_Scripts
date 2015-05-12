//KBoard Scale Definitions


var major = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23, 24];
var minor = [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19, 20, 22, 24];
var dorian = [0, 2, 3, 5, 7, 9, 10, 12, 14, 15, 17, 19, 21, 22, 24];
var phrygian = [0, 1, 3, 5, 7, 8, 10, 12, 13, 15, 17, 19, 20, 22, 24];
var lydian = [0, 2, 4, 6, 7, 9, 11, 12, 14, 16, 18, 19, 21, 23, 24];
var mixolydian = [0, 2, 4, 5, 7, 9, 10, 12, 14, 16, 17, 19, 21, 22, 24];
var locrian = [0, 1, 3, 4, 6, 8, 10, 12, 13, 15, 16, 18, 20, 22, 24];
var pentatonicMajor = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24];
var pentatonicMinor = [0, 3, 5, 7, 10, 12, 15, 17, 19, 22, 24];
var wholetone = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24];
var halfdiminished = [0, 2, 3, 5, 6, 8, 10, 12, 14, 15, 17, 18, 20, 22, 24];
//var diminishedwhole = [0, 2, 3, 5, 6, 8, 9, 11, 12, 14, 15, 17, 18, 20, 21, 23, 24];
var octatonic = [0, 1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16, 18, 19, 21, 22, 24];
var scale = major
var scaleName = "Major"
var offset = 0
root = "C"


function scaleSelect(x){
	switch(x){
		case 0:
			scale = major
			scaleName = "Major"
			break;
		case 1:
			scale = pentatonicMajor
			scaleName = "Pentatonic Major"
			break;
		case 2:
			scale = dorian
			scaleName = "Dorian"
			break;
		case 3:
			scale = pentatonicMinor
			scaleName ="Pentatonic Minor"
			break;
		case 4:
			scale = phrygian
			scaleName = "Phrygian"
			break;
		case 5:
			scale = lydian
			scaleName = "Lydian"
			break;
		case 6:
			scale = wholetone
			scaleName ="Whole Tone"
			break;
		case 7:
			scale = mixolydian
			scaleName = "Mixolydian"
			break;
		case 8:
			scale = halfdiminished
			scaleName = "Half Diminished"
			break;
		case 9:
			scale = minor
			scaleName = "Minor"
			break;	
		case 10:
			scale = octatonic
			scaleName = "Octatonic"
			break;
		case 11:
			scale = locrian
			scaleName = "Locrian"
			break;									
	}

}

function rootSelect(x){
	switch(x){
		case 0:
			offset = x
			root = 'C'
			break;
		case 1:
			offset = x
			root = "C#/Db"
			break;
		case 2:
			offset = x
			root = "D"
			break;
		case 3:
			offset = x
			root = "D#/Eb"
			break;
		case 4:
			offset = x
			root = "E"
			break;
		case 5:
			offset = x
			root = "F"
			break;
		case 6:
			offset = x
			root = "F#/Gb"
			break;
		case 7:
			offset = x
			root = "G"
			break;
		case 8:
			offset = x
			root = "G#/Ab"
			break;
		case 9:
			offset = x
			root = "A"
			break;	
		case 10:
			offset = x
			root = "A#/Bb"
			break;
		case 11:
			offset = x
			root = "B"
			break;									
	}

}