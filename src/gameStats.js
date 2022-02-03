class GameStats extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('gameStats');
		Phaser.Scene.call(this,{key: 'gameStats'})

    }

    preload ()
    {
    }
      
    create ()
    {
		this.lives = 20
		this.money = 0
		this.monsters = 10
		this.score = 0
		this.speedSetting = 1
    }
	
	update()
	{	
// this allows getting public attributes from the 'map' scene
		var map = this.scene.get('map')

// in the case that the value of lives reaches 0, the scene will change to the 'game over' scene
		function gameOver(lives, target){
			if(lives <= 0){
				console.log('game over')
// this changes the scene
				target.scene.start('overState')
			}
		}
//this calls the function
		gameOver(this.lives, this)

// in the case that the value of monsters is zero and the current number of living enemies is zero, the scene will change to the 'level complete' scene
		function levelComplete(monsters, living, target){
			if((monsters <= 0) && (living == 0)){
				console.log('level complete')
// this changes the scene
				target.scene.start('completeState')
			}
		}

//this calls the function
		levelComplete(this.monsters, map.numEnemies, this)		
	}
}

export default GameStats