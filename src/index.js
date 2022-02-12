import Phaser from 'phaser';

import Resources from './resources.js'

import Bootstrap from './states/bootstrap.js'
import MenuState from './states/menu.js';
import LevelState from './states/level.js';
import PlayState from'./states/play.js'
import CompleteState from'./states/complete.js'
import OverState from'./states/over.js'

import Map from './map.js'
import MapLogic from './mapLogic.js'
import HUD from './hud.js'
import HUDLogic from './hudLogic.js'
import GameStats from './gameStats.js'


const config = {
    type: Phaser.scene,
    parent: 'phaser-example',
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