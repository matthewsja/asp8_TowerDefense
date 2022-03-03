class CompleteState extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('completeState');
    }

    preload ()
    {
    }
      
    create ()
    {
//these prevent the active scenes used in playing the game from covering the elements of this scene		
		this.scene.stop('gameStats')
		this.scene.stop('hud')
		this.scene.stop('map')
		
//this allows usage of attributes and functions from another scene
		var gameRecords = this.scene.get('gameRecords')
		
//this string will be displayed to show the score from the current playthrough
		var score = 'Score: ' + gameRecords.score
//this string will be displayed to show the highest score from the current play session
		var topScore = 'Top Score: ' + gameRecords.topScore
//this string will be displayed to show how many lives remain from the current play through
		var lives = 'Lives Left: ' + gameRecords.lives
		
		// below one line added by XYu on Mar2, just a trial: 
		// create a background picture for level-completion
		// this.level_completion = this.add.image(450, 350, 'level_completion')
		// level_completion.displayWidth = 900
		// level_completion.displayHeight = 700
		//////////////////////////////////////////////////////

//display the previously made strings giving a new line to each
		this.endResults = this.add.text(350, 0, 'Level Complete \n' + score + '\n' + topScore + '\n' + lives, { font: '32px Arial' })
		
//display some images, make them interactable and certain sizes
		var menu = this.add.image(450, 200, 'menu').setInteractive()
		menu.displayWidth = 200
		menu.displayHeight = 100
		var level = this.add.image(450, 350, 'level').setInteractive()
		level.displayWidth = 200
		level.displayHeight = 100
		var restart = this.add.image(450, 500, 'restart').setInteractive()
		restart.displayWidth = 200
		restart.displayHeight = 100
		
//when these images are clicked on, the scene of the game changes depending on which one was clicked
//this takes the game to the main menu scene
		menu.on('pointerdown', function () {
			this.scene.scene.start('menuState')
		})
//this takes the game to the level select scene
		level.on('pointerdown', function () {
			this.scene.scene.start('levelState')
		})
//this takes the game to the play scene with the previously set level data
		restart.on('pointerdown', function () {
			this.scene.scene.start('playingState')
		})
    }
}

export default CompleteState