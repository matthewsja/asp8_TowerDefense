import Phaser from 'phaser';

import MenuState from './menu.js';
import LevelState from './level.js';
import PlayingState from'./playing.js'
import CompleteState from'./complete.js'
import OverState from'./over.js'




const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    width: 800,
    height: 600,
    scene: [MenuState, LevelState, CompleteState, PlayingState, OverState]
};

//var states = ['main menu', 'level select', 'play', 'level complete', 'game over']

const game = new Phaser.Game(config);

