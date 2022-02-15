import ten from '../assets/images/10.png'

class Map extends Phaser.Scene
{

	constructor ()
    {
        super('map');
		Phaser.Scene.call(this,{key: 'map'})
    }

    preload ()
    {
		this.load.image('ten', ten)
    }
      
    create ()
    {

//this allows access to all assets from external files
		var resources = this.scene.get('resources')
//this allows access to all public attributes and functions in the 'gameStats' scene
		var gameStats = this.scene.get('gameStats')
		
//this allows the scope of functions in this scene to work properly as they sometimes reference attributes in the same scene
		var map = this.scene.get('map')
		
//this is where all the functions for the map are stored
		var mapLogic = this.scene.get('mapLogic')
		
//this is where all the functions for the hud are stored
		var hudLogic = this.scene.get('hudLogic')

//the group that would contain all the enemies
		this.enemyGroup = this.add.group()
		
//the group that would contain all the bullets
		this.bulletGroup = this.physics.add.group()
			
//the group that would contain all the towers	
		this.towerGroup = this.add.group()
//unique id for each tower so they could be identified when needed
//starts at 1 as 0 could be read as 'false
		this.towerID = 1

//circle for when a tower is clicked on, the detection range for it is drawn
		this.circle
		
//draw the tileset
//input parameters are the array indicating which tiles go where, the tileset image and a number indicating the size of each tile
		mapLogic.drawTiles(resources.mapData['map']['tiles'], 'tileset', resources.mapData['map']['size'])
				
//determine the specific path that the enemies would take
//input parameters are the array indicating which tiles go where, the index of the tile that would be the origin, the index of the tiles that would indicate the destination and the idices of the tiles that the enemies could travel on
		mapLogic.makePath(resources.mapData['map']['tiles'], resources.mapData['map']['origin'], resources.mapData['map']['dest'], resources.mapData['map']['path'], resources.mapData['map']['size'])
		
//make the buttons that add enemies
		this.one = this.add.image(50, 50, 'one').setInteractive()


//this one calls all the waves of enemies one by one
		this.one.on('pointerdown',function(){
			mapLogic.multipleWaves(resources.mapData['enemyWaves']['waves'])
		})
    }
	
	
	update(){
//call these scenes again as they were previously scoped to the 'create' function
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		var resources = this.scene.get('resources')
		var hud = this.scene.get('hud')
		
//update the speed of various game objects in case the game speed changes
		mapLogic.updateSpeed()

//move the individual bullets or remove them if their target no longer exists
		map.bulletGroup.getChildren().forEach(function(bullet){
			mapLogic.moveBullet(bullet)
			mapLogic.updateBullet(bullet)
		})
					
//call the functions that restrict the attack speed of the towers
		map.towerGroup.getChildren().forEach(function(tower){
			mapLogic.towerSpeed(tower)
			mapLogic.towerReload(tower)
		})
		
//call the function that searches for any enemies that are in a tower's range
		map.enemyGroup.getChildren().forEach(function(enemy){
			mapLogic.searchEnemy(enemy)
		})		
	
//the function that checks the state of the origin and creates an enemy if the state is the right one
		mapLogic.makeEnemy(map.origin.enemy)
//the functions that determines how fast the enemies spawn in a wave
		mapLogic.waveSpeed()
		mapLogic.waveReload()
//between waves there is a timer that counts down until the next wave start, this checks for when the timer is done
		mapLogic.checkProgress()
		
//this function is for when a building site tile is clicked on, it opens up the tower menu in the HUD
		mapLogic.clickSite()
	}
}

export default Map