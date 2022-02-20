//these are the classes of the new objects created
import Enemy from './enemy.js'

class MapLogic extends Phaser.Scene
{
constructor ()
    {
//the scene changes to this one when this keyword is used
        super('mapLogic');
		Phaser.Scene.call(this,{key: 'mapLogic'})
    }

    preload ()
    {
    }
	
	create()
	{	
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var gameRecords = this.scene.get('gameRecords')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		
		
//Initial Load//
//These functions are used to draw the map and set up the interactivity within it.//

//function for drawing the tileset to the map
//takes in as parameters the array of indices indicating what tile goes where, the tileset image and the size of the tiles
		this.drawTiles = function(tileCoords, tileset, size){
			map.mapping = map.make.tilemap({ data: tileCoords, tileWidth: size, tileHeight: size });
			map.tiles = map.mapping.addTilesetImage(tileset);
			map.layer = map.mapping.createLayer(0, map.tiles, 0, 0);
		}
		
//function for making the path which the enemies will travel on
//takes in as parameters the array of indices showing what tiles are where, the indices of the origin and destination, the indices of what tiles the enemies could travel on the the size of the tiles
		this.makePath = function(
		tiles,
		origin,
		destination,
		pathTiles,
		size
		){
//find the coordinates in tiles units the origin and destination tiles
			var originCoords = mapLogic.findTile(tiles, origin)
			var destinationCoords = mapLogic.findTile(tiles, destination)


//remove the previous instance of the origin and destination tile
			mapLogic.removePrev(map.origin)
			mapLogic.removePrev(map.dest)

//create a zone object which will have many parameters controlling the spawning process
//does not appear and its position is not relavent
			map.origin = map.add.zone(map, 0, 0)
//the state is used to indicate whether spawning could be done at the moment
			map.origin.state = null
//the number of enemies to spawn for the current wave
			map.origin.quant = 0
//the number of enemies spawned for the current wave so far
			map.origin.waveCounter = 0
//is used for timing between spawns for a wave
//is a timer object when active
			map.origin.delay = false
			map.origin.started = false
//the list of coordinates in pixels that the enemies will travel on
//the parameters are the coordinates in pixels of where the enemies first appear
			map.path = new Phaser.Curves.Path(originCoords[0]*size+size/2, originCoords[1]*size+size/2)

//create a physics image object which when enemies go over, a life is lost and the enemy is removed
//the parameters are its coordinates in pixels
//it has zero height and width as it isn't seen, just allows enemies to overlap with it
			map.dest = map.physics.add.image(
				destinationCoords[0]*size+size/2, 
				destinationCoords[1]*size+size/2, 
				'destTile'
			)
			map.dest.displayWidth = 0
			map.dest.displayHeight = 0

//to find the path, an external library is used to do an A* search
//the code is from https://www.npmjs.com/package/easystarjs
			var easystarjs = require('easystarjs');
			var easystar = new easystarjs.js();
			easystar.setGrid(tiles);
			easystar.setAcceptableTiles(pathTiles);
			easystar.findPath(originCoords[0], originCoords[1], destinationCoords[0], destinationCoords[1], function( path ) {
				if (path === null) {
					console.log("Path was not found.");
					map.scene.start('menuState')
				} else {
					for(var i = 0; i < path.length; i++){
						map.path.lineTo(path[i].x*size+size/2, path[i].y*size+size/2)
					}
				}
			});
			easystar.setIterationsPerCalculation(1000);
			easystar.calculate();
		}
		
//function used to find a specific tile in a tile array
//is just a simple linear search in a nested fashion
		this.findTile = function(tiles, type){
//outer loop
			for(var i = 0; i < tiles.length; i++){
//inner loop
				for(var j = 0; j < tiles[i].length; j++){
//if the search is successful, return the coordinates of where it was found in tile units
					if(tiles[i][j] == type){
						return([j, i])
					}
				}
			}
		}
		
//Waves of Enemies//
//These functions are responsible for making and regulating the waves of enemies.//
		
//function that makes the enemy object
		this.makeEnemy = function(key){
			var origin = map.origin
//check if the origin is ready to make another enemy
			if(origin.state == 'creating'){
				
//create a new enemy object using the value in the 'image' of key
				var enemy = new Enemy({
					scene: map,
					curve: map.path,
					x: 0,
					y: 0,
					image: key['image']
				})

//give it some attributes for when it is moving and being attacked
//how big the enemy is in pixels in height and width
				enemy.size = key['size']
				enemy.displayWidth = enemy.size[0]
				enemy.displayHeight = enemy.size[1]
//how far the enemy has to travel, helps ensure that the enemy travels at the same speed no matter how far it needs to travel
				enemy.pathLength = map.path.getLength()
//speed of the enemy
//this value is not impacted by how fast the game is being played at
				enemy.speedMaster = key['speed']
//this value depends on the how fast the game is being played at
				enemy.speed = enemy.speedMaster * gameStats.playSpeed
//HP of the enemy 
//HP of the enemy at the start
				enemy.maxHP = key['hp']
//current HP of the enemy, changes if it is attacked
				enemy.HP = enemy.maxHP;
//amount of money rewarded when the enemy is defeated
				
				enemy.HPPortion = enemy.HP/enemy.maxHP
				
				enemy.maxHPBar = map.add.graphics()
				enemy.maxHPBar.x = enemy.x - enemy.size[0]/2
				enemy.maxHPBar.y = enemy.y - enemy.size[1]/2 - 10
				enemy.maxHPBar.fillStyle(0xe74c3c)
				enemy.maxHPBar.fillRect(enemy.maxHPBar.x, enemy.maxHPBar.y, enemy.size[0], 20)
				
				enemy.HPBar = map.add.graphics()
				enemy.HPBar.x = enemy.x - enemy.size[0]/2
				enemy.HPBar.y = enemy.y - enemy.size[1]/2 - 10
				enemy.HPBar.fillStyle(0x2ecc71)
				enemy.HPBar.fillRect(enemy.HPBar.x, enemy.HPBar.y, enemy.size[0], 20)
				enemy.HPBar.scaleX = enemy.HPPortion
				
				enemy.value = key['value']

//add the follower to the list of enemies
				map.enemyGroup.add(enemy, map)

//state the number of objects in the enemy list
				console.log('number of enemies: ' + map.enemyGroup.getLength())
//enable physics for the enemy so it can react when detected, attacked or reach the destination
				map.physics.world.enable(enemy);

//make the enemy follow the specific path at a specific speed
				enemy.follow(enemy)

//ensure that the speed the enemy travels at the start is determined by how fast the game is being played at
				enemy.pathTween.timeScale = enemy.speed

//check if the enemy has reached the destination
//if it has reached it, call the function to handle such an event
				map.physics.add.overlap(enemy, map.dest, mapLogic.enemyReachDest)
				
				
				
//if an enemy is somehow buggy, this function will remove the enemy one minute after it has spawned
				enemy.lifeTime = map.time.delayedCall(60000, mapLogic.debugEnemy, [enemy], map)
//change the state of the enemy so it won't make another enemy yet
				origin.state = 'created'
//increase the count of the number of enemies made for the current wave
				origin.created++
			}
		}
		
		this.removeEnemy = function(enemy){
			enemy.maxHPBar.destroy()
			enemy.HPBar.destroy()
			enemy.destroy()
		}
		
//remove the enemy one minute after it has spawned in case it is buggy
		this.debugEnemy = function(enemy){
			mapLogic.removeEnemy(enemy)
			console.log('buggy enemy')
		}

		this.updateHPBar = function(enemy){
			enemy.maxHPBar.x = enemy.x
			enemy.maxHPBar.y = enemy.y - 20

			enemy.HPPortion = enemy.HP/enemy.maxHP
			enemy.HPBar.scaleX = enemy.HPPortion

			enemy.HPBar.x = enemy.x - enemy.size[0]*(1-enemy.HPPortion)/2
			enemy.HPBar.y = enemy.y - 20
		}
		
		
//function for initiating the first wave
		this.startGame = function(){
			var waveData = resources.mapData['enemyWaves']['waves']
			map.origin.started = true
//determine the number of waves there are
			map.origin.waveMax = waveData.length
//call the function to change the parameters of the origin
//the values to change to are based on the value of the origin's waveCounter and the input wave data
			mapLogic.makeWave(waveData[map.origin.waveCounter])
		}
		
		this.rushWave = function(){
			map.start.on('pointerdown', function(){
				if(map.origin.coolDown){
					mapLogic.callNextWave()
				}
			})
		}
		
		
//function for changing the parameters of the origin so it is ready for another wave
		this.makeWave = function(waveData){
//get the relavent data from the input dictionary
			var enemy = eval(waveData['enemy'])
			var rate = waveData['rate']
			var quant = waveData['quant']
			
			var origin = map.origin
			
//change the values of origin based on relavent data from the input dictionary
			origin.enemy = enemy
			origin.speedMaster = rate
			origin.quant = quant
			origin.created = 0
//this allows the origin to start making enemies again
			origin.state = 'creating'
		}
		
//function for determining the speed the enemies are made
//also stops making enemies when enough have been made
		this.updateWave = function(){
			var origin = map.origin
//if there are still more enemies to make for the current wave
			if(origin.created < origin.quant){
				if(origin.state == 'created'){
//temporarily change the state so this if statement won't be called until the next enemy is made
					origin.state = 'rest'
//an event delayed by an amount of time determined by the speed at which the enemies are made
					origin.delay = map.time.addEvent({delay: 1000/origin.speedMaster, timeScale: gameStats.playSpeed, loop: false})
				}
			}
//when the number of enemies made is at or above the maximum number of enemies for the wave, change the state so no more enemies are made
			if(origin.created >= origin.quant && origin.state != 'coolDown'){
				origin.state = 'finished'
			}
//when the state is such that no more enemies are made and there are no enemies alive, start the countdown for the next wave
			if((origin.state == 'finished') && (map.enemyGroup.getLength() == 0)){
				origin.state = 'coolDown'
				map.origin.coolDown = map.time.addEvent({delay: resources.mapData['enemyWaves']['wavePause'] * 1000, timeScale: gameStats.playSpeed, loop: false})
			}
		}

//function for changing the state of origin so more enemies could be made
		this.reloadWave = function(){
			var origin = map.origin
			if(origin.delay){
//check if the timer has finished counting down so the state of origin could be changed
				if(origin.delay.getRemainingSeconds() == 0){
					origin.delay = false
//at this state, more enemies could be made
					origin.state = 'creating'
				}
			}
		}

//function for seeing if the origin is ready for another wave and if it is, call a function to change the origin parameters to fit this state
//also determines if the winning conditions have been met in which case the game scene will change to the game complete scene
		this.coolDown = function(){
//this is the countdown for between waves
			if(map.origin.coolDown){
//check if this is the last wave by temporarily increasing the wave counter by 1 and checking if the result is at or over the maximum number of waves
				if(map.origin.waveCounter+1 >= map.origin.waveMax){
//if it is the last wave and there are no more enemies, then save the score, maybe update the top score and save the number of lives to the gameRecords scene, then change the game to the complete scene
					gameRecords.score = gameStats.score
					gameRecords.updateTopScore()
					gameRecords.lives = gameStats.lives
					this.scene.start('completeState')
					console.log('finished')
				}
				else{
					var progress = map.origin.coolDown.getRemainingSeconds()
//something only happens when the countdown is finished
					if(progress == 0){
						mapLogic.callNextWave()
					}
				}
			}
		}
		
//function for calling the next wave
		this.callNextWave = function(){
//stop the cooldown timer
			map.origin.coolDown = false
//increase the waveCounter value so the next wave could be called
			map.origin.waveCounter++
			console.log('wave: ' + map.origin.waveCounter)
//call the next wave
			mapLogic.makeWave(resources.mapData['enemyWaves']['waves'][map.origin.waveCounter])
		}
		
		
//function for when an enemy reaches the destination
		this.enemyReachDest = function(enemy, dest){
//this is to indicate that the enemy has reached the destination
//any bullets targeting it will be removed when it happens
			enemy.destReached = true;
//remove the enemy from the enemy group
			mapLogic.removeEnemy(enemy)
//decrease the number of lives by 1
			gameStats.lives -= 1;
			console.log('lives: ' + gameStats.lives)
		}
		
//function for when a building site tile is clicked on
		this.clickSite = function(){
//find the position of the mouse in pixels
			var mouse = map.input.activePointer
//find the position of the mouse in tile units
			var point = map.mapping.worldToTileXY(mouse.x, mouse.y)
//target a specific tile that the mouse is over
			var tile = map.mapping.getTileAt(point.x, point.y)
//occur when the mouse is clicked on
			try{
				if(map.input.manager.activePointer.isDown){
//only do something if the tile being clicked on is a site tile and the settings of the HUD is no active
					if(tile.index == resources.mapData['map']['site'] && !hud.settings.active){
//open the tower menu in the HUD
						hudLogic.makeTowerMenu(tile)
					}
				}
			}
			catch(err){
				null
			}
		}
			
//Towers and Bullets//
//These functions are responsible for the towers and any bullets that they fire.//
		
		
//this function is used to create a tower at a specific point
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
			
			tower.displayWidth = size
			tower.displayHeight = size
			
//set the state of the tower so it may attack
			tower.state = 'ready'
			tower.name = key['name']
//set the id of the tower so it may be referenced from the group
			tower.id = map.towerID
//set the range of the tower which is how far the tower can detect enemies
			tower.range = key['range']
//set the speed of the tower which is how rapidly it can shoot
			tower.speedMaster = key['speed']
//the parameters of the bullet that the tower shoots
			tower.bulletKey = key['bulletKey']
//the parameters of the tower this tower could be upgraded to
			tower.upgradeKey = key['upgradeKey']
			
//enable physics for the tower so it may detect enemies
			map.physics.world.enable(tower);
//alter the physics parameters of the tower so it encompasses a circle of tower.range radius around the tower
//the first parameter is the radius of the circle, the second the third parameters are the x and y offset respectively
//Phaser does not draw circles centred at the centre of the object being encompassed so there is a slight offset based on the radius of the circle and the size of the original shape
			tower.setCircle(
				tower.range,
				(-tower.range+tower.displayWidth/2),
				(-tower.range+tower.displayHeight/2)
			)

//this parameter is used to space out the time between every bullet it fires
//is a time object when active
			tower.delay = false
//link the id of the tower to the tile so it may be referenced when needed
			tile.tower = map.towerID
			map.towerID++
		}
				
//function for when the tower is clicked on
		this.clickTower = function(tower){
//remove any previous iteration of circle
			mapLogic.removePrev(map.circle)
//add a new circle
			map.circle = map.add.circle(tower.x, tower.y, tower.range)
//draw the circle
//the parameters are the line thickness and the colour of the line
			map.circle.setStrokeStyle(3, 0x1a65ac);
		}
		
		
//function for searching for an enemy within a tower's range
		this.searchEnemy = function(enemy){

//in the event that an enemy is within range of a tower then the function indicating an enemy has been found will be called
			map.towerGroup.getChildren().forEach(
				function(tower){
					map.physics.add.overlap(enemy, tower, mapLogic.enemyFound)
			})
		}
		
//function for when an enemy has been found
		this.enemyFound = function(enemy, tower){
//only do this if the state of the tower is 'ready'
			if(tower.state == 'ready'){
				mapLogic.makeBullet(enemy, tower)
			}
		}
		
//function for making the bullet
		this.makeBullet = function(enemy, tower){
//get the position of the tower which the bullet will start from 
			var x = tower.x
			var y = tower.y

//get the dictionary that holds the bullets parameters
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
		
//if the type of the bullet is AOE then instead of chasing the enemy, a target spot is created and the bullet head towards the target spot
			if(bullet.damageType == 'AOE'){
//create the target spot
//the parameters are the scene it is in, the x and y position of the enemy at the time and the image to use
//the image is arbitrary as it does not show up
				var target = new Phaser.Physics.Arcade.Image(map, enemy.x, enemy.y, 'ten')
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
//make the bullet target a specific enemy, it's the one in the input parameter
				bullet.target = enemy
			}

//add the bullet to the group and in turn the map itself
			map.bulletGroup.add(bullet, map)
//change the state of the tower so it won't fire again for the time being
			tower.state = 'firing'
		}
		
//function for regulating the attack speed of the tower
		this.updateTower = function(tower){
// call the function to make it 'ready'
			if(tower.state == 'firing'){
				tower.state = 'reload'
				tower.delay = map.time.addEvent({delay: 1000/tower.speedMaster, timeScale: gameStats.playSpeed, loop: false})
			}
		}
				
//function for changing the state parameter of a tower so it may fire another bullet
		this.reloadTower = function(tower){
			if(tower.delay){
//when the timer in the tower has been reset, the tower is ready to fire
				if(tower.delay.getRemainingSeconds() == 0){
					tower.delay = false
					tower.state = 'ready'
				}
			}
		}
		

//function for moving the bullet
		this.moveBullet = function(bullet){
//the bullet moves to its target at a speed based on the bullet's speed attribute
			map.physics.moveToObject(bullet, bullet.target, bullet.speed)
//call the function when the bullet reaches its target
			map.physics.add.overlap(bullet, bullet.target, mapLogic.hitTarget)
		}
		
//function for when the bullet reaches its target
		this.hitTarget = function(bullet, target){
//detect if the bullet type is AOE
			if(bullet.damageType == 'AOE'){
//get the size of the tiles in pixels
				var size = resources.mapData['map']['size']
//change the size of the target spot to the size of the tiles
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
					map.physics.add.overlap(target, enemy, mapLogic.damageEnemy)
				})
//set a delay to remove the target spot from the target group
//the more enemies there are alive, the longer the delay
//this is set due to the nature of JavaScript not letting functions finish before running the next line of code
				var timer = map.enemyGroup.getLength()
				setTimeout(function(){target.destroy()},timer*20)
			}
//if the bullet type is not AOE then the target enemy takes damage
			else{
				mapLogic.damageEnemy(bullet, target)
			}
//remove the bullet from the bullet group
			bullet.destroy()
		}
		
//this function is responsible for damaging the enemy
		this.damageEnemy = function(bullet, enemy){
//remove some HP from the enemy based on the damage of the bullet that hit it
			enemy.HP -= bullet.damage
			
			console.log('enemy hp: ' + enemy.HP)
//if the enemy has 0 hp then money increases
			if(enemy.HP <= 0){
				mapLogic.removeEnemy(enemy)
				gameStats.money += enemy.value
				console.log('money: ' + gameStats.money)
				gameStats.score += enemy.value
			}
		}

//function for when the enemy is destroyed
		this.updateBullet = function(bullet){
//if the enemy's hp is 0 or it reaches the destination, the bullet is removed from the world
			if((bullet.target.HP <= 0) || (bullet.target.destReached)){
				bullet.destroy()
			}
		}
		
//General Functions//
//These functions belong to no specific category but are usful in their own ways.//
		
//function for changing the movement speed of the current enemies and bullets as well as the reload speed of waves and towers and the cooldown time of of the origin during play
		this.updateSpeed = function(){
//update the movement speed of bullets
			map.bulletGroup.getChildren().forEach(function(bullet){
				bullet.speed = bullet.speedMaster * gameStats.playSpeed
			})
//update the movement speed of enemies
			map.enemyGroup.getChildren().forEach(function(enemy){
				enemy.speed = enemy.speedMaster * gameStats.playSpeed
				enemy.pathTween.timeScale = enemy.speed
				enemy.lifeTime.timeScale = gameStats.playSpeed

				
			})
			
//update the cooldown speed of the origin
			if(map.origin.coolDown){
				map.origin.coolDown.timeScale = gameStats.playSpeed
			}

//update the reload speed of the wave
			if(map.origin.delay){
				map.origin.delay.timeScale = gameStats.playSpeed
			}
			
//update the reload speed of the towers
			map.towerGroup.getChildren().forEach(function(tower){
				if(tower.delay){
					tower.delay.timeScale = gameStats.playSpeed
				}									 
		 	})
			
	
//when the start button is clicked on while the origin is cooling down, the next wave is instantly called
			map.start.on('pointerdown', function(){
				if(map.origin.coolDown){
					mapLogic.callNextWave()
				}
			})
		}
		

		
//this removes the previous version of an object so there won't be multiple versions of the same object
		this.removePrev = function(object){
//check if the object exists
			if(object){
//remove all references to it
				object.destroy(true)
			}
		}
		
	}
	update()
	{
	}
}

export default MapLogic