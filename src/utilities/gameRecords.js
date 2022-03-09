class GameRecords extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('gameRecords');
    }
	
    preload ()
    {
    }
      
    create ()
    {	
//this allows usage of attributes and functions from another scenes
		var gameRecords = this.scene.get('gameRecords')
		
//this is how the levels are selected and the selection is preserved in case the player wants to restart the game
		this.levelSelect = -1
//this records how many waves the player has survived in the case the player has lost all their lives in the game
		this.wavesSurvived
//this records how many lives the player has remaining in the case the player has survived all waves
		this.lives
//this records the score the player has attained from the playthrough in case the player wins or loses
		this.score
//this records the highest score the player has attained during the current game session
		this.topScore = 0
// this will record if the user won via the Law (instant win) tower.
		this.instantWin = false;
		
//this function updates the top score by comparing it to the current score
//if the current score is higher, then the top score is changed to the value of the current score
		this.updateTopScore = function(){
			if(gameRecords.score > gameRecords.topScore){
				gameRecords.topScore = gameRecords.score
			}
		}
    }
}

export default GameRecords