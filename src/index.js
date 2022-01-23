import Phaser from 'phaser';

import MenuState from './states/menu.js';
import LevelState from './states/level.js';
import PlayState from'./states/play.js'
import CompleteState from'./states/complete.js'
import OverState from'./states/over.js'




const config = {
    type: Phaser.scene,
    parent: 'phaser-example',
    width: 800,
    height: 600,
	    physics: {
        default: 'arcade',
			arcade: {
                gravity: { y: 0 },
                debug: false
            }
    },
    scene: [MenuState, LevelState, CompleteState, PlayState, OverState]
};


const game = new Phaser.Game(config);

