import AudioManager, { SFX } from '../audiomanager/audioManager.mjs';

class Map extends Phaser.Scene
{

	constructor ()
    {
        super('map');
    }

    preload ()
    {
    }
      
    create ()
    {
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var mapLogicEnemy = this.scene.get('mapLogicEnemy')
		
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
		
//the code is a bit verbose, this shortens it for later use
		var mapData = resources.mapData['map']
//draw the tileset using level specific data
		mapLogic.drawTiles(mapData['tiles'],mapData['tileset'],mapData['size'])
				
//determine the specific path that the enemies would take using level specific data
		mapLogic.makePath(
			mapData['tiles'],
			mapData['origin'],
			mapData['dest'],
			mapData['path'],
			mapData['size']
		)
		
//create an image that is interactable
		this.start = this.add.image(150, 650, 'start').setInteractive()
		
//when the image is clicked on, the game starts proper by starting the first wave
//once the first wave has started, the image becomes different indicating that when clicked on, the game is rushed
		this.start.on('pointerdown',function(){
			if(!map.origin.started){
				map.start = map.add.image(150, 650, 'rush').setInteractive()
				mapLogicEnemy.startGame();
				AudioManager.playEffect(SFX.BUTTON_CLICK);
			}
		})
    }
	
	
	update(){
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var mapLogicEnemy = this.scene.get('mapLogicEnemy')
		var mapLogicTower = this.scene.get('mapLogicTower')
		
//call the function that updates the speed of various game objects in case the game speed changes
		mapLogic.updateSpeed()

//call the functions  move the individual bullets or remove them if their target no longer exists
		map.bulletGroup.getChildren().forEach(function(bullet){
			mapLogicTower.moveBullet(bullet)
			mapLogicTower.updateBullet(bullet)
		})
					
//call the functions that determine the attack speed of the towers
		map.towerGroup.getChildren().forEach(function(tower){
			mapLogicTower.updateTower(tower)
			mapLogicTower.reloadTower(tower)
		})
		
//call the functions that searches for any enemies that are in a tower's range
		map.enemyGroup.getChildren().forEach(function(enemy){
			mapLogicTower.searchEnemy(enemy)
			mapLogicEnemy.updateHPBar(enemy)
		})		
	
//calls the function that checks the state of the origin and creates an enemy if the state is the right one
		mapLogicEnemy.makeEnemy(map.origin.enemy)
//call the functions that determine how fast the enemies spawn in a wave
		mapLogicEnemy.updateWave()
		mapLogicEnemy.reloadWave()
		
		
//call the function that handles the countdown between waves
//this one checks if the countdown has reached zero
		mapLogicEnemy.coolDown()
//this one will call the next next wave when the rush button is clicked on while the countdown is active
		mapLogicEnemy.rushWave()
		
//this function is for when a building site tile is clicked on, it opens up the tower menu in the HUD
		mapLogicTower.clickSite()
	}
}

export default Map