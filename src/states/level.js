// This is the Level Selection page. 
/////////////////////////////////////////////////////////////

import AudioManager, { SFX } from '../audiomanager/audioManager.mjs';

class LevelState extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('levelState');
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
		
		// The title, added by XYu Mar5: 
		this.bar = this.add.image(450, 100, 'level_selection_bar')
		//////////////////////////////

//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var gameRecords = this.scene.get('gameRecords')
		var levelSelect = this.scene.get('level')

//creates an image that could be clicked on
		var back = this.add.image(50, 50, 'left').setInteractive()
//when the image is clicked on the game would be the menu state
		back.on('pointerdown', function () {
			this.scene.scene.start('treasureState');
			AudioManager.playEffect(SFX.BUTTON_CLICK);
		}) 
		
//the title of the scene
		// this.title = this.add.text(350, 0, 'Level Select', { font: '32px Arial' })
		
//adds a description box, would be used and populated later
		this.descBox
		
//this function positions the buttons which when clicked on would take the player to the level that was clicked on
		this.levelButtons = function(){
//iterates over all the levels that could be played
			for(var i = 0; i < resources.levelList.length; i++){
				var x
//the y position is preset to this as there are not enough levels to worry about
				var y = 250
//the x position of the button depends on the index in the for loop
//so far, this only accommodates five levels
				switch (i){  // XYu has changed these values Mar 5
					case 0:
						x = 100
						break;
					case 1: 
						x = 250
						break;
					case 2:
						x = 400
						break;
					case 3:
						x = 550
						break;
					case 4:
						x = 700
						break;
					default:
						console.log('x error')
						break;
				}
//call the function to actually make the button with position data based on the previously set parameters
				this.makeButton(resources.levelList[i], x, y)		
			}
		}

		
//this function is used to make a button for each level that could be played
//takes in as parameters 1)the key of the level and the 2)x and 3)y coordinates of where the button would be located 
		this.makeButton = function(level, x, y){
//makes an image and makes it interactive
//the image is the image chosen by the level from the loaded images
			var levelButton = this.add.image(x, y, resources.levels[level]['selection']['picture']).setInteractive()
			
//takes the description of the level and saves it to the image
			levelButton.description = resources.levels[level]['selection']['description']
//when the mouse is over the level image, something happens
			this.input.on('pointerover', function(pointer, gameobject){
//this try statement is to prevent any interactivity when the mouse is not over the level image
				try{
//this is to prevent multiple versions of the descbox from being created by removing the previous version
					 if(this.scene.descBox){
						this.scene.descBox.destroy()
					}
//the gameobject is a list with the image as its zeroth element
//takes the description that was saved earlier in the image
//the reason for the zeroth index is due to the gameobject being of some sort of list data type, not image
					if(gameobject[0].description){
//creates a container which is slightly to the right of the mouse position
						this.scene.descBox = this.scene.add.container(pointer.x + 100, pointer.y)
//add a red box to the container
//code to make a container for storing images is from https://phaser.io/examples/v3/view/game-objects/container/arcade-physics-body-test#
						var red = new Phaser.GameObjects.Image(this.scene, 0, 0, 'red')
						red.displayWidth = 200
						red.displayHeight = 200
						this.scene.descBox.add(red, level)

//add some text to the container
//this is just the size, colour and typeface of the text
						var config = {fontSize:'18px', color:'#000000', fontFamily: 'Arial'}

//set the position of the text as well as what text to display
//these coordinates are relative to the position of the centre of the container
						var displayDesc = new Phaser.GameObjects.Text(
							this.scene,
							-90,
							-90,
							gameobject[0].description,
							config
						)
//add the text to the box
						this.scene.descBox.add(displayDesc, this.scene)
					}
				}
				catch(err){
					err
				}
//when the mouse is removed from the image, the descbox is removed				
				this.scene.input.on('pointerout', function(){
					if(this.scene.descBox){
						this.scene.descBox.destroy()
					}
				})	
			})
//when the image is clicked on, a function is called with the name of the level being passed to it
			levelButton.on('pointerdown', function(){
				this.scene.clickButton(level);
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			})
			
		}
		
//function to handle what happens when a level button is clicked on
//takes in as a parameter the name of the level
		this.clickButton = function(level) {
//sets the value of the selected level in gameRecords to the name of this level
			gameRecords.levelSelect = level.toString();
//finds the level in resources based on the name and sets the current level to it
			resources.mapData = resources.levels[gameRecords.levelSelect];
//changes the scene to the playingStats scene
			this.scene.start('playingState');
			AudioManager.playEffect(SFX.BUTTON_CLICK);	
		}
		
//call the function to make the level buttons
		this.levelButtons()
    }
}

export default LevelState

