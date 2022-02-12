

//image of the building site when there is not tower on it
import ten from './assets/10.png'

class Map extends Phaser.Scene
{

	constructor ()
    {
        super('map');
		Phaser.Scene.call(this,{key: 'map'})
    }

    preload ()
    {
//images of the path and enemy
		this.load.image('ten', ten)
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


				
//the group that would contain all the enemies
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
		
		this.three = this.add.image(250, 50, 'three').setInteractive()
		this.four = this.add.image(350, 50, 'four').setInteractive()

		this.six = this.add.image(50, 150, 'six').setInteractive()
		this.seven = this.add.image(150, 150, 'seven').setInteractive()
		
		mapLogic.makePath(resources.pathList1)
		

		this.one.on('pointerdown',function(){
			mapLogic.makeEnemy(resources.enemy1)
		})
		
		this.two.on('pointerdown',function(){
			mapLogic.makeEnemy(resources.enemy2)
		})
		
		this.three.on('pointerdown', function(){
			mapLogic.makeWave(resources.waveData[0])	
		})
		this.four.on('pointerdown', function(){
			mapLogic.makeWave(resources.waveData[1])
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
		
		gameStats.startParams(resources.startParam)
    }
	
	update(){
//call these scenes again as they were previously scoped to the 'create' function
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		var resources = this.scene.get('resources')
		
		mapLogic.updateSpeed()

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
	
		mapLogic.waveMake()
		mapLogic.waveSpeed()
		
	}
}

export default Map