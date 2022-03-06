import AudioManager, { SFX } from '../audiomanager/audioManager.mjs';

class HUD extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('hud');
    }

    preload ()
    {
    }
      
    create ()
    {	
//these allow usage of attributes and functions from other scenes
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var hudLogicTower = this.scene.get('hudLogicTower')
		var mapLogic = this.scene.get('mapLogic')

//call function that creates the settings container at the start
//this is so the building site tiles could be correctly interacted with
		hudLogic.startHud()
		
//create the image of the circle at the top right of the game window
		this.circle = this.add.image(850, 50, 'circle').setInteractive()

//when the circle is clicked on, the function that makes the settings is called
		this.circle.on('pointerdown', function(){
			hudLogic.makeSettings();
			AudioManager.playEffect(SFX.BUTTON_CLICK);
		})
		
//create the speed button at the bottom left of the game window
		this.speedButton  = this.add.image(50, 650, 'arrow1').setInteractive()
		
//when the speed button is clicked on, the speed of the game changes
		this.speedButton.on('pointerdown', function(){
			hudLogic.changeSpeed();
			mapLogic.updateSpeed();
			AudioManager.playEffect(SFX.BUTTON_CLICK);
		})	
    }
	
	update()
	{	
//this allows usage of functions from other scenes
		var hudLogic = this.scene.get('hudLogic')
		var hudLogicTower = this.scene.get('hudLogicTower')
		
//call the function that gives the buy tower buttons a tint if there is not enough money to buy the tower
		hudLogicTower.updateTint()
//call the function that displays different stats stored in the gameStats scene
		hudLogic.showStats()
//call the function that displays the countdown timer between waves when it is active
		hudLogic.showTimer()
	}
}

export default HUD