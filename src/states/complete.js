import completeTile from '../assets/complete.png';

import one from '../assets/1.png'
import two from '../assets/2.png'
import three from '../assets/3.png'
import four from '../assets/4.png'
import five from '../assets/5.png'

var tile

var one1;
var two2;
var three3;
var four4;
var five5;

class CompleteState extends Phaser.Scene
{
	constructor ()
    {
        super('completeState');
    }

    preload ()
    {
        this.load.image('complete', completeTile);
		this.load.image('one', one)
		this.load.image('two', two)
		this.load.image('three', three)
		this.load.image('four', four)
		this.load.image('five', five)
    }
      
    create ()
    {
		this.scene.stop('gameStats')
		this.scene.stop('hud')
		this.scene.stop('map')
		
		var container = this.add.container(400, 300)	

      	tile = this.add.tileSprite(0 , 0, 800, 600, 'complete')
		container.add(tile);
		
		one1 = this.add.image(50, 50, 'one').setInteractive()
		two2 = this.add.image(150, 50, 'two').setInteractive()
		three3 = this.add.image(250, 50, 'three').setInteractive()
		four4 = this.add.image(350, 50, 'four').setInteractive()
		five5 = this.add.image(450, 50, 'five').setInteractive()
		
		one1.on('pointerdown', function () {
			console.log('change states1')
			this.scene.scene.start('menuState')
		})
		
		two2.on('pointerdown', function () {
			console.log('change states2')
			this.scene.scene.start('levelState')
		})
		
		three3.on('pointerdown', function () {
			console.log('change states3')
			this.scene.scene.start('playingState')
		})
		
		four4.on('pointerdown', function () {
			console.log('change states4')
			this.scene.scene.start('completeState')
		})
		
		five5.on('pointerdown', function () {
			console.log('change states5')
			this.scene.scene.start('overState')
		})
    }
	
}

export default CompleteState

