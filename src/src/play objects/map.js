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

//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		
//the group that would contain all the enemies
		this.enemyGroup = this.add.group()
		

			
//the group that would contain all the towers	
		this.towerGroup = this.add.group()
		
//the group that would contain all the bullets
		this.bulletGroup = this.physics.add.group()
		
//the group that would contain all stationary targets for AOE bullets
		this.targetGroup = this.add.group()
		
//unique id for each tower so they could be identified when needed
//starts at 1 as 0 could be read as 'false'
		this.towerID = 1

//a circle for when a tower is clicked on, the detection range for it is drawn
		this.circle
		
//draw the tileset
//input parameters are the array indicating which tiles go where, the tileset image and a number indicating the size of each tile
		mapLogic.drawTiles(
			resources.mapData['map']['tiles'],
			'tileset',
			resources.mapData['map']['size']
		)
				
//determine the specific path that the enemies would take
//input parameters are the array indicating which tiles go where, the index of the tile that would be the origin, the index of the tiles that would indicate the destination and the idices of the tiles that the enemies could travel on
		mapLogic.makePath(
			resources.mapData['map']['tiles'],
			resources.mapData['map']['origin'],
			resources.mapData['map']['dest'],
			resources.mapData['map']['path'],
			resources.mapData['map']['size']
		)
		
//make the buttons that add enemies
		this.start = this.add.image(150, 650, 'start').setInteractive()
		

//start the game by calling all the waves of enemies one by one
		this.start.on('pointerdown',function(){
			if(!map.origin.started){
				map.start = map.add.image(150, 650, 'rush').setInteractive()
				mapLogic.startGame()
			}
		})
    }
	
	
	update(){
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')

		
//update the speed of various game objects in case the game speed changes
		mapLogic.updateSpeed()

//move the individual bullets or remove them if their target no longer exists
		map.bulletGroup.getChildren().forEach(function(bullet){
			mapLogic.moveBullet(bullet)
			mapLogic.updateBullet(bullet)
		})
					
//call the functions that determine the attack speed of the towers
		map.towerGroup.getChildren().forEach(function(tower){
			mapLogic.updateTower(tower)
			mapLogic.reloadTower(tower)
		})
		
//call the function that searches for any enemies that are in a tower's range
		map.enemyGroup.getChildren().forEach(function(enemy){
			mapLogic.searchEnemy(enemy)
			mapLogic.updateHPBar(enemy)
		})		
	
//the function that checks the state of the origin and creates an enemy if the state is the right one
		mapLogic.makeEnemy(map.origin.enemy)
//the functions that determines how fast the enemies spawn in a wave
		mapLogic.updateWave()
		mapLogic.reloadWave()
		mapLogic.rushWave()
		
//between waves there is a timer that counts down until the next wave start, this checks for when the timer is done
		mapLogic.coolDown()
		
//this function is for when a building site tile is clicked on, it opens up the tower menu in the HUD
		mapLogic.clickSite()
	}
}

export default Map