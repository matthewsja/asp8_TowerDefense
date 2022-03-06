class MapLogicTower extends Phaser.Scene
{
	constructor ()
	{
//the scene changes to this one when this keyword is used
        super('mapLogicTower');
    }
	create()
	{
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var gameStats = this.scene.get('gameStats')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var mapLogicEnemy = this.scene.get('mapLogicEnemy')
		var mapLogicTower = this.scene.get('mapLogicTower')
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var hudLogicTower = this.scene.get('hudLogicTower')
		
//function for when a building site tile is clicked on
		this.clickSite = function(){
//find the position of the mouse in pixels
			var posPix = map.input.activePointer
//find the position of the mouse in tile units
			var posTile = map.mapping.worldToTileXY(posPix.x, posPix.y)
//target a specific tile that the mouse is over
			var tile = map.mapping.getTileAt(posTile.x, posTile.y)
//this try statement is to prevent any interactivity when the mouse is not over the game window
			try{
//when the mouse is clicked over a building site tile and the settings in the HUD is not active, call the function that makes the tower menu
				if(map.input.manager.activePointer.isDown && tile.index == resources.mapData['map']['site'] && !hud.settings.active){
					hudLogicTower.makeTowerMenu(tile)
				}
			}
			catch(err){
				err
			}
		}
		
//this function is used to create a tower at a specific point
//takes in as parameters 1)the tile to make the tower in, 2)the key of the tower and 3)the size of the tiles
		this.makeTower = function(tile, key, size){			
//get the position of the tile in pixels
			var x = tile.x*size+size/2
			var y = tile.y*size+size/2
//get the image of the tower from the dictionary
			var image = key['image']
			
//make the tower image object
			var tower = new Phaser.Physics.Arcade.Image(map, x, y, image)
//add the tower the to tower group and in turn the map
			map.towerGroup.add(tower, map)
			
//set the size of the tower so it fits perfectly in the tile
			tower.displayWidth = size
			tower.displayHeight = size
			
//set the initial state of the tower so it may attack
			tower.state = 'ready'
//set the name of the tower so it could be read when looking at its stats
			tower.name = key['name']
//set the id of the tower so it may be referenced from the tower group
			tower.id = map.towerID
//set the range of the tower which is how far the tower can detect enemies
			tower.range = key['range']
//set the speed of the tower which is how rapidly it can attack
			tower.speedMaster = key['speed']
//the key of the bullet that the tower fires
			tower.bulletKey = key['bulletKey']
//the parameters of the tower this tower could be upgraded to
			tower.upgradeKey = key['upgradeKey'];

			tower.instantWin = key['instantWin'];
			
//enable physics for the tower so it may detect enemies
			map.physics.world.enable(tower);
			
//alter the physics attributes of the tower so it encompasses a circle with a radius of the tower's range around the tower
//the first parameter is the radius of the circle in pixels, the second and the third parameters are the x and y offset respectively
//Phaser does not draw circles centred at the centre of the object being encompassed so there is a slight offset based on the radius of the circle and the size of the original shape
			tower.setCircle(
				tower.range*size,
				(-tower.range+tower.displayWidth/2),
				(-tower.range+tower.displayHeight/2)
			)

//this attribute is used to space out the time between every bullet it fires
//this is a time object when active
			tower.delay = false
//link the id of the tower to the tile so it may be referenced when needed
			tile.tower = map.towerID
			map.towerID++
		}
				
//function for when the tower is clicked on
//takes in as a parameter the tower that was clicked on
		this.clickTower = function(tower){
//get the size of the tiles
			var size = resources.mapData['map']['size']
//remove any previous iterations of the circle
			mapLogic.removePrev(map.circle)
//add a new circle, this is not yet visible
//the size is dependent on the size of the tiles to keep things fair
			map.circle = map.add.circle(tower.x, tower.y, tower.range*size)
//draw the circle itself
//the parameters are the line thickness and the colour of the line
			map.circle.setStrokeStyle(3, 0x1a65ac);
		}
		
		
//function for searching for an enemy within a tower's range
//takes in as a parameter the enemy being searched
		this.searchEnemy = function(enemy){

//in the event that an enemy is within range of a tower then the function indicating an enemy has been found will be called
			map.towerGroup.getChildren().forEach(
				function(tower){
					map.physics.add.overlap(enemy, tower, mapLogicTower.enemyFound)
			})
		}
		
//function for when an enemy has been found
//takes in as parameters parameters 1)the enemy that was found and 2)the tower that found it
		this.enemyFound = function(enemy, tower){
//when the state of the tower is 'ready', call the function that fires a bullet towards it
			if(tower.state == 'ready'){
				mapLogicTower.makeBullet(enemy, tower)
			}
		}
		
//function for making the bullet
//takes in as parameters 1)the enemy being targeted and 2)the tower that the bullet originated from 
		this.makeBullet = function(enemy, tower){
//get the position of the tower from which the bullet will start from 
			var x = tower.x
			var y = tower.y

//get the dictionary that holds the bullet's parameters
			var  key = eval(tower.bulletKey)
//get the image of the bullet
			var image = key['image']
//create the bullet using the starting position and the image of the bullet
			var bullet = new Phaser.GameObjects.Image(map, x, y, image)

//make the bullet a certain size
			var size = key['size']
			bullet.displayWidth = size[0];
			bullet.displayHeight = size[1];
//speed of the bullet unaffected by the speed the game is being played at
			bullet.speedMaster = key['speed']
//speed of the bullet affected by the speed the game is being played at
			bullet.speed = bullet.speedMaster * gameStats.playSpeed
//different damage parameters of the bullet
			bullet.damageType = key['damageType']
			bullet.damage = key['damage']
			bullet.AOE = key['AOE']
		
//if the type of the bullet is AOE then instead of chasing the enemy, a target spot is created at the current position of the enemy and the bullet head towards the target spot
			if(bullet.damageType == 'AOE'){
//create the target spot
//the parameters are the scene it is in, the x and y position of the enemy at the time and the image to use
//the image is arbitrary as it does not show up
				var target = new Phaser.Physics.Arcade.Image(map, enemy.x, enemy.y, 'destTile')
				map.physics.world.enable(target);
//make the area of the target 0 to avoid reaching the target spot prematurely
				target.displayWidth = 0
				target.displayHeight = 0
//add the target spot to the target group
				map.targetGroup.add(target)
//make the bullet target the target spot
				bullet.target = target
				
			}
			else{
//if the damage type is not AOE
//make the bullet target a specific enemy, it's the one in the input parameter
				bullet.target = enemy
			}

//add the bullet to the group and in turn the map itself
			map.bulletGroup.add(bullet, map)
//change the state of the tower so it won't fire again for the time being
			tower.state = 'firing'
		}
		
//function for regulating the attack speed of the tower
//takes in as a parameter the tower being affected
		this.updateTower = function(tower){
			if (tower.instantWin) {
				var gameRecords = this.scene.get('gameRecords');
				gameRecords.instantWin = true;
				this.scene.start('completeState');
				console.log('finished');
			}
//if the tower has recently fired, then immediately change the state of the tower to that of reloading and start a delay event that when finished will change the state of the tower to being ready to fire again
			if(tower.state == 'firing'){
				tower.state = 'reload'
				tower.delay = map.time.addEvent({delay: 1000/tower.speedMaster, timeScale: gameStats.playSpeed, loop: false})
			}
		}
				
//function for changing the state attribute of a tower so it may fire another bullet
//takes in as an parameter the tower being affected
		this.reloadTower = function(tower){
//by default, the delay attribute of a tower is set to false, so any value other than that will set this off
			if(tower.delay){
//the game reads the amount of time remaining, if it is zero, then delay attribute of the tower tower is set to false and the tower is ready to fire again
				if(tower.delay.getRemainingSeconds() == 0){
					tower.delay = false
					tower.state = 'ready'
				}
			}
		}
		

//function for moving the bullet
//takes in as a parameter, the bullet that is affected
		this.moveBullet = function(bullet){
//the bullet moves to its target at a speed based on the bullet's speed attribute
			map.physics.moveToObject(bullet, bullet.target, bullet.speed)
//call the function when the bullet reaches its target
			map.physics.add.overlap(bullet, bullet.target, mapLogicTower.hitTarget)
		}
		
//function for when the bullet reaches its target
//takes in as parameters 1)the bullet and 2)the target
		this.hitTarget = function(bullet, target){
//detect if the damage type is AOE
			if(bullet.damageType == 'AOE'){
//get the size of the tiles in pixels
				var size = resources.mapData['map']['size']
//change the size of the target spot based on the size of the tiles
				target.displayWidth = size
				target.displayHeight = size
				
//change the target spot's shape to a circle of size according to the AOE parameter and the size of the tiles
				target.setCircle(
					(size*bullet.AOE),
					(-size*bullet.AOE + size/2),
					(-size*bullet.AOE + size/2)
				)
//set the target spot's damage parameter to be the same as the bullet's damage parameter
//this is because the target spot will be doing the damage to any enemies
				target.damage = bullet.damage
				
//check if there are any enemies in the target spot's range
//if any are in range, then they take damage
				map.enemyGroup.getChildren().forEach(function(enemy){
					map.physics.add.overlap(target, enemy, mapLogicTower.damageEnemy)
				})
//set a delay to remove the target spot from the target group
//the more enemies there are alive, the longer the delay
//this is set due to the nature of JavaScript not letting functions finish before running the next line of code
				var timer = map.enemyGroup.getLength()
				setTimeout(function(){target.destroy()},timer*20)
			}
//if the damage type is not AOE then the target enemy takes damage
			else{
				mapLogicTower.damageEnemy(bullet, target)
			}
//remove the bullet from the bullet group
			bullet.destroy()
		}
		
//this function is responsible for damaging the enemy
//takes in as parameters 1)the bullet that will damage the enemy and 2)enemy itself
		this.damageEnemy = function(bullet, enemy){
//remove some HP from the enemy based on the damage of the bullet that hit it
			enemy.HP -= bullet.damage
			
			console.log('enemy hp: ' + enemy.HP)
//if the enemy has 0 hp then the enemy is removed, money increases as a reward and the score is increased by the same amount
			if(enemy.HP <= 0){
				mapLogicEnemy.removeEnemy(enemy)
				gameStats.money += enemy.value
				console.log('money: ' + gameStats.money)
				gameStats.score += enemy.value
			}
		}

//function for when a target enemy is destroyed before a targeting bullet has made contact with it
//takes in as a parameter the affected bullet
		this.updateBullet = function(bullet){
//if the enemy's hp is 0 or it reaches the destination, the bullet is removed from the world
			if((bullet.target.HP <= 0) || (bullet.target.destReached)){
				bullet.destroy()
			}
		}
	}
}

export default MapLogicTower