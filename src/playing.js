import grassTile from './assets/grass.png';

var tile


class PlayingState extends Phaser.Scene
{
	constructor ()
    {
        super('playingState');
		Phaser.Scene.call(this,{key: 'playingState'})
    }

    preload ()
    {
        this.load.image('grass', grassTile);
    }
      
    create ()
    {
		var container = this.add.container(400, 300)	

      	tile = this.add.tileSprite(0 , 0, 800, 600, 'grass')
		container.add(tile);
		
		this.input.once('pointerdown', function () {
        	console.log('change states3')
			this.scene.start('completeState')

        }, this);
    }
	
}

export default PlayingState