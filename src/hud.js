//images that when clicked on changes scene
import one from './assets/1.png'
import two from './assets/2.png'
import three from './assets/3.png'
import four from './assets/4.png'
import five from './assets/5.png'

class HUD extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('hud');
		Phaser.Scene.call(this,{key: 'hud'})
		
		//buttons for scene changes
		this.one1;
		this.two2;
		this.three3;
		this.four4;
		this.five5;
    }

    preload ()
    {

//scene change images
		this.load.image('one', one)
		this.load.image('two', two)
		this.load.image('three', three)
		this.load.image('four', four)
		this.load.image('five', five)
    }
      
    create ()
    {
//make the buttons that change scenes
		this.one1 = this.add.image(50, 50, 'one').setInteractive()
		this.two2 = this.add.image(150, 50, 'two').setInteractive()
		this.three3 = this.add.image(250, 50, 'three').setInteractive()
		this.four4 = this.add.image(350, 50, 'four').setInteractive()
		this.five5 = this.add.image(450, 50, 'five').setInteractive()
	
//make the scene change buttons do as required
		this.one1.on('pointerdown', function () {
			console.log('change states1')
			this.scene.scene.start('menuState')
		})
		
		this.two2.on('pointerdown', function () {
			console.log('change states2')
			this.scene.scene.start('levelState')

		})
		
		this.three3.on('pointerdown', function () {
			console.log('change states3')
			this.scene.scene.start('playingState')
			
		})
		
		this.four4.on('pointerdown', function () {
			console.log('change states4')
			this.scene.scene.start('completeState')
		})
		
		this.five5.on('pointerdown', function () {
			console.log('change states5')
			this.scene.scene.start('overState')
		})
    }
	
	update()
	{	
	}
}

export default HUD