import ten from './assets/10.png'

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
		this.load.image('ten', ten)
    }
      
    create ()
    {	
		
		var gameStats = this.scene.get('gameStats')
		var resources = this.scene.get('resources')

//function that takes the starting parameters from the resources scene and feeds them to the gameStats scene
		this.startParams = function(params){
			gameStats.lives = params['lives']
			gameStats.money = params['money']
			gameStats.monsters = params['monsters']
			gameStats.score = params['score']
			gameStats.speedSetting = params['speedSetting']
			gameStats.isPlaying = params['isPlaying']
		}
		
		gameStats.startParams(resources.startParam)
		
    }
	
	update()
	{	
// this allows getting public attributes from the 'map' scene
		var map = this.scene.get('map')
		var gameStats = this.scene.get('gameStats')
		
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
		
		gameStats.playSpeed = gameStats.speedSetting * gameStats.isPlaying
	}
	
	
	
	
	
}

export default GameStats