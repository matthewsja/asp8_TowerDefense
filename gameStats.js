class GameStats extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('gameStats');
		Phaser.Scene.call(this,{key: 'gameStats'})

		this.lives
		this.score
		this.money
    }

    preload ()
    {
    }
      
    create ()
    {
		this.lives = 20
		this.money = 0
    }
	
	update()
	{	
		function gameOver(lives, target){
			if(lives <= 0){
				console.log('game over')
			
				target.scene.start('overState')
			}
		}
		
		gameOver(this.lives, this)
	}
}

export default GameStats