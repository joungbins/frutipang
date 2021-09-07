import * as Globals from "./globals.js";
import * as Utilz from "./utilz.js";


let indexers = 0;
function fillTable (tUID, tFrame){

	for(let i = 0; i < rn.globalVars.GRID_WIDTH; i++)
		for(let j = 0; j < rn.globalVars.GRID_HEIGHT; j++){
		
			if(Globals.game.aGame[i][j] == "" || Globals.game.aGame[i][j] == null){
			
				Globals.game.aGame[i][j] = createTileObj(0, i, j, Utilz.randomz(0, Globals.game.TILES_COUNT));
				Globals.game.aGame[i][j].getSpecial;
				
				rn.callFunction("changeTileFrames", 
								Globals.game.aGame[i][j].tUID, 
								Globals.game.aGame[i][j].type,
								Globals.game.aGame[i][j].tx * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_X,
								Globals.game.aGame[i][j].ty * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_Y,
								Globals.game.aGame[i][j].special); 		
			}			
		}				
}




function createTileObj(tUID, tx, ty, tFrame){
	indexers++;
	return returnOb(indexers, tx, ty, tFrame);
}

function returnOb(tUID, tx, ty, tFrame){
let nObj = {
		type: tFrame, 					// Frame number
		tUID: tUID,						// Unic id
		tx: tx,							// X coord in the array
		ty: ty,							// y coord in the array
		special : "default",
		
		get getSpecial(){	
		
			if(Math.floor(Math.random() * 100) < Globals.game.BONUS_PROB)
				switch(Math.floor(Math.random() * 3)){
					case 0 : { this.special = "bombs"; 		break; }
					case 1 : { this.special = "horizontal"; break; }
					case 2 : { this.special = "vertical"; 	break; }
				}
			else 
				this.special = "default";
		}
	};
	
	return nObj;	
}



function newTilesCoords(){
	// Starting to update current tiles positions. We are must down all tiles for hide empty spaces
	for(let i = 0; i < rn.globalVars.GRID_WIDTH; i++)
		for(let j = 0; j < rn.globalVars.GRID_HEIGHT; j++){
		
			if(Globals.game.aGame[i][j])
						rn.callFunction("updateTilesPositions", 
								Globals.game.aGame[i][j].tUID, 
								Globals.game.aGame[i][j].tx * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_X,
								Globals.game.aGame[i][j].ty * Globals.game.DISTANCE_BETWEEN_TILES + Globals.game.START_Y);
		}
}


function levelLayoutGenerator(levels){
	var counterX = 1;
	var counterY = 1;
	var hOffset = 0;
	var wOffset = 0;
	
	for(var i = 0; i < JSONgame.levels.length; i++){

		rn.callFunction("createLevelBar", 
		 i < levels.length ? 1 : 0, 
		 i <= levels.length ? levels[i] : 0, 
Globals.game.LEVELS_STARS_X + (wOffset > 0 ? -Globals.game.LEVELS_DISTANCE/2 :  0)+ counterX * Globals.game.LEVELS_DISTANCE, 
Globals.game.LEVELS_STARS_Y + counterY * (hOffset > 0 ? Globals.game.LEVELS_DISTANCE/2 :  Globals.game.LEVELS_DISTANCE/2),
			i + 1);
		counterX++;	
		
		hOffset = hOffset == 0 ? 1:0;

		if(counterX >= Globals.game.LEVEL_PER_LINE){
			wOffset = wOffset == 0 ? 1:0;
			counterX = 1;
			counterY++;
		}			
	}
}



export { fillTable, levelLayoutGenerator, newTilesCoords }

