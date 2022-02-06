//background image repeated
import grassTile from '../assets/grass.png';



class PlayingState extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('playingState');
		Phaser.Scene.call(this,{key: 'playingState'})

    }

    preload ()
    {
		//background image
        this.load.image('grass', grassTile);
		

    }
      
    create ()
    {
		this.scene.sendToBack()

		
		//make the tiled background
		this.backgroundTiles = this.add.container()	
      	this.tile = this.add.tileSprite(400 , 300, 800, 600, 'grass')
		this.backgroundTiles.add(this.tile);
		
		this.scene.launch('resources')
		
		this.scene.launch('map')
		this.scene.launch('mapLogic')
		this.scene.launch('hud')	
		this.scene.launch('hudLogic')
		this.scene.launch('gameStats')
    }
	
	update()
	{	
	}
}

export default PlayingState