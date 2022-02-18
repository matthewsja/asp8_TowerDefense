class GameRecords extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('gameRecords');
		Phaser.Scene.call(this,{key: 'gameRecords'})

    }
	
    preload ()
    {
    }
      
    create ()
    {	
		var gameRecords = this.scene.get('gameRecords')
		
		this.levelSelect = -1
		
		this.wavesSurvived
		
		this.lives
		
		this.score
		this.topScore = 0
		
		this.updateTopScore = function(){
			if(gameRecords.score > gameRecords.topScore){
				gameRecords.topScore = gameRecords.score
			}
		}
		
    }
	
	update()
	{	
	}
}

export default GameRecords