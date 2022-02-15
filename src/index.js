import Phaser from 'phaser';

import Resources from './resources.js'

import Bootstrap from './states/bootstrap.js'
import MenuState from './states/menu.js';
import LevelState from './states/level.js';
import PlayState from'./states/play.js'
import CompleteState from'./states/complete.js'
import OverState from'./states/over.js'

import Map from './play objects/map.js'
import MapLogic from './play objects/mapLogic.js'
import HUD from './play objects/hud.js'
import HUDLogic from './play objects/hudLogic.js'
import GameStats from './play objects/gameStats.js'


const config = {
    type: Phaser.AUTO,
    parent: 'phaser-game',
    width: 800,
    height: 600,
	    physics: {
        default: 'arcade',
			arcade: {
                gravity: { y: 0 },
                debug: true
            }
    },
    scene: [Bootstrap, MenuState, LevelState, CompleteState, PlayState, OverState, Map, MapLogic, HUD, HUDLogic, GameStats, Resources]
};
const game = new Phaser.Game(config);