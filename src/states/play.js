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
    }
      
    create ()
    {
		this.scene.launch('map')
		this.scene.launch('mapLogic')
		this.scene.launch('hud')	
		this.scene.launch('gameStats')
    }
	
	update()
	{	
	}
}

export default PlayingState