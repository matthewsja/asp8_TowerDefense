import one from './assets/1.png'
import two from './assets/2.png'
import three from './assets/3.png'
import four from './assets/4.png'
import five from './assets/5.png'

import red from './assets/red_square.png'
import green from './assets/green_square.png'
import blue from './assets/blue_square.png'

import cross from './assets/x.png'

import circle from './assets/circle.png'

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
		this.load.image('one', one)
		this.load.image('two', two)
		this.load.image('three', three)
		this.load.image('four', four)
		this.load.image('five', five)
		
		this.load.image('red', red)
		this.load.image('green', green)
		this.load.image('blue', blue)
		
		this.load.image('cross', cross)
		
		this.load.image('circle', circle)
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
		
		
	}
}

export default HUD