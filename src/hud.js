import ten from './assets/10.png'

class HUD extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('hud');
		Phaser.Scene.call(this,{key: 'hud'})
    }

    preload ()
    {
		this.load.image('ten', ten)
    }
      
    create ()
    {	
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')

//call function that creates the settings container at the start
//this is so the building site tiles could be correctly interacted with
		hudLogic.startHud()
		
//create the image of the circle at the top right
		this.circle = this.add.image(750, 50, 'circle').setInteractive()

//when the circle is clicked on, the function that makes the settings is called
		this.circle.on('pointerdown', function(){
			hudLogic.makeSettings()
		})
		
//create the speed button at the bottom left
		this.speedButton  = this.add.image(50, 550, 'one').setInteractive()
		
//when the speed button is clicked on, the speed speed of the game changes
		this.speedButton.on('pointerdown', function(){
			hudLogic.changeSpeed()
			mapLogic.updateSpeed()
		})
		
    }
	
	update()
	{	
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		
		hudLogic.updateTint()
		hudLogic.showStats()
		

		
		hudLogic.showTimer()

		
	}
}

export default HUD