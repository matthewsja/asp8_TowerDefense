class MapLogic extends Phaser.Scene
{
constructor ()
    {
//the scene changes to this one when this keyword is used
        super('mapLogic');
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
		var mapLogicEnemy = this.scene.get('mapLogicEnemy')
		var gameStats = this.scene.get('gameStats')
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		
		
//Initial Load//
//These functions are used to draw the map and set up the interactivity within it.//

//function for drawing the tileset to the map
//takes in as parameters 1)the array of indices indicating what tile goes where, 2)the tileset image and 3)the size of the tiles
		this.drawTiles = function(tileCoords, tileset, size){
			map.mapping = map.make.tilemap({ data: tileCoords, tileWidth: size, tileHeight: size });
			map.tiles = map.mapping.addTilesetImage(tileset);
			map.layer = map.mapping.createLayer(0, map.tiles, 0, 0);
		}
		
//function for making the path which the enemies will travel on
//takes in as parameters 1)the array of indices showing what tiles are where, 2)the indices of the origin and 3)destination, 4)the array of indices indicating what tiles the enemies could travel on and 5)the size of the tiles in pixels
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

//it has zero height and width as it isn't seen, just allows enemies to overlap with it
			map.dest = map.physics.add.image(destinationCoords[0]*size+size/2, destinationCoords[1]*size+size/2, 'destTile')
			map.dest.displayWidth = 0
			map.dest.displayHeight = 0

//to find the path, the external library easystarjs is used to do an A* search
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
//takes in as parameters 1)the array of indices indicating where different tiles go and 2)the index of the tile to find
		this.findTile = function(tiles, type){
//outer loop, each being a row
			for(var i = 0; i < tiles.length; i++){
//inner loop, each being an element in the row
				for(var j = 0; j < tiles[i].length; j++){
//if the search is successful, return the coordinates of where it was found in tile units
					if(tiles[i][j] == type){
						return([j, i])
					}
				}
			}
//if the search fails, then a message is printed on the console the and state of the game becomes that of the main menu state
			console.log("A required tile was not found.");
			map.scene.start('menuState')
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
			
	
//function for when the start button is clicked on while the origin is cooling down
//the next wave is instantly called when it is clicked on
			map.start.on('pointerdown', function(){
				if(map.origin.coolDown){
					mapLogicEnemy.callNextWave()
				}
			})
		}
		

//function for removing the previous version of an object so there won't be multiple versions of the same object
//takes in as a parameter the object to attempt to remove
		this.removePrev = function(object){
//check if the object exists
			if(object){
//remove the object if it exists
				object.destroy(true)
			}
		}
	}
	update()
	{
	}
}

export default MapLogic