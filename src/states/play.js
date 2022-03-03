class PlayingState extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('playingState');
    }

    preload ()
    {
    }
      
    create ()
    {
//start the scenes that make up the game itself
//the code to get multiple scenes running at once is from http://phaser.io/examples/v3/view/scenes/launch-parallel-scene#
		this.scene.launch('gameStats')
		this.scene.launch('map')
		this.scene.launch('hud')
		
    }
}

export default PlayingState