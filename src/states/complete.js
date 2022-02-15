import completeTile from '../assets/images/complete.png';


var tile

var one1;
var two2;
var three3;

class CompleteState extends Phaser.Scene
{
	constructor ()
    {
        super('completeState');
    }

    preload ()
    {
        this.load.image('complete', completeTile);
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
    }
	
}

export default CompleteState

