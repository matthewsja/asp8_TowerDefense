import overTile from './assets/over.png';

var tile

class OverState extends Phaser.Scene
{
	constructor ()
    {
        super('overState');
    }

    preload ()
    {
        this.load.image('over', overTile);
    }
      
    create ()
    {
		var container = this.add.container(400, 300)	

      	tile = this.add.tileSprite(0 , 0, 800, 600, 'over')
		container.add(tile);
		
		this.input.on('pointerdown', function () {
        console.log('change states5')
		this.scene.start('menuState')

        }, this);
    }
	
}

export default OverState

