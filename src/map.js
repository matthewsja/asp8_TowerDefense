//CLICK 7 FIRST TO MAKE A PATH
//DONT CLICK 6 WHEN THERE IS NO PATH


//six adds an enemy
//seven makes the path for the enemy
import six from './assets/6.png'
import seven from './assets/7.png'

//background image repeated
import grassTile from './assets/grass.png';

//image of the path that the enemy travels
import pathTile from './assets/path.png'
//image of the enemy
import enemyTile from './assets/enemy.png'
//image of where the enemy comes from
import originTile from './assets/origin.png'
//image of where the enemy head towards
import destTile from './assets/destination.png'

//image of the tower
import towerTile from './assets/tower.png'
//image of the bullet
import bulletTile from './assets/bullet.png'
//image of the building site when there is not tower on it
import siteTile from './assets/site.png'
//image of the x that when clicked removes the tower from the building site
import xTile from './assets/x.png'


class Map extends Phaser.Scene
{

	constructor ()
    {
        super('map');
		Phaser.Scene.call(this,{key: 'map'})
    }

    preload ()
    {
//background image
        this.load.image('grass', grassTile);
		
//images to add things
		this.load.image('six', six)
		this.load.image('seven', seven)		
		
//images of the path and enemy
		this.load.image('originTile', originTile)
		this.load.image('destTile', destTile)
		this.load.image('pathTile', pathTile)
		this.load.image('enemy', enemyTile)

//images used for the tower, bullet, building site and the x to remove the tower
		this.load.image('tower', towerTile)
		this.load.image('bullet', bulletTile)
		this.load.image('site', siteTile)		
		this.load.image('x', xTile)

    }
      
    create ()
    {
//this means that this won't hide the other active scenes
		this.scene.sendToBack()

//this allows access to all public attributes and functions in the 'gameStats' scene
		var gameStats = this.scene.get('gameStats')
		
//this allows the scope of functions in this scene to work properly as they sometimes reference attributes in the same scene
		var map = this.scene.get('map')
		
//this is where all the functions for the map are stored
		var mapLogic = this.scene.get('mapLogic')
		
		
//the list that would contain coordinates of the path
		this.pathList = []
//the curve object that would contain the path
		this.curve
		
//the group that would contain all the enemies
		this.enemyGroup = this.physics.add.group()
//id for the enemies so each one is unique
		this.enemyID = 0
//the group that would contain all the bullets
		this.bulletGroup = this.physics.add.group()
		
//id for the towers so each one is unique		
		this.towerID = 0
//circle for when a tower is clicked on, the detection range for it is drawn
		this.circle
		
//the list that would contain coordinates of the building sites
		this.siteList = []
		
//make the tiled background
		this.backgroundTiles = this.add.container()	
      	this.tile = this.add.tileSprite(400 , 300, 800, 600, 'grass')
		this.backgroundTiles.add(this.tile);
		
//container for the building sites
//is here so the tiled background won't cover the building sites
		this.siteContainer = map.add.container()
		
//make the buttons that add things
		this.six6 = this.add.image(50, 150, 'six').setInteractive()
		this.seven7 = this.add.image(150, 150, 'seven').setInteractive()
		
//coordinates for the path	
		this.start = [0, 600];
		
		this.pathList.push([0, 500])
		this.pathList.push([0, 400])
		this.pathList.push([100, 400])
		this.pathList.push([100, 500])
		this.pathList.push([200, 500])
		this.pathList.push([200, 400])
		this.pathList.push([200, 300])
		this.pathList.push([300, 300])
		this.pathList.push([400, 300])
		this.pathList.push([500, 300])
		this.pathList.push([600, 300])
		this.pathList.push([700, 300])
		this.pathList.push([800, 300])
		
//makes the 7 button call the function that makes the path
		this.seven7.on('pointerdown',mapLogic.makePath)
		
//make the 6 button call the function that makes an enemy
		this.six6.on('pointerdown',mapLogic.makeEnemy)

//coordinates for the building sites
		this.siteList.push([350, 450])
		this.siteList.push([250, 350])
		this.siteList.push([350, 350])
		
//calls the function to generate each of the building sites
		this.siteList.forEach(mapLogic.makeSite)
//when a building site is called, a tower is created there
		this.siteContainer.each(mapLogic.clickSite)		
    }
	
	update(){
//call these scenes again as they were previously scoped to the 'create' function
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		
//call the function that resets the enemyID when there are no enemies alive
		mapLogic.resetEnemyID()
//call the function that updates the number of enemies spawned
		mapLogic.getNumEnemies()

//call the function that directs the bullets to their respective enemies
		map.bulletGroup.getChildren().forEach(mapLogic.moveBullet)
//call the function that handles when the bullet reaches the enemy or if the enemy no longer exists
		map.bulletGroup.getChildren().forEach(mapLogic.updateBullet)
					
//call the function that restricts the attack speed of the towers
		map.siteContainer.each(mapLogic.towerSpeed)
//call the function that removes a tower when requested
		map.siteContainer.each(mapLogic.clearTower)
		
//call the function that searches for any enemies that are in a tower's range
		map.enemyGroup.getChildren().forEach(searchEnemy)
		
		function searchEnemy(enemy){
			map.siteContainer.each(
				function(siteC){
					var tower = siteC.getByName('tower')
					if(tower != null){
						if(tower.state == 'ready'){
							map.physics.add.overlap(enemy, tower, mapLogic.enemyFound)
						}
					}
				}
			)
		}
		
		
	}
}

export default Map