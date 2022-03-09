// This is the Character List page. 
/////////////////////////////////////////////////////////////

import AudioManager, { SFX } from '../audiomanager/audioManager';

////////////////////////////////////////////////////////////////////////////
//  The Treasure box containing: towers, and enemies. 
//  Added by XYu on Mar 5
////////////////////////////////////////////////////////////////////////////

class TreasureState extends Phaser.Scene
{
	constructor ()
    {
        //the scene changes to this one when this keyword is used
        super('treasureState');
    }

    preload ()
    {
        //this.load.image(450, 350, 'treasure_bg') 
        // try{
        //     this.load.image(450, 350, 'treasure_bg') 
        // }
        // catch(err){
        //     logMyErrors(err)
        //     console('Error in loading treasure_bg') 
        // }
    }
      
    create ()
    {
		
//these prevent the active scenes used in playing the game from covering the elements of this scene
//code to stop a scene from https://newdocs.phaser.io/docs/3.55.2/focus/Phaser.Scenes.ScenePlugin-stop
		try{
            this.scene.stop('gameStats')
            this.scene.stop('hud')
            this.scene.stop('map')

            // below added by XYu on Mar 5, to add background picture: 
            this.background_treasure = this.add.image(450, 350, 'treasure_bg')
            //////////////////////////////////////////////

            
            //create an image that does something when clicked on
            var startButton = this.add.image(600, 620, 'start').setInteractive()
            startButton.displayWidth = 150
            startButton.displayHeight = 120 

            //when the image is clicked on, the scene changes to the 'levelState' scene
            //code to change scenes from https://www.thepolyglotdeveloper.com/2020/09/switch-between-scenes-phaser-game/
            startButton.on('pointerdown', function () {
                this.scene.scene.start('levelState');  //jump to level selection page
                AudioManager.playEffect(SFX.BUTTON_CLICK);
            })
        }
        catch(err){
            logMyErrors(err)
        }
        
        //creates 'back' button: 
		var back = this.add.image(50, 50, 'left').setInteractive()
        //when the image is clicked on the game would be the menu state
        back.on('pointerdown', function () {
            this.scene.scene.start('menuState');
            AudioManager.playEffect(SFX.BUTTON_CLICK);
        })

    }
	
}

export default TreasureState


/////////////////////////////////////////////////////////////
// Steps I’ve done on Mar 5, bu XYu: 
//
// Add images to the asset/images folder. 
// In resources.js page, add images. 

// Added ‘treasure box’ page. 
// Create ‘treasure.js’ file. Copy necessary contents to it. 
// In treasure.js, Change the class name to ‘TreasureState’. 
// In treasure.js, In constructor, super('treasureState');
// Add the page you want buttons to jump to, e.g. this.scene.scene.start('levelState'); 
// At the bottom in treasure.js, write: export default TreasureState

// In index.js, import TreasureState from './states/treasure.js'
// In index.js bottom, add TreasureState to the scene list. 

// In menu.js bottom, make the ‘start’ button jump to this treasure page: this.scene.scene.start('treasureState');
/////////////////////////////////////////////////////////////
