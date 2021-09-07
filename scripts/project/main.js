
// Import any other script files here, e.g.:
import * as Saves from "./saves.js";
import * as Globals from "./globals.js";

globalThis.JSONgame = null;
globalThis.rn = null;
globalThis.cSaves = null;

runOnStartup(async runtime =>
{
	// Code to run on the loading screen.
	// Note layouts, objects etc. are not yet available.
	
	runtime.addEventListener("beforeprojectstart", () => OnBeforeProjectStart(runtime));
});

async function OnBeforeProjectStart(runtime)
{
	// Code to run just before 'On start of layout' on
	// the first layout. Loading has finished and initial
	// instances are created and available to use here.
	const textFileUrl = await runtime.assets.getProjectFileUrl("levels.json");

	const response = await fetch(textFileUrl);
	const fetchedText = await response.json();
	JSONgame = fetchedText;
	
	rn = runtime;
	
	rn.callFunction("debugText", JSONgame);
	runtime.addEventListener("tick", () => Tick(runtime));
	
	if(cSaves == null)	
		cSaves = new Saves.saves();	
		
	cSaves.getStorageData(Globals.game.KEY_NAME + "sound", 1).then(
		function(value){
			rn.callFunction("updateSoundsState", "sound", value);
		}
	);
	
	cSaves.getStorageData(Globals.game.KEY_NAME + "music", 1).then(
		function(value){
			rn.callFunction("updateSoundsState", "music", value);
		}
	);	
}

function Tick(runtime)
{
	// Code to run every tick
}
