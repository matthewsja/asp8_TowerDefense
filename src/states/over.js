import overTile from '../assets/images/over.png';

class OverState extends Phaser.Scene
{
	constructor ()
    {
        super('overState');
    }

    preload ()
    {
		this.load.image('over', overTile)
    }
      
    create ()
    {
		this.scene.stop('gameStats')
		this.scene.stop('hud')
		this.scene.stop('map')
		
		var gameRecords = this.scene.get('gameRecords')
		
		var score = 'Score: ' + gameRecords.score
		var topScore = 'Top Score: ' + gameRecords.topScore
		
		var waves = 'Waves Survived: ' + gameRecords.wavesSurvived
		
		this.endResults = this.add.text(350, 0, 'Game Over \n' + score + '\n' + topScore + '\n' + waves, { font: '32px Arial' })
		
		
		var menu = this.add.image(450, 250, 'menu').setInteractive()
		menu.displayWidth = 200
		menu.displayHeight = 100
		var level = this.add.image(450, 400, 'level').setInteractive()
		level.displayWidth = 200
		level.displayHeight = 100
		var restart = this.add.image(450, 550, 'restart').setInteractive()
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

export default OverState

