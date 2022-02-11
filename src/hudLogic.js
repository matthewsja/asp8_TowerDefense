class HUDLogic extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('hudLogic');
		Phaser.Scene.call(this,{key: 'hudLogic'})
    }

    preload ()
    {
    }
      
    create ()
    {
		var resources = this.scene.get('resources')	
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		
//this function helps ensure that the building site tiles could be interacted with correctly
		this.startHud = function(){
			var settings = new Phaser.GameObjects.Container(hud, 400, 300)
			hud.settings = hud.add.existing(settings)
			settings.active = false
			settings.destroy()
		}

//this function creates the setting window
		this.makeSettings = function(){
//removes any previous versions of the settings window and tower menu if it is active
			mapLogic.removePrev(hud.rec)
			mapLogic.removePrev(hud.towerMenu)
			mapLogic.removePrev(hud.settings)

//ensure that everything in the game stops
			gameStats.isPlaying = false
			
//ensure that the speed button is unresponsive while the settings window is active
			hud.speedButton.disableInteractive()
			var rec = new Phaser.GameObjects.Rectangle(hud, -100, -100, 2000, 2000, '0xAA7878', 0.5)
			hud.rec = hud.add.existing(rec)
			
//create the settings container right in the middle of the game window
			var settings = new Phaser.GameObjects.Container(hud, 400, 300)
			settings.active = true
			hud.settings = hud.add.existing(settings)
			
//create a red rectangle from an image that serves as the background of the settings window
			var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
			red.displayWidth = 600
			red.displayHeight = 400
			settings.add(red, hud)
			
//create a resume button that when clicked on will remove the settings window and continue the game
			var resume = new Phaser.GameObjects.Image(hud, 0, -140, 'resume').setInteractive()
			settings.add(resume, hud)
			
			resume.displayWidth = 200
			resume.displayHeight = 100
			
//create a restart button that when clicked on resets all the states of all the objects in the game and all the stats
			var restart = new Phaser.GameObjects.Image(hud, 0, -30, 'restart').setInteractive()
			settings.add(restart, hud)
			
			restart.displayWidth = 200
			restart.displayHeight = 100
			
//create a main menu button that when clicked on takes the game to the main menu state
			var menu = new Phaser.GameObjects.Image(hud, 0, 80, 'menu').setInteractive()
			settings.add(menu, hud)
			
			menu.displayWidth = 200
			menu.displayHeight = 100

//the interactivity of the resume button
			resume.on('pointerdown', function(){
				gameStats.isPlaying = true
				
				map.input.manager.enabled = true
				map.origin.state = 'created'
				hud.speedButton.setInteractive()
				rec.destroy()
				settings.destroy()
				settings.active = false
			})

//the interactivity of the restart button
			restart.on('pointerdown', function () {
				console.log('change states3')
				this.scene.scene.start('playingState')
			})
			
//the interactivity of the main menu button
			menu.on('pointerdown', function () {
				console.log('change states1')
				this.scene.scene.start('menuState')
			})

		}
		
//function that creates the tower menu
//the input parameter is the tile that was clicked on which caused the function to be called
		this.makeTowerMenu = function(tile){
//if there was a circle surrounding a tower or another tower menu active, remove them
			mapLogic.removePrev(map.circle)
			mapLogic.removePrev(hud.towerMenu)

//create a tower menu object and add it to the HUD
			var towerMenu = new Phaser.GameObjects.Container(hud, 750, 350)
			hud.towerMenu = hud.add.existing(towerMenu)
			
//create a red rectangle that serves as the background of the tower menu
			var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
			red.displayWidth = 100
			red.displayHeight = 500
			towerMenu.add(red, hud)
			
//create a cross that when clicked on removes the tower menu
			var cross = new Phaser.GameObjects.Image(hud, 0, 200, 'cross').setInteractive()
			cross.displayWidth = 100
			cross.displayHeight = 100
			towerMenu.add(cross, hud)

//the interactivity of the cross
			cross.on('pointerdown', function(){
				mapLogic.removePrev(map.circle)
				hud.towerMenu.destroy()
			})
			
//this is to decide if the buy menu or the stats page is to be displayed
//it depends on whether the tile is being occupied by a tower at the moment
//if there is not tower at the tile then the buy menu is displayed
			if(tile.tower == -1 || !tile.tower){
				console.log('there is no tower')
//this is how much money has been spent on the building site, if a tower is bought then this value increases by the cost of the tower bought
				tile.spent = 0
//call a function to create the buy menu
				hudLogic.makeMenuBuy(tile)
			}
			else{
				console.log('there is a tower')
//if there is a tower then the stats of the occupying tower is displayed
				hudLogic.makeMenuStats(tile)
			}
			
			
		}

//function that displays all the towers that could be bought
		this.makeMenuBuy = function(tile){
//iterate through a list of starting towers
			for(var i = 0; i < resources.startTowers.length; i++){
				var tower = eval(resources.startTowers[i])
//create an image object using the information from the starting tower
//for each available tower, the image is below the one before it
				var button = new Phaser.GameObjects.Image(hud, 0, -200 + 100 * i, tower.image).setInteractive()
//links all the data of that tower to the image
				button.tower = tower
//the size of the button
				button.displayWidth = 100
				button.displayHeight = 100
//used to identify that this is a button for buying a tower
				button.name = 'towerButton'
				
//call a function that allows the button to be interacted with
				hudLogic.clickBuy(button, tile, tower)
					
				hud.towerMenu.add(button, hud)				
			}
		}

//function that would dim the buy button in the tower menu if the cost of the tower exceeds the amount of money at the moment
//the button reverts back to normal when there is enough money
		this.updateTint = function(){
			if(hud.towerMenu){
				hud.towerMenu.each(function(button){
					if(button.name == 'towerButton'){
						if(gameStats.money < button.tower.cost){
							button.setTint('0xAA7878')
						}
						else{
							button.clearTint()
						}
					}
				})
			}
		}

//function that allows the buy buttons in the tower menu to be interacted with
//interactions involve hovering the mouse over is and clicking it to buy the tower
//the input parameters are the button in question, the tile the tower menu is for and the tower the button is for
		this.clickBuy = function(button, tile, tower){
			var towerMenu = hud.towerMenu
//this is for when the mouse is over the button		
			hud.input.on('gameobjectmove', function(pointer, gameobject){
				try{
					if(towerMenu.getByName('buyStats')){
						towerMenu.getByName('buyStats').destroy()
					}
//as input does not allow outside varibles to pass to it, the tower parameters passed onto the button is used
					var towerStats = gameobject.tower

					var bullet = eval(towerStats.bulletKey)
					
					var name = 'name: ' + towerStats.id
					var damage = 'damage: ' + bullet.damage
					var range = 'range: ' + towerStats.range
					var speed = 'speed: ' + towerStats.speed
					var cost = 'cost: ' + towerStats.cost
					
//creates a little window to the left of the mouse which displays the stats of the tower
					var buyStats = new Phaser.GameObjects.Container(
						hud,
						pointer.x - towerMenu.x - 100,
						pointer.y - towerMenu.y
					)
//this allows the targeting of this window so it could be removed when the mouse is no longer over the button
					buyStats.name = 'buyStats'
//add the window to the tower menu
					towerMenu.buyStats = towerMenu.add(buyStats, hud)

//create a red rectangle which serves as the background of the window with the stats
					var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
					red.displayWidth = 200
					red.displayHeight = 200
					buyStats.add(red, hud)
					
//the font and typeface of the words to come
					var config = {fontSize:'18px', color:'#000000', fontFamily: 'Arial'}
//display the stats in the little window
					var displayStats = new Phaser.GameObjects.Text(
						hud,
						-50,
						-90,
						name + '\n' + damage+ '\n' + range + '\n' + speed + '\n' + cost,
						config
					)

					buyStats.add(displayStats, hud)
				}
				catch(err){
					null
				}				
			})
//when the mouse is no longer over the button, the stats window is removed
			hud.input.on('pointerout', function(){
				if(towerMenu.getByName('buyStats')){
					towerMenu.getByName('buyStats').destroy()
				}
			})
			
//when the button is clicked on, the amount of money is first checked to make sure there is enough
//if there is enough, the amount of money spent on the building site increases, the previous tower is removed in the case of an upgraded tower, the tower is made and the amount of money decreases by the cost of the tower
//the tower menu is also removed
			button.on('pointerdown', function(){
				if(gameStats.money >= tower.cost){
					tile.spent += tower.cost
					hudLogic.removeTower(tile)
					mapLogic.makeTower(tile, tower, resources.size)
					hud.towerMenu.destroy()
					console.log(tower.id + ' made')
					gameStats.money -= tower.cost
				}
//if there is not enough money
				else{
					console.log('not enough money')
				}
			})
		}
		
				
//this function is to show the stats of the tower in the building site that was clicked on
		this.makeMenuStats = function(tile){
//create a button that when clicked on will sell the tower
			var sell = new Phaser.GameObjects.Image(hud, 0, 100, 'sell').setInteractive()
			sell.displayWidth = 100
			sell.displayHeight = 100

//the interactivity of the sell tower button
			sell.on('pointerdown', function(){
				gameStats.money += Math.floor(tile.spent * 0.7)
				tile.spent = 0
				hudLogic.removeTower(tile)
				console.log('tower removed')
				hud.towerMenu.destroy()
			})
			
			hud.towerMenu.add(sell, hud)
			
//try to find the tower in the tower group using the tower id value of the tile
			var id = tile.tower
			var tower
			
//search the tower group and when there is a match use it to get the tower's stats
			map.towerGroup.getChildren().forEach(function(towerTemp){
				if(towerTemp.id == id){
					tower = towerTemp
				}
			})

//get the stats of the tower
			var bullet = eval(tower.bulletKey)
			
			var name = ('name: ' + tower.name)
			var damage = ('damage: ' + bullet.damage)
			var range = ('range: ' + tower.range)		
			var speed = ('speed: ' + tower.speedMaster)
			
//the font and typeface of the words to come
			var config = {fontSize:'12px', color:'#000000', fontFamily: 'Arial'}
//display the stats of the tower
			var displayStats = new Phaser.GameObjects.Text(
				hud,
				-40,
				-225,
				name + '\n' + damage+ '\n' + range + '\n' + speed,
				config
			)
			hud.towerMenu.add(displayStats, hud)
//see whether there is an upgrade for the tower
			var upgrade = eval(tower.upgradeKey)
//if there is an upgrade, create an upgrade button that works the same as a buy tower button
			if(upgrade){
				var upgradeButton = new Phaser.GameObjects.Image(hud, 0, 0, upgrade.image).setInteractive()
				
				upgradeButton.tower = upgrade
				upgradeButton.displayWidth = 100
				upgradeButton.displayHeight = 100
				upgradeButton.name = 'towerButton'
				
				hudLogic.clickBuy(upgradeButton, tile, upgrade)
				hud.towerMenu.add(upgradeButton, hud)
			}
//when a tower is clicked on, a circle appears around the tower showing its attack range
			mapLogic.clickTower(tower)
		}
		
		
//this the function for removing a tower from a building site
		this.removeTower = function(tile){
//find the tower in question in the tower group and remove it from the list
			map.towerGroup.getChildren().forEach(function(tower){
				if(tower.id == tile.tower){
					mapLogic.removePrev(tower)
				}
			})
//set the id of the tower in the tile to 0 which is read as 'false' in Javascript
			tile.tower = 0
			//if there is a circle showing attack range, remove that too
			mapLogic.removePrev(map.circle)
			

		}

//function for when the speed button is clicked on
		this.changeSpeed = function(){
//uses a switch as the options are discrete
//the speed setting increases by one except for when it is at three in which case it reverts back to one
//these just draw the buttons and change the settings, they are not interactive yet
			switch(gameStats.speedSetting){
				case 1:
					gameStats.speedSetting = 2
					hud.speedButton  = hud.add.image(50, 550, 'two').setInteractive()

					break;
				case 2:
					gameStats.speedSetting = 3
					hud.speedButton  = hud.add.image(50, 550, 'three').setInteractive()
					break;
				case 3:
					gameStats.speedSetting = 1
					hud.speedButton  = hud.add.image(50, 550, 'one').setInteractive()
					break;
					
				default:
					break
			}
//the interactivity of the buttons
			hud.speedButton.on('pointerdown', function(){
				hudLogic.changeSpeed()
				mapLogic.updateSpeed()
			})
		}

//display the stats of the current playthrough
		this.showStats = function(){
//get the stats from the gameStats scene
			var lives = 'lives: ' + gameStats.lives
			var money = 'money: ' + gameStats.money
			var score = 'score: ' + gameStats.score

//remove any previous iterations of the display of these stats so the current version won't overlap with previous ones
			mapLogic.removePrev(hud.gameLives)
			mapLogic.removePrev(hud.gameMoney)
			mapLogic.removePrev(hud.gameScore)

//display the stats
			hud.gameLives = hud.add.text(200, 20, lives, { font: '32px Arial' })
			hud.gameLives.setTint(0x000000);

			hud.gameMoney = hud.add.text(350, 20, money, {font: '32px Arial'})
			hud.gameMoney.setTint(0x000000)

			hud.gameScore = hud.add.text(500, 20, score, {font: '32px Arial'})
			hud.gameScore.setTint(0x000000)

		}
		
//this function displays the timer for when a wave is finished and there is a pause between waves
		this.showTimer = function(){
//remove any previous iterations of the display of these stats so the current version won't overlap with previous ones
			mapLogic.removePrev(hud.timerText)
//check if the timer is active
			if(map.timer){
//if the timer is active, get the amount of time left in seconds and display it
				var timer = map.timer
				var remaining = 'time left: ' + Math.ceil(timer.getRemainingSeconds())
				
				hud.timerText = hud.add.text(200, 50, remaining, {font: '32px Arial'})
				hud.timerText.setTint(0x000000)
			}
		}		
    }
	
	update()
	{	
	}
}

export default HUDLogic