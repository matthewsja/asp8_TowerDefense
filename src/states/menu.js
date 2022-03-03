import AudioManager, { SFX } from '../audiomanager/audioManager';

import testTile from '../assets/images/menu.png';

var tile

class MenuState extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('menuState');
    }

    preload ()
    {
        this.load.image('tile', testTile);
    }
      
    create ()
    {
		

//these prevent the active scenes used in playing the game from covering the elements of this scene
//code to stop a scene from https://newdocs.phaser.io/docs/3.55.2/focus/Phaser.Scenes.ScenePlugin-stop
		this.scene.stop('gameStats')
		this.scene.stop('hud')
		this.scene.stop('map')
			
		// below added by XYu on Mar 2, to add background picture: 
		this.background_jungle = this.add.image(450, 350, 'background_jungle')
		//////////////////////////////////////////////

//make a tiled background
//from https://www.phaser.io/examples/v3/view/game-objects/tile-sprite/tilesprite-pixel-art-test#
      	//var tile = this.add.tileSprite(450 , 350, 900, 700, 'tile')
		// commented out by XYu on Mar3. 

//create an image that does something when clicked on
		var start = this.add.image(450, 480, 'start').setInteractive()
		start.displayWidth = 200
		start.displayHeight = 200  

//when the image is clicked on, the scene changes to the 'levelState' scene
//code to change scenes from https://www.thepolyglotdeveloper.com/2020/09/switch-between-scenes-phaser-game/
		start.on('pointerdown', function () {
			this.scene.scene.start('levelState');
			AudioManager.playEffect(SFX.BUTTON_CLICK);
		})
    }
	
}

export default MenuState