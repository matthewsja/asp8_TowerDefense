import completeTile from './assets/complete.png';

var tile

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
		var container = this.add.container(400, 300)	

      	tile = this.add.tileSprite(0 , 0, 800, 600, 'complete')
		container.add(tile);
		
		this.input.on('pointerdown', function () {
        console.log('change states4')
		this.scene.start('overState')

        }, this);
    }
	
}

export default CompleteState

