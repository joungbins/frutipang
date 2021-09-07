// This is your game settings
// Also you can changes count of tiles vertical and horizonal
export const game = {
	aGame: [],						// Just game array
	
	KEY_NAME: "super_match_3.",
	
	START_X : 80, 					// Generation grid start position X
	START_Y : 280, 					// Generation grid start position Y
	GRID_WIDTH: 6,					// You can change count of elements here
	GRID_HEIGHT: 9,
	
	TILES_COUNT : 4,				// How much tiles in your game? (Frames from [tiles] obj). Better if you not touch it xD
	DISTANCE_BETWEEN_TILES : 110,
	
	BONUS_PROB : 7,					// Bonus prob in %. 0-100%
	SCORE_PER_ONE: 10,
	SCORE_BOMB: 20,
	SCORE_LINE: 30,
	
	// Levels panel
	// In [levels_menu_LO]
	LEVELS_STARS_X: 30,		// Start X levels position
	LEVELS_STARS_Y: 140,	// Start Y levels position
	LEVEL_PER_LINE: 6,		// How many level blocks per ONE lines
	LEVELS_DISTANCE: 120,	// How close elements will be
	
	// Colors per animation frames
	// This is color og the text that UP after block die
	TEXT_UP_COLORS: ["0,255,0", "255,0,0", "0,255,255", "255,79,232", "255,255,0"],
	
	
	// Do not change it!
	activeLevel: 0,
	stage: 0,
	score : 0,
	stars: 0,
	time: 0,
	score_frames: [0,0,0,0,0]
	
};

