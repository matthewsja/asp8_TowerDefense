//import Phaser for this to work at all
import Phaser from 'phaser';

//import the utility scene classes
//utility classes help the game run in multiple ways like storing all the assets or storing data between scenes
//these scenes don't appear and are constantly running
import Resources from './utilities/resources.js'
import CheckJSON from './utilities/checkJSON.js'
import GameRecords from './utilities/gameRecords.js'

//import the state scene classes
//these are the scenes that would be displayed when the game's state changes
import Bootstrap from './states/bootstrap.js'
import MenuState from './states/menu.js'
import LevelState from './states/level.js'
import PlayState from './states/play.js'
import CompleteState from './states/complete.js'
import OverState from './states/over.js'; 
import TreasureState from './states/treasure.js'  //added by XYu Mar 5

 

//import the play scene classes
//these are the scenes that would be used when the game is in the play state
//the scenes with the name 'Logic' only contain functions that would be called upon when needed
import Map from './play objects/map.js'
import MapLogic from './play objects/mapLogic.js'
import MapLogicEnemy from './play objects/mapLogicEnemy.js'
import MapLogicTower from './play objects/mapLogicTower.js'
import HUD from './play objects/hud.js'
import HUDLogic from './play objects/hudLogic.js'
import HUDLogicTower from './play objects/hudLogicTower.js'
import GameStats from './play objects/gameStats.js'

//set different configurations for the game
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
//set the game window width and height
    width: 900,
    height: 700,
//the game uses a simple version of physics
	    physics: {
        default: 'arcade',
			arcade: {
                gravity: { y: 0 },
                debug: false
            }
    },
//a list of all the scenes used in the game
//the first one in the list will be the one to be displayed upon loading the game
    scene: [
		Bootstrap, 
		MenuState, 
		LevelState, 
		CompleteState, 
		PlayState, 
		OverState, 
		TreasureState, 
		Map, 
		MapLogic, 
		MapLogicEnemy, 
		MapLogicTower, 
		HUD, 
		HUDLogic,
		HUDLogicTower,
		GameStats, 
		Resources,
		CheckJSON,
		GameRecords
	]
};

//start the game here
const game = new Phaser.Game(config);