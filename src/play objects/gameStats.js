class GameStats extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('gameStats');

    }

    preload ()
    {
    }
      
    create ()
    {	
//these allow usage of attributes and functions from other scenes		
		var gameStats = this.scene.get('gameStats')
		var resources = this.scene.get('resources')
		
//take the starting parameters from the resources scene and feed them to the gameStats scene as different attributes
//the code is a bit verbose, this shortens it for later use
		var params = resources.mapData['startParams']
		
		this.lives = params['lives']
		this.money = params['money']
		this.score = params['score']
		this.speedSetting = params['speedSetting']
		this.isPlaying = params['isPlaying']
    }
	
	update()
	{	
//these allow usage of attributes and functions from other scenes
		var map = this.scene.get('map')
		var gameStats = this.scene.get('gameStats')
		var gameRecords = this.scene.get('gameRecords')
		
//in the case that the value of lives reaches 0, the game will change to the game over state
			if(this.lives <= 0){
				console.log('game over')
//record the current score to be displayed later
				gameRecords.score = gameStats.score
//call the function to update the high score if needed
				gameRecords.updateTopScore()
//record the number of waves survived to be displayed later
				gameRecords.wavesSurvived = map.origin.waveCounter
// this changes the scene
				map.timer = false
				this.scene.start('overState')
			}
//change the speed at which different elements of the game run by multiplying the speed setting by whether the game is meant to be running
//as the whether the game is meant to be playing is set as a boolean, this means that the multiplication is by either 0 or 1
		this.playSpeed = this.speedSetting * this.isPlaying
	}
}

export default GameStats