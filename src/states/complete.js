import AudioManager, { SFX } from '../audiomanager/audioManager.mjs';

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
		var gameRecords = this.scene.get('gameRecords');
		
//this string will be displayed to show the score from the current playthrough
		var score = 'Score: ' + gameRecords.score;
//this string will be displayed to show the highest score from the current play session
		var topScore = 'Top Score: ' + gameRecords.topScore;
//this string will be displayed to show how many lives remain from the current play through
		var lives = 'Lives Left: ' + gameRecords.lives;
		
		// below one line added by XYu on Mar2, just a trial: 
		// create a background picture for level-completion
		// this.level_completion = this.add.image(450, 350, 'level_completion')
		// level_completion.displayWidth = 900
		// level_completion.displayHeight = 700
		//////////////////////////////////////////////////////

		var textX = 0;
		var textY = 0;
		
		if (gameRecords.instantWin)
		{
			// display happy ending background
			this.background_jungle = this.add.image(450, 350, 'embrace_bg');
			// create buttons
			this.createButton(600, 640, 'menu', 90, 60, this.onMenuDown.bind(this));
			this.createButton(720, 640, 'level', 90, 60, this.onLevelDown.bind(this));
			this.createButton(840, 640, 'restart', 90, 60, this.onRestartDown.bind(this));
			// set text positions
			textX = 580;
			textY = 20;
		}
		else
		{
			// display complete background
			this.background_jungle = this.add.image(450, 350, 'level_completion');
			// create buttons
			this.createButton(200, 340, 'menu', 200, 100, this.onMenuDown.bind(this));
			this.createButton(450, 340, 'level', 200, 100, this.onLevelDown.bind(this));
			this.createButton(700, 340, 'restart', 200, 100, this.onRestartDown.bind(this));
			// set text position
			textX = 350;
			textY = 150;
		}

		//display the previously made strings giving a new line to each
		this.endResults = this.add.text(textX, textY, score + '\n' + topScore + '\n' + lives, { font: '32px Arial', align: 'center', color: '#000000' });
    }

	createButton(x, y, image, width, height, callback) {
		var button = this.add.image(x, y, image).setInteractive()
		button.displayWidth = width;
		button.displayHeight = height;
		button.on('pointerdown', callback);
		return button;
	}

	//this takes the game to the main menu scene
	onMenuDown() {
		this.scene.start('menuState');
		AudioManager.playEffect(SFX.BUTTON_CLICK);
	}

	//this takes the game to the level select scene
	onLevelDown() {
		this.scene.start('levelState');
		AudioManager.playEffect(SFX.BUTTON_CLICK);
	}

	//this takes the game to the play scene with the previously set level data
	onRestartDown() {
		this.scene.start('playingState');
		AudioManager.playEffect(SFX.BUTTON_CLICK);
	}
}

export default CompleteState