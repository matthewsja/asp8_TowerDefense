import AudioManager, { SFX } from '../audiomanager/audioManager.mjs';

class HUDLogicTower extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('hudLogicTower');
    }
	preload(){
		
	}
	create(){
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var gameStats = this.scene.get('gameStats')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var mapLogicTower = this.scene.get('mapLogicTower')
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var hudLogicTower = this.scene.get('hudLogicTower')
		
//function that creates the tower menu
//takes in as a parameter the tile that was clicked on which caused the function to be called
		this.makeTowerMenu = function(tile){
//if there was a circle surrounding a tower or another tower menu active, remove them
//this prevent multiple copies of these objects
			mapLogic.removePrev(map.circle)
			mapLogic.removePrev(hud.towerMenu)

//create a tower menu object and add it to the HUD
			var towerMenu = new Phaser.GameObjects.Container(hud, 850, 350)
			hud.towerMenu = hud.add.existing(towerMenu)
			
//create a red rectangle that serves as the background of the tower menu
			var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
			red.displayWidth = 100
			red.displayHeight = 500
			towerMenu.add(red, hud)
			
//add a cross image that is interactable
			var cross = new Phaser.GameObjects.Image(hud, 0, 200, 'cross').setInteractive()
			cross.displayWidth = 100
			cross.displayHeight = 100
			towerMenu.add(cross, hud)

//the interactivity of the cross
			cross.on('pointerdown', function(){
//when the cross is clicked on, the tower menu and circle surrounding the tower are removed
				mapLogic.removePrev(map.circle)
				hud.towerMenu.destroy();
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			})
			
//this is used to decide if the buy menu or the stats page is to be displayed
//it depends on whether the tile is being occupied by a tower at the moment
//if there is not tower at the tile then the buy menu is displayed
			if(tile.tower == -1 || !tile.tower){
				console.log('there is no tower')
//this is how much money has been spent on the building site, if a tower is bought then this value increases by the cost of the tower bought
				tile.spent = 0
//call a function to create the buy menu
				hudLogicTower.makeMenuBuy(tile)
			}
			else{
				console.log('there is a tower')
//if there is a tower then the stats of the occupying tower is displayed
				hudLogicTower.makeMenuStats(tile)
			}	
		}

//function that displays all the towers that could be bought
//takes in the tile the that was clicked on
		this.makeMenuBuy = function(tile){
//iterate through a list of starting towers
			for(var i = 0; i < resources.startTowers.length; i++){
//get the data of that tower from the resources scene
				var tower = eval('resources.towers["' + resources.startTowers[i] + '"]')
//create an image object using the image of the the tower
//for each available tower, the image is below the one before it and make it interactable
				var button = new Phaser.GameObjects.Image(hud, 0, -200 + 100 * i, tower.image).setInteractive()
//links all the data of that tower to the image
				button.tower = tower
//restrict the size of the button
				button.displayWidth = 100
				button.displayHeight = 100
//used to identify that this is a button for buying a tower
				button.name = 'towerButton'
				
//call a function that allows the button to be interacted with
				hudLogicTower.clickBuy(button, tile, tower)
//add this button to the tower menu	
				hud.towerMenu.add(button)				
			}
		}

//function that would dim the buy button in the tower menu if the cost of the tower exceeds the amount of money at the moment
//the button reverts back to normal when there is enough money
		this.updateTint = function(){
			if(hud.towerMenu){
				hud.towerMenu.each(function(button){
//find all the tower buttons in the tower menu
					if(button.name == 'towerButton'){
//add the tint if there is not enough money for the tower
						if(gameStats.money < button.tower.cost){
							button.setTint('0xAA7878')
						}
//when there is enough money, the tint is removed
						else{
							button.clearTint()
						}
					}
				})
			}
		}

//function that allows the buy buttons in the tower menu to be interacted with
//interactions involve hovering the mouse over is and clicking it to buy the tower
//takes in as parameters 1)the button in question, 2)the tile the tower menu is for and 3)the tower the button is for
		this.clickBuy = function(button, tile, tower){
			var towerMenu = hud.towerMenu
//this is for when the mouse is over the button		
			hud.input.on('pointerover', function(pointer, gameobject){
//this try statement is to prevent any interactivity when the mouse is not over the buy image
				try{
//in the case that there is a previous version of the 'buyStats', remove it to prevent multiple versions of this object
					if(towerMenu.getByName('buyStats')){
						towerMenu.getByName('buyStats').destroy()
					}
//as input does not allow outside varibles to pass to it, the tower parameters passed onto the button is used
//the reason for the zeroth index is due to the gameobject being of some sort of list data type, not image
					var towerStats = gameobject[0].tower

//extract the data of the bullet
					var bullet = eval(towerStats.bulletKey)
					
//extract the stats from the tower and bullet data
					var name = 'name: ' + towerStats.name
					var damage = 'damage: ' + bullet.damage
					var range = 'range: ' + towerStats.range
					var speed = 'speed: ' + towerStats.speed
					var cost = 'cost: ' + towerStats.cost;
					
//variable that will contain the string to display the tower's stats
					var desc

//make the string to display the tower's stats
//the differenece is whether or not the damage is AOE or not as non AOE towers should not have an AOE range
					if(bullet.damageType == 'AOE'){
						var AOE = 'AOE: ' + bullet.AOE
						desc = name + '\n' + damage+ '\n' + range + '\n' + speed + '\n' + AOE + '\n' + cost
					}
					else {
						desc = name + '\n' + damage+ '\n' + range + '\n' + speed + '\n' + cost
					}

// if this tower has instant Win enabled (Law), display this.
					if (towerStats.instantWin == true)
					{
						desc = name + '\n' + "Instant Win\n" + cost;
					}
					
//creates a little window to the left of the mouse which displays the stats of the tower
					var buyStats = new Phaser.GameObjects.Container(
						hud,
						pointer.x - towerMenu.x - 100,
						pointer.y - towerMenu.y
					)
//this allows the targeting of the little window so it could be removed when the mouse is no longer over the button
					buyStats.name = 'buyStats'
//add the window to the tower menu
					towerMenu.buyStats = towerMenu.add(buyStats, hud)

//create a red rectangle which serves as the background of the window
					var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
					red.displayWidth = 200
					red.displayHeight = 200
					buyStats.add(red, hud)
					
//the font and typeface of the string to be displayed
					var config = {
						fontSize:'18px',
						color:'#000000',
						fontFamily: 'Arial'
					}
//display the stats in the little window
					var displayStats = new Phaser.GameObjects.Text(
						hud,
						-90,
						-90,
						desc,
						config
					)

					buyStats.add(displayStats, hud)
				}
				catch(err){
					err
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
					hudLogicTower.removeTower(tile)
					mapLogicTower.makeTower(tile, tower, resources.mapData['map']['size'])
					hud.towerMenu.destroy()
					console.log(tower.name + ' made')
					gameStats.money -= tower.cost;
					AudioManager.playEffect(SFX.BUTTON_CLICK);
				}
//if there is not enough money, then send a message to the console
				else{
					console.log('not enough money')
				}
			})
		}
		
				
//this function is to show the stats of the tower in the building site that was clicked on
//takes as a parameter the tile that was clicked on
		this.makeMenuStats = function(tile){
//make an image that is interactable
			var sell = new Phaser.GameObjects.Image(hud, 0, 100, 'sell').setInteractive()
			sell.displayWidth = 100
			sell.displayHeight = 100

//the interactivity of this image
//when clicked on, the tower is sold
//this means that the amount of money spent on the building site up till now is refunded, the tower is removed from the building site and the tower menu is removed
			sell.on('pointerdown', function(){
				gameStats.money += Math.floor(tile.spent * 0.7)
				tile.spent = 0
				hudLogicTower.removeTower(tile)
				console.log('tower removed')
				hud.towerMenu.destroy();
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			})
//add the sell button to the tower menu
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

//get the bullet data of the tower
			var bullet = eval(tower.bulletKey)
//get the stats of the tower and add them to strings
			var name = ('name: ' + tower.name)
			var damage = ('damage: ' + bullet.damage)
			var range = ('range: ' + tower.range)		
			var speed = ('speed: ' + tower.speedMaster)

//the font and typeface of the strings to be displayed
			var config = {fontSize:'12px', color:'#000000', fontFamily: 'Arial'}
//display the stats of the tower
//the stats come on top of each other
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
//as of now, towers are restricted to only having one upgrade option so it is given a specific location in the game window
			if(upgrade){
				var upgradeButton = new Phaser.GameObjects.Image(hud, 0, 0, upgrade.image).setInteractive()

				upgradeButton.tower = upgrade
				upgradeButton.displayWidth = 100
				upgradeButton.displayHeight = 100
				upgradeButton.name = 'towerButton'
				
				hudLogicTower.clickBuy(upgradeButton, tile, upgrade)
				hud.towerMenu.add(upgradeButton, hud)
			}
//when a tower is clicked on, a circle appears around the tower showing its attack range
			mapLogicTower.clickTower(tower)
		}
		
		
//this the function for removing a tower from a building site
//this takes in as a parameter the tile the tower is to be removed from
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
	}
}

export default HUDLogicTower