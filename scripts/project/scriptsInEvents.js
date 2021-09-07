import * as gen from "./allGenerations.js";
import * as Globals from "./globals.js";

let gameProgress = null;

// Levels menu
function createLevels(){
	
		
	cSaves.getStorageData(Globals.game.KEY_NAME + "progress", "[0]").then(
		function(value){
			gameProgress = JSON.parse(value);
			gen.levelLayoutGenerator(gameProgress);
		}
	);		
}


function gameInit(){

	rn.globalVars.GRID_WIDTH  = Globals.game.GRID_WIDTH;
	rn.globalVars.GRID_HEIGHT = Globals.game.GRID_HEIGHT;
	
	// Reset old data
	Globals.game.aGame = [];
	Globals.game.stage = 0;
	Globals.game.stars = 0;
	Globals.game.score = 0;
	
	if(Globals.game.activeLevel >= JSONgame.levels.length)
		Globals.game.activeLevel = JSONgame.levels.length-1;
	// Filling array
	// Override this array first
	for(let i = 0; i < rn.globalVars.GRID_WIDTH; i++){
		Globals.game.aGame.push([]);
		
		for(let j = 0; j < rn.globalVars.GRID_HEIGHT; j++){
			Globals.game.aGame[i].push([]);
		}			
	}
	
	
	for(let i = 0; i < 5; i++){
		Globals.game.score_frames[i] = JSONgame.levels[Globals.game.activeLevel].need_for_frames[i];
	}
	
	
	
	rn.callFunction("StartGameUpdateStates",
		JSONgame.levels[Globals.game.activeLevel].time,
		JSONgame.levels[Globals.game.activeLevel].score[0],
		JSONgame.levels[Globals.game.activeLevel].need_for_frames[0],
		JSONgame.levels[Globals.game.activeLevel].need_for_frames[1],
		JSONgame.levels[Globals.game.activeLevel].need_for_frames[2],
		JSONgame.levels[Globals.game.activeLevel].need_for_frames[3],
		JSONgame.levels[Globals.game.activeLevel].need_for_frames[4],
		JSONgame.levels[Globals.game.activeLevel].num,
	);
	
	
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


function specialBombEffect(types){

	
	for(let i = 0; i < rn.globalVars.GRID_WIDTH; i++)
		for(let j = 0; j < rn.globalVars.GRID_HEIGHT; j++){
			if(Globals.game.aGame[i][j].type == types){
			
				rn.callFunction("destroyTiles", 
					Globals.game.aGame[i][j].tUID, 
					Globals.game.SCORE_BOMB, 
					Globals.game.TEXT_UP_COLORS[Globals.game.aGame[i][j].type]);
					
				Globals.game.score += Globals.game.SCORE_LINE;	
				Globals.game.score_frames[Globals.game.aGame[i][j].type] -= 
					Globals.game.score_frames[Globals.game.aGame[i][j].type] > 0 ? 1 : 0;		
					
				Globals.game.aGame[i][j] = null;
			}		
		}
		
	
		updateAllScores();		
}


function specialHorizontalEffect(tx, ty){

	for(let i = 0; i < rn.globalVars.GRID_WIDTH; i++){
				rn.callFunction("destroyTiles", 
				
					Globals.game.aGame[i][ty].tUID, 
					Globals.game.SCORE_LINE, 
					Globals.game.TEXT_UP_COLORS[Globals.game.aGame[i][ty].type]);
					
				Globals.game.score += Globals.game.SCORE_LINE;	
				Globals.game.score_frames[Globals.game.aGame[i][ty].type] -= 
					Globals.game.score_frames[Globals.game.aGame[i][ty].type] > 0 ? 1 : 0;					
				Globals.game.aGame[i][ty] = null;	
	}
	
	updateAllScores();	
		
}

function specialVerticalEffect(tx, ty){

	for(let i = 0; i < rn.globalVars.GRID_HEIGHT; i++){
	
				rn.callFunction("destroyTiles", 
					Globals.game.aGame[tx][i].tUID, 
					Globals.game.SCORE_LINE,
					Globals.game.TEXT_UP_COLORS[Globals.game.aGame[tx][i].type]);
					
				Globals.game.score += Globals.game.SCORE_LINE;	
				Globals.game.score_frames[Globals.game.aGame[tx][i].type] -= 
					Globals.game.score_frames[Globals.game.aGame[tx][i].type] > 0 ? 1 : 0;				
				Globals.game.aGame[tx][i] = null;	
	}
	
	updateAllScores();	
		
}

// Checking to the swapped tiles
function swapTiles(tUIDMain, tUIDsecond){
	const mainTile  	= getTileFromArray(tUIDMain);	// First touched tile
	const seconTile 	= getTileFromArray(tUIDsecond); // Second tile
	let tmpX		= mainTile.tx;					// Save old X
	let tmpY		= mainTile.ty;					// Save old Y
	var linesWasDestroyed = false;
	
	// Try swap tile into array
	mainTile.tx = seconTile.tx;
	mainTile.ty = seconTile.ty;
	
	seconTile.tx = tmpX;
	seconTile.ty = tmpY;
	
	Globals.game.aGame[mainTile.tx][mainTile.ty] 	= mainTile;
	Globals.game.aGame[seconTile.tx][seconTile.ty] 	= seconTile;
	
	updatePositions();
	rn.callFunction("updateGameState", "wait");
	
	// -----------------------------------------------
	// If main tile is special, then we make something
	// In another case just check all lines
	// -----------------------------------------------
	if(mainTile.special != "default"){
	
		switch(mainTile.special){
				case "bombs"		: { rn.callFunction("ExplosAnimation", mainTile.tUID); break; }
				case "horizontal"	: { rn.callFunction("horizontalExplosAnimation", seconTile.tUID); break; }
				case "vertical"		: { rn.callFunction("verticalExplosAnimation", seconTile.tUID); break; }
			}
			
		setTimeout(function(){

			switch(mainTile.special){
				case "bombs"		: { specialBombEffect(mainTile.type); break; }
				case "horizontal"	: { specialHorizontalEffect(mainTile.tx, mainTile.ty); break; }
				case "vertical"		: { specialVerticalEffect(mainTile.tx, mainTile.ty); break; }
			}
				updatePositions();
		}, 600);
	}
	else			
		setTimeout(function(){
	
		linesWasDestroyed = checkToLines();
		
		// Something went wrong? Just return tiles to old posotion!
		if(!linesWasDestroyed){
			tmpX		= mainTile.tx;					// Save old X
			tmpY		= mainTile.ty;					// Save old Y		

			// Try swap tile into array
			mainTile.tx = seconTile.tx;
			mainTile.ty = seconTile.ty;

			seconTile.tx = tmpX;
			seconTile.ty = tmpY;

			Globals.game.aGame[mainTile.tx][mainTile.ty] 	= mainTile;
			Globals.game.aGame[seconTile.tx][seconTile.ty] 	= seconTile;

			rn.callFunction("updateTilesPositions", 
							Globals.game.aGame[mainTile.tx][mainTile.ty].tUID, 
							Globals.game.aGame[mainTile.tx][mainTile.ty].tx  * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_X, 
							Globals.game.aGame[mainTile.tx][mainTile.ty].ty  * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_Y);

			rn.callFunction("updateTilesPositions", 
							Globals.game.aGame[seconTile.tx][seconTile.ty].tUID, 
							Globals.game.aGame[seconTile.tx][seconTile.ty].tx  * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_X, 
							Globals.game.aGame[seconTile.tx][seconTile.ty].ty  * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_Y);
			//rn.callFunction("updateGameState", "play");
		}else 
			updatePositions();
		}, 300);

}


function checkGameToOver(){
	// If player have one star 
	// And if player completed all tiles - player WOn
	
	if(Globals.game.score >= JSONgame.levels[Globals.game.activeLevel].score[0] &&
	   Globals.game.score_frames[0] == 0 &&
	   Globals.game.score_frames[1] == 0 &&
	   Globals.game.score_frames[2] == 0 &&
	   Globals.game.score_frames[3] == 0 &&
	   Globals.game.score_frames[4] == 0
	) {
		rn.callFunction("showCompletedMenu", Globals.game.stars, "yes");
		saveProgress(Globals.game.activeLevel, Globals.game.stars);
		return "yes";
	}
		
	else {
		// Check to won game
		rn.callFunction("showCompletedMenu", Globals.game.stars, "no");						
		return "no";
	}
		
}


// For the checking line we need move left to right and top to down, no crossing!
function checkToLines(){

	var stackFromHorizontal = [];
	var stackFromVertical	= [];
	var temp = null;

	for(var i = 0; i < rn.globalVars.GRID_WIDTH; i++)
		for(var j = 0; j < rn.globalVars.GRID_HEIGHT; j++){
		
			// We need check first horizontal and than vertical or this is will be NULL
			if(Globals.game.aGame[i][j] != null){
				temp = checkHorizontal(i, j, Globals.game.aGame[i][j].type);
				if(temp != null)
					stackFromHorizontal.push(temp);
			}
			
			if(Globals.game.aGame[i][j] != null){
				temp = checkVertical(i, j, Globals.game.aGame[i][j].type);
				if(temp != null)
					stackFromVertical.push(temp);
			}					
		}
		
		deleteSelectedTiles(stackFromHorizontal, stackFromVertical);
				
		if(stackFromHorizontal.length >= 3 || stackFromVertical.length >= 3)
			rn.callFunction("wow");
		
		
		if(stackFromHorizontal.length != 0 || stackFromVertical.length !=0){
			updatePositions();
			return true;	
		}
		else rn.callFunction("updateGameState", "play");			
}

// --------------------------------------------------------------
// GETS															|
// --------------------------------------------------------------
function getTileFromArray(tUID){
	for(let i = 0; i < rn.globalVars.GRID_WIDTH; i++)
		for(let j = 0; j < rn.globalVars.GRID_HEIGHT; j++){
			if(Globals.game.aGame[i][j].tUID == tUID && Globals.game.aGame[i][j])
				return Globals.game.aGame[i][j];
		}
	
}

function checkHorizontal(ox, oy, tType){
	var stacks = [];
		
	if(ox+1 >  rn.globalVars.GRID_WIDTH){
		return;
	}
			
	
	// Checking to line and save into stacks array
	for(var lineRight = ox; lineRight < rn.globalVars.GRID_WIDTH; lineRight++){
		if(Globals.game.aGame[lineRight][oy] != null && Globals.game.aGame[lineRight][oy].type == tType)
			stacks.push(Globals.game.aGame[lineRight][oy]);
		else
			break;
	}	

	// If we have 3 or more then  - match it!
	if(stacks.length >= 3){
		return stacks;
	}

	return null;
}


function checkVertical(ox, oy, tType){

	let stacks = [];
	
	if(oy+1 >  rn.globalVars.GRID_HEIGHT || tType == null)
		return;
		
	
	// Checking to vertical line
	for(let lineDown = oy; lineDown < rn.globalVars.GRID_HEIGHT; lineDown++){
		if(Globals.game.aGame[ox][lineDown] != null && Globals.game.aGame[ox][lineDown].type == Globals.game.aGame[ox][oy].type)
			stacks.push(Globals.game.aGame[ox][lineDown]);
		else
			break;
	}	

	// If we have 3 or more then  - match it!
	if(stacks.length >= 3){
		return stacks;
	}
	
	return null;
}


function deleteSelectedTiles(horizontal, vertical){

		let activeScore =  Globals.game.SCORE_PER_ONE + (Globals.game.SCORE_PER_ONE  *  horizontal.length); // 10
		

		// here is we are removing [horizontal] tiles array
		for(var i = 0; i < horizontal.length; i++){
			for(var j = 0; j < horizontal[i].length; j++)
			
				if(horizontal[i][j] != null){
				
					Globals.game.score += activeScore;
					Globals.game.score_frames[horizontal[i][j].type] -= 
						Globals.game.score_frames[horizontal[i][j].type] > 0 ? 1 : 0;			
				
					rn.callFunction("destroyTiles", 
						horizontal[i][j].tUID, 
						activeScore, 
						Globals.game.TEXT_UP_COLORS[horizontal[i][j].type]);
						
					Globals.game.aGame[horizontal[i][j].tx][horizontal[i][j].ty] = null;			
				}
		}
		
		activeScore =  Globals.game.SCORE_PER_ONE + (Globals.game.SCORE_PER_ONE  *  vertical.length);
		
		// here is we are removing [vertical] tiles array
		for(var i = 0; i < vertical.length; i++){
			for(var j = 0; j < vertical[i].length; j++)
			
				if(vertical[i][j] != null){
				
					Globals.game.score += activeScore;	
					Globals.game.score_frames[vertical[i][j].type] -= 
						Globals.game.score_frames[vertical[i][j].type] > 0 ? 1 : 0;
				
					
					rn.callFunction("destroyTiles", 
						vertical[i][j].tUID, activeScore, 
						Globals.game.TEXT_UP_COLORS[vertical[i][j].type]);
						
					Globals.game.aGame[vertical[i][j].tx][vertical[i][j].ty] = null;			
				}
		}	
				
		updateAllScores();			
}


// Move tiles down
function moveClosestTile(ox, oy){
	var tilesWasUpdated = false;
	var tiles = null;
	
		for(let j = oy-1; j >= 0; j--){	// Move BOTTOM to TOP
		
			if(Globals.game.aGame[ox][j] != null){
				tiles = Globals.game.aGame[ox][j];							
							
				Globals.game.aGame[ox][oy] = tiles;
				Globals.game.aGame[ox][oy].ty = oy;
				Globals.game.aGame[ox][j] = null;
				oy -= 1;	
				tilesWasUpdated = true;
			}
		}
		return tilesWasUpdated;
}


// --------------------------------------------------------------
// UPDATES												 		|
// --------------------------------------------------------------

function updateAllScores(){
		
		rn.callFunction("GameUpdateStates",
			Globals.game.score  + "/" + JSONgame.levels[Globals.game.activeLevel].score[Globals.game.stage],
			Globals.game.score_frames[0],
			Globals.game.score_frames[1],
			Globals.game.score_frames[2],
			Globals.game.score_frames[3],
			Globals.game.score_frames[4],
		); 
		
		if(Globals.game.score >= JSONgame.levels[Globals.game.activeLevel].score[Globals.game.stage] && 
			Globals.game.score < JSONgame.levels[Globals.game.activeLevel].score[1]){
			
			Globals.game.stage = 1;
			Globals.game.stars = 1;
		}
		
		if(Globals.game.score >= JSONgame.levels[Globals.game.activeLevel].score[1] && 
			Globals.game.score < JSONgame.levels[Globals.game.activeLevel].score[2]){
			
			Globals.game.stage = 2;
			Globals.game.stars = 2;

		}
		
		// Check to won game
		if(Globals.game.score >= JSONgame.levels[Globals.game.activeLevel].score[2]){
			if(checkGameToOver() == "yes"){
				Globals.game.stars = 3;			
			}
		}		
			
		if(Globals.game.score < JSONgame.levels[Globals.game.activeLevel].score[2]){
			var newWidthOfScoreBar = (((340/3) * (Globals.game.stage + 1))/100) * 
				((Globals.game.score/JSONgame.levels[Globals.game.activeLevel].score[Globals.game.stage]) * 100);
			rn.callFunction("updateScoreBar", newWidthOfScoreBar);		
		}		
}

function updatePositions(){

	var someTileWasDestroyed = false;
	var someTileWasDestroyedSaver = false;
		
	
	// First of all we need to create new tile where we was destroyed old
	for(let i = 0; i < rn.globalVars.GRID_WIDTH; i++)
		for(let j = rn.globalVars.GRID_HEIGHT - 1; j >= 0; j--){	
		
			if(Globals.game.aGame[i][j] == null){
				someTileWasDestroyed = moveClosestTile(i, j);
				if(!someTileWasDestroyedSaver && someTileWasDestroyed)
					someTileWasDestroyedSaver = true;				
			}
		}
	
	
	gen.newTilesCoords();	
	gen.fillTable(0,0);
	
	if(someTileWasDestroyedSaver){
		rn.callFunction("updateGameState", "wait");
	}else {
		rn.callFunction("updateGameState", "play");
	}								
}



function saveProgress(level, stars){
	
	//If new level was opened
	if(level == gameProgress.length - 1){
		gameProgress.push(0);
		gameProgress[level] = stars;
		
		cSaves.setStorageData(Globals.game.KEY_NAME + "progress", JSON.stringify(gameProgress));
	}else{
		if(stars > gameProgress[level]){
			gameProgress[level] = stars;
			cSaves.setStorageData(Globals.game.KEY_NAME + "progress", JSON.stringify(gameProgress));
		}		
	}	
}


const scriptsInEvents = {

		async Levels_ev_Event5_Act1(runtime, localVars)
		{
			createLevels()
		},

		async Levels_ev_Event9_Act5(runtime, localVars)
		{
			var aLevel = runtime.objects.menu_blocks.getPickedInstances();
			Globals.game.activeLevel = aLevel[0].instVars["level"]-1;
			setTimeout(() => runtime.goToLayout("Game_LO"), 300)
		},

		async Game_ev_Event2_Act3(runtime, localVars)
		{
			gameInit()
		},

		async Game_ev_Event2_Act4(runtime, localVars)
		{
			gen.fillTable(localVars.tileUID, localVars.tFrames)
		},

		async Game_ev_Event2_Act9(runtime, localVars)
		{
			checkToLines()
		},

		async Game_ev_Event42_Act1(runtime, localVars)
		{
			checkGameToOver()
		},

		async Game_ev_Event46_Act2(runtime, localVars)
		{
			cSaves.setStorageData(Globals.game.KEY_NAME + "sound", 0);
		},

		async Game_ev_Event47_Act2(runtime, localVars)
		{
			cSaves.setStorageData(Globals.game.KEY_NAME + "sound", 1);
		},

		async Game_ev_Event49_Act3(runtime, localVars)
		{
			cSaves.setStorageData(Globals.game.KEY_NAME + "music", 0);
		},

		async Game_ev_Event50_Act3(runtime, localVars)
		{
			cSaves.setStorageData(Globals.game.KEY_NAME + "music", 0);
		},

		async Game_ev_Event66_Act2(runtime, localVars)
		{
			Globals.game.activeLevel += 1;
		},

		async Game_ev_Event91_Act1(runtime, localVars)
		{
			swapTiles(runtime.globalVars.mainTileUID, runtime.globalVars.secondUID)
		},

		async Game_ev_Event92_Act2(runtime, localVars)
		{
			checkToLines()
		},

		async Game_ev_Event108_Act2(runtime, localVars)
		{
			localVars.resulter = checkToOutsideTiles(localVars.resulter);
		}

};

self.C3.ScriptsInEvents = scriptsInEvents;

