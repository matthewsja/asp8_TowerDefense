import levelTile from './assets/level.png';

var tile

class LevelState extends Phaser.Scene
{
	constructor ()
    {
        super('levelState');
    }

    preload ()
    {
        this.load.image('level', levelTile);
    }
      
    create ()
    {
		var container = this.add.container(400, 300)	

      	tile = this.add.tileSprite(0 , 0, 800, 600, 'level')
		container.add(tile);
		
		this.input.on('pointerdown', function () {
        console.log('change states2')
		this.scene.start('playingState')

        }, this);
    }
	
}

export default LevelState

