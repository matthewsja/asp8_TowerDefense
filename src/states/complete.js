class CompleteState extends Phaser.Scene
{
	constructor ()
    {
        super('completeState');
    }

    preload ()
    {
    }
      
    create ()
    {
		this.scene.stop('gameStats')
		this.scene.stop('hud')
		this.scene.stop('map')
		
		var gameRecords = this.scene.get('gameRecords')
		
		var score = 'Score: ' + gameRecords.score
		var topScore = 'Top Score: ' + gameRecords.topScore
		
		var lives = 'Lives Left: ' + gameRecords.lives
		
		// below one line added by XYu on Mar2, just a trial: 
		// create a background picture for level-completion
		// this.level_completion = this.add.image(450, 350, 'level_completion')
		// level_completion.displayWidth = 900
		// level_completion.displayHeight = 700
		//////////////////////////////////////////////////////

		this.endResults = this.add.text(350, 0, 'Level Complete \n' + score + '\n' + topScore + '\n' + lives, { font: '32px Arial' })
		
		var menu = this.add.image(450, 200, 'menu').setInteractive()
		menu.displayWidth = 200
		menu.displayHeight = 100
		var level = this.add.image(450, 350, 'level').setInteractive()
		level.displayWidth = 200
		level.displayHeight = 100
		var restart = this.add.image(450, 500, 'restart').setInteractive()
		restart.displayWidth = 200
		restart.displayHeight = 100
		
		menu.on('pointerdown', function () {
			this.scene.scene.start('menuState')
		})
		
		level.on('pointerdown', function () {
			this.scene.scene.start('levelState')
		})
		
		restart.on('pointerdown', function () {
			this.scene.scene.start('playingState')
		})
    }
}

export default CompleteState

