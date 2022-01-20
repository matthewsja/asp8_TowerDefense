import testTile from './assets/menu.png';

var tile

class MenuState extends Phaser.Scene
{
	constructor ()
    {
        super('menuState');
    }

    preload ()
    {
        this.load.image('tile', testTile);
    }
      
    create ()
    {
		var container = this.add.container(400, 300)	

      	tile = this.add.tileSprite(0 , 0, 800, 600, 'tile')
		container.add(tile);
		
		this.input.on('pointerdown', function () {
        console.log('change states1')
		this.scene.start('levelState')

        }, this);
    }
	
}

export default MenuState

