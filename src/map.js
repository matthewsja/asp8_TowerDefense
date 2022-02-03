

import one from './assets/1.png'
import two from './assets/2.png'
import six from './assets/6.png'
import seven from './assets/7.png'

//image of the path that the enemy travels
import pathTile from './assets/path.png'
//image of the enemy
import enemy1 from './assets/enemy1.png'
import enemy2 from './assets/enemy2.png'

//image of where the enemy comes from
import originTile from './assets/origin.png'
//image of where the enemy head towards
import destTile from './assets/destination.png'

//image of the tower
import tower1 from './assets/tower1.png'
import tower2 from './assets/tower2.png'
//image of the bullet
import bullet1 from './assets/bullet1.png'
import bullet2 from './assets/bullet2.png'
//image of the building site when there is not tower on it
import siteTile from './assets/site.png'



class Map extends Phaser.Scene
{

	constructor ()
    {
        super('map');
		Phaser.Scene.call(this,{key: 'map'})
    }

    preload ()
    {

		
//images to add things
		this.load.image('one', one)
		this.load.image('two', two)		
		this.load.image('six', six)
		this.load.image('seven', seven)
		
//images of the path and enemy
		this.load.image('originTile', originTile)
		this.load.image('destTile', destTile)
		this.load.image('pathTile', pathTile)
		this.load.image('enemy1', enemy1)
		this.load.image('enemy2', enemy2)
		


		this.load.image('tower1', tower1)
		this.load.image('tower2', tower2)
		this.load.image('bullet1', bullet1)
		this.load.image('bullet2', bullet2)
		this.load.image('site', siteTile)		


    }
      
    create ()
    {
		var resources = this.scene.get('resources')
//this allows access to all public attributes and functions in the 'gameStats' scene
		var gameStats = this.scene.get('gameStats')
		
//this allows the scope of functions in this scene to work properly as they sometimes reference attributes in the same scene
		var map = this.scene.get('map')
		
//this is where all the functions for the map are stored
		var mapLogic = this.scene.get('mapLogic')
		
		var hudLogic = this.scene.get('hudLogic')

//the curve object that would contain the path
		this.curve = null
		
//the group that would contain all the enemies
//		this.enemyGroup = this.physics.add.group()
		this.enemyGroup = this.add.group()
		

//the group that would contain all the bullets
		this.bulletGroup = this.physics.add.group()
		

//circle for when a tower is clicked on, the detection range for it is drawn
		this.circle
		

//container for the building sites
//is here so the tiled background won't cover the building sites
		this.siteContainer = this.add.container()
		this.siteID = 0
		
//make the buttons that add things
		this.one = this.add.image(50, 50, 'one').setInteractive()
		this.two = this.add.image(150, 50, 'two').setInteractive()
		

		this.six = this.add.image(50, 150, 'six').setInteractive()
		this.seven = this.add.image(150, 150, 'seven').setInteractive()
		
		mapLogic.makePath(resources.pathList1)
		

		this.one.on('pointerdown',function(){
			mapLogic.makeEnemy(resources.enemy1)
		})
		
		this.two.on('pointerdown',function(){
			mapLogic.makeEnemy(resources.enemy2)
		})
		
		
		this.six.on('pointerdown',function(){
			mapLogic.makePath(resources.pathList1)
		})
		
		this.seven.on('pointerdown',function(){
			mapLogic.makePath(resources.pathList2)
		})
		
	
//calls the function to generate each of the building sites
		resources.siteList.forEach(mapLogic.makeSite)
//when a building site is called, a tower is created there
		this.siteContainer.each(mapLogic.clickSite)		
    }
	
	update(){
//call these scenes again as they were previously scoped to the 'create' function
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
				

//call the function that updates the number of enemies spawned
		mapLogic.getNumEnemies()

		map.bulletGroup.getChildren().forEach(function(bullet){
			mapLogic.moveBullet(bullet)
			mapLogic.updateBullet(bullet)
		})
					
//call the function that restricts the attack speed of the towers
		map.siteContainer.each(mapLogic.towerSpeed)
		
//call the function that searches for any enemies that are in a tower's range
		map.enemyGroup.getChildren().forEach(function(enemy){
			mapLogic.searchEnemy(enemy)
			mapLogic.enemyProgress(enemy)
		})

	}
}

export default Map