//these are the classes of the new objects created
import Enemy from './map objects/enemy.js'

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
		var resources = this.scene.get('resources')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		
//function for drawing the tileset to the map
//takes in as parameters the array of indices indicating what tile goes where, the tileset image and the size of the tiles
		this.drawTiles = function(tileCoords, tileset, size){
			map.mapping = map.make.tilemap({ data: tileCoords, tileWidth: size, tileHeight: size });
			map.tiles = map.mapping.addTilesetImage(tileset);
			map.layer = map.mapping.createLayer(0, map.tiles, 0, 0);
		}
		
		
		
//function for making the path which the enemies will travel on
//takes in as parameters the array of indices indicatin what tiles are where, the indices of the origin and destination, the indices of what tiles the enemies could travel on the the size of the tiles
		this.makePath = function(tiles, origin, destination, pathTiles, size){
//find the coordinates in tiles units the origin and destination tiles
			var originCoords = mapLogic.findTile(tiles, origin)
			var destinationCoords = mapLogic.findTile(tiles, destination)


//remove the previous instance of the origin and destination tile
			mapLogic.removePrev(map.origin)
			mapLogic.removePrev(map.dest)

//create a zone object which will have many parameters different parameters controlling the spawning process
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
			map.origin.delay = true

//the list of coordinates in pixels that the enemies will travel on
//the parameters are the coordinates of where the enemies first appear
			map.path = new Phaser.Curves.Path(originCoords[0]*size+size/2, originCoords[1]*size+size/2)

//create a physics image object which when enemies go over, a life is lost and the enemy is removed
//the parameters are its coordinates in pixels
//it has zero height and width as it isn't seen, just allows enemies to overlap with it
			map.dest = map.physics.add.image(destinationCoords[0]*size+size/2, destinationCoords[1]*size+size/2, 'destTile')
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
			console.log('path not found')
		}
		
		
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
//how far the enemy has to travel, helps ensure that the enemy travels at the same speed no matter how far it need to travel
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
				enemy.value = key['value']


//add the follower to the list of enemies
				map.enemyGroup.add(enemy, map)

//state the number of objects in the enemy list
				console.log('number of enemies: ' + map.enemyGroup.getLength())

				map.physics.world.enable(enemy);

//make the enemy follow the specific path at a specific speed
				enemy.follow(enemy)

//ensure that the speed the enemy travels at the start is determined by how fast the game is being played at
				enemy.pathTween.timeScale = enemy.speed

//check if the enemy has reached the destination
//if it has reached, call the function to handle such an event
				map.physics.add.overlap(enemy, map.dest, mapLogic.enemyReachDest)

//if an enemy is somehow buggy, this function will remove the enemy one minute after it has spawned
				map.time.delayedCall(60000, mapLogic.debugEnemy, [enemy], map)
//change the state of the enemy so it won't make another enemy yet
				origin.state = 'created'
//increase the count of the number of enemies made for the current wave
				origin.created++
			}
		}
		
//remove the enemy one minute after it has spawned
		this.debugEnemy = function(enemy){
			console.log('buggy enemy')
			enemy.destroy()
		}



//function for searching for an enemy within a tower's range
		this.searchEnemy = function(enemy){

//in the event that it is within range of a tower then the function indicating an enemy has been found will be called
			map.towerGroup.getChildren().forEach(
				function(tower){
					map.physics.add.overlap(enemy, tower, mapLogic.enemyFound)
			})
		}
		
//function for when an enemy reaches the destination
		this.enemyReachDest = function(enemy, dest){
//this is to indicate that the enemy has reached the destination
//any bullets targeting it will be removed when it happens
			enemy.destReached = true;
//remove the enemy from the enemy group
			enemy.destroy()
//decrease the number of lives by 1
			gameStats.lives -= 1;
			console.log('lives: ' + gameStats.lives)
		}
		
//function for when an enemy has been found
		this.enemyFound = function(enemy, tower){
//only do this if the state of the tower is 'ready'
			if(tower.state == 'ready'){
				mapLogic.makeBullet(enemy, tower)
			}
		}
		
//function for making the bullet that will target a specific enemy
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
			
//make the bullet target a specific enemy, it's the one in the input parameter
			bullet.target = enemy
//add the bullet to the group and in turn the map itself
			map.bulletGroup.add(bullet, map)
//change the state of the tower so it won't fire again for the time being
			tower.state = 'firing'
			
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
			if(map.input.manager.activePointer.isDown){
//only do something if the tile being clicked on is a site tile and the settings of the HUD is no active
				if(tile.index == resources.site && !hud.settings.active){
//open the tower menu in the HUD
					hudLogic.makeTowerMenu(tile)
				}
			}
		}
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
			
//set the state of the tower so it may attack
			tower.state = 'ready'
			tower.name = key['id']
//set the id of the tower so it may be referenced from the group
			tower.id = map.towerID
//set the of the tower which is how far the tower can detect enemies
			tower.range = key['range']
//the speed of the tower
			tower.speedMaster = key['speed']
//the parameters of the bullet that the tower shoots
			tower.bulletKey = key['bulletKey']
//the parameters of the tower this tower could be upgraded to
			tower.upgradeKey = key['upgradeKey']

//enable physics for the tower so it may detect enemies
			map.physics.world.enable(tower);
//alter the physics parameters of the tower so it makes a circle of tower.range radius around the tower
			tower.setCircle(tower.range, (-tower.range+tower.displayWidth/2), (-tower.range+tower.displayHeight/2))

//this parameter is used to space out the time between every bullet it fires
//is a time object when active
			tower.delay = true
//the id of the tower so it may be referenced when needed
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
			map.circle.setStrokeStyle(3, 0x1a65ac);
		}
		
		
//function for moving the bullet
		this.moveBullet = function(bullet){
//the bullet moves to its target at this speed
			map.physics.moveToObject(bullet, bullet.target, bullet.speed)
//call the function when the bullet reaches its target
			map.physics.add.overlap(bullet, bullet.target, mapLogic.hitEnemy)
		}
		
//function for when the bullet reaches its target
		this.hitEnemy = function(bullet, enemy){

			enemy.HP -= bullet.damage
//the bullet is removed from the world
			bullet.destroy()
			console.log('enemy hp: ' + enemy.HP)
//if the enemy has 0 hp then money increases
			if(enemy.HP <= 0){
				enemy.destroy()
				gameStats.money += enemy.value
				console.log('money: ' + gameStats.money)
				gameStats.score += enemy.value
			}
		}

//function for when the enemy is destroyed
		this.updateBullet = function(bullet){
//if the enemy's hp is 0 or it reaches the destination, the bullet is removed from the world
			if((bullet.target.HP <= 0) || (bullet.target.destReached)){
				bullet.target.destroyEnemy(bullet.target)
				bullet.destroy()
			}
		}
		
//function for limiting the attack speed of the tower
		this.towerSpeed = function(tower){
// call the function to make it 'ready'
			if(tower.state == 'firing'){
				tower.state = 'reload'
				tower.delay = map.time.addEvent({delay: 1000/tower.speedMaster, timeScale: gameStats.playSpeed, loop: false})

			}
		}
				
//function for changing the state parameter of a tower so it may fire another bullet
		this.towerReload = function(tower){
			if(tower.delay != true){
//when the timer in the tower has been reset, the tower is ready to fire
				if(tower.delay.getRemainingSeconds() == 0){
					tower.delay = true
					tower.state = 'ready'
				}
			}
		}

//this removes the previous version of an object so there won't be multiple versions of the same object
		this.removePrev = function(object){
//check if the object exists
			if(object){
//remove all references to it
				object.destroy(true)
			}
		}

//function for changing the movement speed of the current enemies and bullets based on the current gameplay speed
		this.updateSpeed = function(){
//update the speed of the bullets
			map.bulletGroup.getChildren().forEach(function(bullet){
				bullet.speed = bullet.speedMaster * gameStats.playSpeed
			})
//update the speed of the enemies
			map.enemyGroup.getChildren().forEach(function(enemy){
				enemy.speed = enemy.speedMaster * gameStats.playSpeed
				enemy.pathTween.timeScale = enemy.speed
			})
		}
		
//function to determine the speed the enemies are made
//also stops making enemies when enough have been made
		this.waveSpeed = function(){
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
				map.timer = map.time.addEvent({delay: resources.wavePause * 1000, timeScale: gameStats.playSpeed, loop: false})
			}
		}

//function for changing the state of origin so more enemies could be made
		this.waveReload = function(){
			var origin = map.origin
			if(origin.delay != true){
//check if the timer has finished counting down so the state of origin could be changed
				if(origin.delay.getRemainingSeconds() == 0){
					origin.delay = true
//at this state, more enemies could be made
					origin.state = 'creating'
				}
			}
		}

//function for changing the parameters of origin so it is ready for another wave
		this.makeWave = function(data){
//get the relavent data from the input array
			var enemy = eval(data[0])
			var rate = data[1]
			var quant = data[2]
			
			var origin = map.origin
			
//change the values of origin
			origin.enemy = enemy
			origin.speedMaster = rate
			origin.quant = quant
			origin.created = 0
			origin.state = 'creating'
			
		}
		
//function for handling multiple waves, takes in the nested array of wave data
		this.multipleWaves = function(waveData){
//determine the number of waves there are
			map.origin.waveMax = waveData.length
//call the function to change the parameters of the origin
//the values to change to are based on the value of the origin's waveCounter and the input wave data
			mapLogic.makeWave(waveData[map.origin.waveCounter])
		}
		
//function for seeing if the origin is ready for another wave and if it is call a function to change the origin parameters to fit this state
		this.checkProgress = function(){
//this is the countdown for between waves
			if(map.timer){
				var progress = map.timer.getRemainingSeconds()
//something only happens when the countdown is finished
				if(progress == 0){
					map.timer = false
//increase the waveCounter value
					map.origin.waveCounter++
					console.log(map.origin.waveCounter)
//check if there are any more waves
//if there are no more waves, then the game is complete
					if(map.origin.waveCounter >= map.origin.waveMax){
						console.log('finished')
					}
//if there are more wave, then start the next wave by calling the function that changes some value of origin
					else{
						mapLogic.multipleWaves(resources.waveData)
					}
				}
			}
		}
	}
	update()
	{
	}
}

export default MapLogic
	
	
