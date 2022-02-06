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

		this.circle = this.add.image(750, 50, 'circle').setInteractive()
			
		this.circle.on('pointerdown', function(){
			hudLogic.makeSettings()
		})
		
		this.speedButton  = this.add.image(50, 550, 'one').setInteractive()
		
		this.speedButton.on('pointerdown', function(){
			hudLogic.changeSpeed()
			mapLogic.updateSpeed()
		})

    }
	
	update()
	{	
		var hudLogic = this.scene.get('hudLogic')
		
		hudLogic.updateTint()
		hudLogic.showStats()
	}
}

export default HUD