import AudioManager, { SFX } from '../audiomanager/audioManager.mjs';

class HUDLogic extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('hudLogic');
    }

    preload ()
    {
    }
      
    create ()
    {
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')	
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var mapLogicTower = this.scene.get('mapLogicTower')
		var gameStats = this.scene.get('gameStats')
		
//this function helps ensure that the building site tiles could be interacted with correctly by creating an instance of hud.settings with an 'active' attribute
//this instance is removed instantly but it still remains in the memory
		this.startHud = function(){
			hud.settings = hud.add.container(450, 350)
			hud.settings.active = false
			hud.settings.destroy()
		}

//this function creates the setting window which contains buttons to resume the game, restart the game or return to the main menu
		this.makeSettings = function(){
//save the delay time of the origin and towers so they can resume their pace upon resuming the game
			if(map.origin.delay){
				map.origin.delayTime = map.origin.delay.getRemaining()
			}
			map.towerGroup.getChildren().forEach(function(tower){
				if(tower.delay){
					tower.delayTime = tower.delay.getRemaining()
				}
			})
			

//remove any previous versions of the settings window and tower menu if it is active
			mapLogic.removePrev(hud.rec)
			mapLogic.removePrev(hud.towerMenu)
			mapLogic.removePrev(hud.settings)

//ensure that most elements in the game stop while the menu is active
			gameStats.isPlaying = false
			
//ensure that the speed button is unresponsive while the settings window is active
			hud.speedButton.disableInteractive()
//create a rectangle object that covers the entire game window
//this rectangle is used to give everything a slight tint
			var rec = new Phaser.GameObjects.Rectangle(hud, -100, -100, 2000, 2000, '0xAA7878', 0.5)
			hud.rec = hud.add.existing(rec)
			
//create the settings container right in the middle of the game window
			hud.settings = hud.add.container(450, 350)
			
//when this attribute is true, clicking on building sites does nothing
//when it is false, clicking on them opens up the tower menu
			hud.settings.active = true
			

//use a red rectangle from the assets that serves as the background of the settings window
			var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
			hud.settings.add(red)
			red.displayWidth = 600
			red.displayHeight = 400
			
			
//create a resume button that when clicked on will remove the settings window and continue the game
			var resume = new Phaser.GameObjects.Image(hud, 0, -140, 'resume').setInteractive()
			hud.settings.add(resume)
			resume.displayWidth = 200
			resume.displayHeight = 100
			
//create a restart button that when clicked on, resets the states of all the objects in the game as well as the stats
			var restart = new Phaser.GameObjects.Image(hud, 0, -30, 'restart').setInteractive()
			hud.settings.add(restart)
			restart.displayWidth = 200
			restart.displayHeight = 100
			
//create a main menu button that when clicked on takes the game to the main menu state
			var menu = new Phaser.GameObjects.Image(hud, 0, 80, 'menu').setInteractive()
			hud.settings.add(menu)
			menu.displayWidth = 200
			menu.displayHeight = 100

//the interactivity of the resume button
			resume.on('pointerdown', function(){
//set the game to be playing again
				gameStats.isPlaying = true
				
//any game elements that are on cooldown are resumed with their action delay intact
				if(map.origin.state == 'rest'){
					map.origin.delay = map.time.addEvent({delay: map.origin.delayTime, timeScale: gameStats.playSpeed, loop: false})
				}
				map.towerGroup.getChildren().forEach(function(tower){
					if(tower.state == 'reload'){
						tower.delay = map.time.addEvent({delay: tower.delayTime, timeScale: gameStats.playSpeed, loop: false})
					}
				})
//make the speed setting button interactable again
				hud.speedButton.setInteractive()
//allow the building sites to be interactable again
				hud.settings.active = false
//remove the tint that covered the entire game window
				rec.destroy()
//remove the settings container and everything within it
				hud.settings.destroy();
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			})

//the interactivity of the restart button
			restart.on('pointerdown', function () {
//start the play scene again
//since the hud, gameStats and map scenes are called by this scene, the states of these scenes are reset
				this.scene.scene.start('playingState');
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			})
			
//the interactivity of the main menu button
			menu.on('pointerdown', function () {
//change the game state to the main menu state
				this.scene.scene.start('menuState');
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			})

		}
		
//function for when the speed button is clicked on
		this.changeSpeed = function(){
//uses a switch as the options are discrete
//the speed setting increases by one except for when it is at three in which case it reverts back to one
//these just draw the buttons and change the settings, they are not interactive yet
			switch(gameStats.speedSetting){
				case 1:
//manually change the speed setting
					gameStats.speedSetting = 2
//change the button to fit the new setting
					hud.speedButton  = hud.add.image(50, 650, 'arrow2').setInteractive()
					break;
				case 2:
//manually change the speed setting
					gameStats.speedSetting = 3
//change the button to fit the new setting
					hud.speedButton  = hud.add.image(50, 650, 'arrow3').setInteractive()
					break;
				case 3:
//manually change the speed setting
					gameStats.speedSetting = 0
//change the button to fit the new setting
					hud.speedButton  = hud.add.image(50, 650, 'pause').setInteractive()
//save the delay time of the origin and towers so they can resume their pace upon resuming the game
					if(map.origin.delay){
						map.origin.delayTime = map.origin.delay.getRemaining()
					}
					map.towerGroup.getChildren().forEach(function(tower){
						if(tower.delay){
							tower.delayTime = tower.delay.getRemaining()
						}
					})
					break;
				case 0:
//manually change the speed setting
					gameStats.speedSetting = 1
//change the button to fit the new setting
					hud.speedButton  = hud.add.image(50, 650, 'arrow1').setInteractive()
//any game elements that are on cooldown are resumed with their action delay intact
					if(map.origin.state == 'rest'){
						map.origin.delay = map.time.addEvent({delay: map.origin.delayTime, timeScale: gameStats.playSpeed, loop: false})
					}
					map.towerGroup.getChildren().forEach(function(tower){
						if(tower.state == 'reload'){
							tower.delay = map.time.addEvent({delay: tower.delayTime, timeScale: gameStats.playSpeed, loop: false})
						}
					})
					break;
					
				default:
					break
			}
//the interactivity of the buttons
//the buttons were made but don't have specific interactivity assigned to them yet, this adds them
			hud.speedButton.on('pointerdown', function(){
				hudLogic.changeSpeed();
				mapLogic.updateSpeed();
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			})
		}

//display the stats of the current playthrough
		this.showStats = function(){
//strings that will contain the stats from the gameStats scene
			var wave = 'wave: ' + (map.origin.waveCounter+1)
			var lives = 'lives: ' + gameStats.lives
			var money = 'money: ' + gameStats.money
			var score = 'score: ' + gameStats.score

//remove any previous iterations of the displayed stats so the current version won't overlap with previous ones
			mapLogic.removePrev(hud.wave)
			mapLogic.removePrev(hud.gameStats)

//display the current wave number
			hud.wave = hud.add.text(200, 610, wave, {font: '32px Arial'})
//display the stats
			hud.gameStats = hud.add.text(200, 640, lives + ' ' + money + ' ' + score, { font: '32px Arial' })
//set the colour of the displayed text to white
			hud.wave.setTint(0xFFFFFF);
			hud.gameStats.setTint(0xFFFFFF);
		}
		
//this function displays the timer for when a wave is finished and there is a pause between waves
		this.showTimer = function(){
//remove any previous iterations of the display of these stats so the current version won't overlap with previous ones
			mapLogic.removePrev(hud.timerText)
//check if the timer is active
			if(map.origin.coolDown){
//if the timer is active, get the amount of time left in seconds and display it
				var timer = map.origin.coolDown
//make the string that will be displayed using the number of seconds left for the countdown
				var remaining = 'time left: ' + Math.ceil(timer.getRemainingSeconds())
//display the string and make it white
				hud.timerText = hud.add.text(200, 670, remaining, {font: '32px Arial'})
				hud.timerText.setTint(0xFFFFFF)
			}
		}		
    }
	
	update()
	{	
	}
}

export default HUDLogic