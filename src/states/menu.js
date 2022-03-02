// This page is the second page after the main icon. 
// It shows 'START' button. 


import AudioManager, { SFX } from '../audiomanager/audioManager';

import testTile from '../assets/images/menu.png';

var tile

class MenuState extends Phaser.Scene
{
	constructor ()
    {
        super('menuState');
    }

    preload ()
    {
        this.load.image('tile', testTile);

    }
      
    create ()
    {
		// below added by XYu on Mar 2, just a trial: 
		this.background_jungle = this.add.image(450, 350, 'background_jungle')

		this.scene.stop('gameStats')
		this.scene.stop('hud')
		this.scene.stop('map')
			
		var container = this.add.container(450, 350)	

      	//tile = this.add.tileSprite(0 , 0, 900, 700, 'tile')
		//container.add(tile);
		
		var start = this.add.image(450, 350, 'start').setInteractive()
		start.displayWidth = 200
		start.displayHeight = 200

		start.on('pointerdown', function () {
			this.scene.scene.start('levelState');
			AudioManager.playEffect(SFX.BUTTON_CLICK);
		})
    }
	
}

export default MenuState