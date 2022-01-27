//CLICK 7 FIRST TO MAKE A PATH
//DONT CLICK 6 WHEN THERE IS NO PATH

import Enemy from './enemy.js'
import Tower from './tower.js'
import Bullet from './bullet.js'
import Site from './site.js'

//six adds an enemy
//seven makes the path for the enemy
import six from './assets/6.png'
import seven from './assets/7.png'
import eight from './assets/8.png'

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

import towerTile from './assets/tower.png'
import bulletTile from './assets/bullet.png'

var bulletGroup

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
		
		this.load.image('eight', eight)
//images of the path and enemy
		this.load.image('originTile', originTile)
		this.load.image('destTile', destTile)
		this.load.image('pathTile', pathTile)
		this.load.image('enemy', enemyTile)
		
		this.load.image('tower', towerTile)
		this.load.image('bullet', bulletTile)
		

    }
      
    create ()
    {
		this.scene.sendToBack()
		
		var gameStats = this.scene.get('gameStats')
		var map = this.scene.get('map')
		
//ensure that if it fails, nothing bad happens
//ensure that the path path is empty
		try{
			
			this.curve = null;
			this.pathList = []
//			console.log(pathList)

		}
		catch(err){
			console.log(err)
		}
//make the tiled background
		this.backgroundTiles = this.add.container(400, 300)	

      	this.tile = this.add.tileSprite(0 , 0, 800, 600, 'grass')
		this.backgroundTiles.add(this.tile);
		
//make the buttons that add things
		this.six6 = this.add.image(50, 150, 'six').setInteractive()
		this.seven7 = this.add.image(150, 150, 'seven').setInteractive()
		this.eight8 = this.add.image(250, 150, 'eight').setInteractive()
		
		//generate the coordinates for the path	
		var start = [0, 600];
		
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
		
//makes the 7 button do as required
		this.seven7.on('pointerdown', function(){

//set the origin
			this.origin = this.scene.add.image(start[0], start[1], 'originTile')
//ensure that nothing bad happens if it fails
//remove the previous instance of the path
			try{
				destTile.destroy()
				this.curve.destroy()
			}
			catch(err){
				console.log(err)
			}
			finally{
				console.log('path added')
				this.scene.curve = new Phaser.Curves.Path(start[0], start[1]);
			}


//the list of tiles used in the path
			this.tileGroup = this.scene.add.group()
//iterate over coordinates
			for(var i = 0; i < this.scene.pathList.length; i ++){
//adds the coordinates to the curve
				this.scene.curve.lineTo(this.scene.pathList[i][0], this.scene.pathList[i][1])
//if the coordinate is not the last one, make the tile a normal path tile
				if(i < this.scene.pathList.length-1){
					this.tileGroup.create(this.scene.pathList[i][0], this.scene.pathList[i][1], 'pathTile')
				}
//if the coordinate is the last one, make it the destination tile
//enable physics for this tile so it could be interacted with
				else{
					this.scene.dest = this.scene.physics.add.image(this.scene.pathList[i][0], this.scene.pathList[i][1], 'destTile')
				}
			}
		})
		
		
//list of enemies that have physics enabled
		this.enemyGroup = this.physics.add.group()
		
		this.enemyID = 0
		
//make the 6 button do as required
		this.six6.on('pointerdown', function(){
//make a follower at the specific point
			var enemy = new Enemy
			({
				scene: this.scene,
				curve: this.scene.curve,
				x: 0,
				y: 600,
				image: 'enemy'
			})
			enemy.key = this.scene.enemyID
//			enemy.customFunc()
//add the follower to the list of enemies, physics enabled
			this.scene.enemyGroup.add(enemy, this.scene)
			
//state the number of objects in the enemy list
			console.log('number of enemies: ' + this.scene.enemyGroup.getLength())
//make the enemy follow the specific path at a specific speed
			enemy.follow(enemy);
//check if the enemy has reached the destination
//if it has reached, remove the enemy from the list and say that the enemy has been removed
			this.scene.physics.add.overlap(enemy, this.scene.dest, enemyReachDest)
			
			this.scene.enemyID ++
			if(this.scene.enemyGroup.getLength == 0){
				this.scene.enemyID = 0
			}
			
			for (var i = 0; i < this.scene.towerGroup.getLength(); i++){
				this.scene.physics.add.overlap(enemy, this.scene.towerGroup.getChildren()[i], enemyFound)
			}

		})
		
		var scene = this.scene
		
		bulletGroup = this.physics.add.group()
		
		function enemyFound(enemy, tower){

			var bullet = new Bullet
			({
				scene: map,
				x: tower.x,
				y: tower.y,
				image: 'bullet'
			})
			console.log(bullet)
			bulletGroup.add(bullet, map)
			enemy.destroy()
			console.log('number of bullets: ' + bulletGroup.getLength())
		}
		
		function enemyReachDest(enemy, dest){
			enemy.destroy()
			console.log('remove enemy')
			gameStats.lives -= 1;
			console.log('lives: ' + gameStats.lives)
		}
		
		
		this.towerID = 0
		
		this.towerGroup = this.physics.add.group()
		
		this.circle
		
		this.eight8.on('pointerdown', function(){
			var r = 100
			
			var x = Math.floor(Math.random() * (800-200+1)+200)
			var y = Math.floor(Math.random() * (600-200+1)+200)
			
			var tower = new Tower
			({
				scene: this.scene,
				x: x,
				y: y,
				image: 'tower'
			})	
			tower.key = this.scene.towerID
			tower.setInteractive()
			
			tower.on('pointerdown', function () {
				
				try{
					this.scene.circle.destroy()
				}
				catch(err){
					null
				}
				
				this.scene.circle = this.scene.add.circle(x, y, r)
				this.scene.circle.setStrokeStyle(3, 0x1a65ac);
			})
			
			
			this.scene.towerGroup.add(tower, this.scene)
			
			tower.setCircle(100, -50, -50)
			
			
			console.log('number of towers: ' + this.scene.towerGroup.getLength())
			
			this.scene.towerID++
		})
		
		
		
		
//		this.siteList = [50, 250]
//		
//		this.siteGroup = 
//		
//		function makeSites(target){
//			for(var i = 0; i < target.siteList.length(); i++){
//				
//			}
//		}

    }
	
	update(){

	}
}

export default Map