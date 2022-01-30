//these are the classes of the new objects created
import Enemy from './map objects/enemy.js'
import Tower from './map objects/tower.js'
import Bullet from './map objects/bullet.js'
import Site from './map objects/site.js'
import SiteC from './map objects/siteC.js'


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
      
    create ()
    {
		var map = this.scene.get('map')
    }
	
	update()
	{	
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		
//function for making the path
		this.makePath = function(){
//set the origin
			map.origin = map.add.image(map.start[0], map.start[1], 'originTile')
			
//ensure that nothing bad happens if it fails
//remove the previous instance of the destination tile
//as the destination tile is a physics object, it would push away the previous version of the tile if not removed
			try{
				destTile.destroy()
			}
			catch(err){
				null
			}
// start the path object
			console.log('path added')
			map.curve = new Phaser.Curves.Path(map.start[0], map.start[1]);
			
//the list of tiles used in the path
			map.tileGroup = map.add.group()
//iterate over coordinates
			for(var i = 0; i < map.pathList.length; i ++){
//adds the coordinates to the curve
				map.curve.lineTo(map.pathList[i][0], map.pathList[i][1])
//if the coordinate is not the last one, make the tile a normal path tile
				if(i < map.pathList.length-1){
					map.tileGroup.create(map.pathList[i][0], map.pathList[i][1], 'pathTile')
				}
//if the coordinate is the last one, make it the destination tile
//enable physics for this tile so it could be interacted with
				else{
					map.dest = map.physics.add.image(map.pathList[i][0], map.pathList[i][1], 'destTile')
				}
			}
		}
		
		
		
//function that makes the enemy object
		this.makeEnemy = function(){
			var x = map.start[0]
			var y = map.start[1]
			var enemy = new Enemy
			({
				scene: map,
				curve: map.curve,
				x: x,
				y: y,
				image: 'enemy'
			})

//give it some attributes for when it is being attacked
			enemy.hp = 2;
			enemy.value = 1
			enemy.destReached = false;
			
			enemy.key = map.enemyID

//add the follower to the list of enemies, physics enabled
			map.enemyGroup.add(enemy, map)
			
//state the number of objects in the enemy list
			console.log('number of enemies: ' + map.enemyGroup.getLength())
//make the enemy follow the specific path at a specific speed
			enemy.follow(enemy);
//check if the enemy has reached the destination
//if it has reached, call the function to handle such an event
			map.physics.add.overlap(enemy, map.dest, mapLogic.enemyReachDest)
			
//increment the id
			map.enemyID ++
			
// used for the winning condition
//when this number is 0 and there are no more enemies, then the player wins
			gameStats.monsters -=1
			console.log('enemies left: ' + gameStats.monsters)
		}

//function for searching for an enemy within a tower's range
		this.searchEnemy = function(enemy){
//there are two foreach loops, the outer one is the one that called the function
			map.siteContainer.each(
//search the building sites
				function(siteC){
//this determines if there is a tower in the building site
					var tower = siteC.getByName('tower')
					if(tower != null){
//in the even that it is within range of a tower then the function indicating an enemy has been found will be called
						map.physics.add.overlap(enemy, tower, mapLogic.enemyFound)
					}
				}
			)
		}
		
//function for when an enemy reachs the destination
		this.enemyReachDest = function(enemy, dest){
			enemy.destReached = true;
			enemy.destroy()
			console.log('remove enemy')
			gameStats.lives -= 1;
			console.log('lives: ' + gameStats.lives)
		}
		
//function for when an enemy has been found
		this.enemyFound = function(enemy, tower){
//only do this if the state of the tower is 'ready'
			if(tower.state == 'ready'){
//make a new bullet object
				var bullet = new Bullet
				({
					scene: map,
					x: tower.x,
					y: tower.y,
					image: 'bullet'
				})
//make the bullet a certain size
				bullet.displayWidth = 50;
				bullet.displayHeight = 50;
//make the bullet target a specific enemy, it's the one in the input parameter
				bullet.target = enemy
//add the bullet to the group and in turn the map itself
				map.bulletGroup.add(bullet, map)
				console.log('number of bullets: ' + map.bulletGroup.getLength())
//change the state so it won't fire again for the time being
				tower.state = 'firing'
			}
		}

//function for making the building site
		this.makeSite = function(coordinates){
//make the building site container object
//this would contain the empty building site as well as any tower that is built upon it
//it is placed at 0,0 because otherwise the detection range of the towers would be distorted
			var siteC = new SiteC({
				scene: map,
				x: 0,
				y: 0
			})

//place the container in the container holding all building site containers, it is a nested set of containers
			map.siteContainer.add(siteC)

//make the building site image object that would show when building site is empty
//also hold the coordinates of this building site so could be refered to when building a tower
			var site = new Site({
				scene: map,
				x : coordinates[0],
				y : coordinates[1],
				image : 'site'
			})

//name of the object so it may be referenced from the container
			site.name = 'site'
//this allows the image to b clicked on
			site.setInteractive()
//this adds the image to the inner container
			siteC.add(site, map)
		}
		
//function for when a building site image is clicked on
		this.clickSite = function(container){
//gets the image of the building site
			var site = container.getByName('site')
//when the image of this site is clicked on, the coordinates of the site are used to make a tower
			site.on(
				'pointerdown',
				function(){
					mapLogic.makeTower(site.x, site.y, container)
				}
			)
		}

//function for making a tower
		this.makeTower = function(x,y, container){
//attack range of the tower
			var r = 200
//make the tower image object
			var tower = new Tower
			({
				scene: map,
				x: x,
				y: y,
				image: 'tower'
			})	
//set the tower an id number
			tower.key = map.towerID
//set the state of the tower so it may attack
			tower.state = 'ready'
//set the name of the tower so it may be referenced from the container
			tower.name = 'tower'
//allow the tower to be clicked on
			tower.setInteractive()
//when clicked on, a circle appears around the tower indicating its attack range
			tower.on('pointerdown', function () {
				try{
//remove any previous iteration of circle
					map.circle.destroy()
				}
				catch(err){
					null
				}
//add a new circle
				map.circle = map.add.circle(x, y, r)
//draw the circle
				map.circle.setStrokeStyle(3, 0x1a65ac);
			})
			
//add the tower to the container
			container.add(tower, map)
//enable physics for the tower so it may detect enemies
			map.physics.world.enable(tower);
//alter the physics parameters of the tower so it makes a circle of r radius around the tower
			tower.setCircle(r, (-r+tower.displayWidth/2), (-r+tower.displayHeight/2))
//increment the id
			map.towerID++
			
//make a new image object for the remove tower button
			var cross = new Phaser.GameObjects.Image(map, x + tower.displayWidth/2, y - tower.displayHeight/2, 'x')
//change the size of the image
			cross.displayHeight = 50
			cross.displayWidth = 50
//allow the image to be clicked on
			cross.setInteractive()
//set the name of the image so it may be referenced from the container
			cross.name = 'cross'
//add the image to the container
			container.add(cross, map)	
		}
		
//function for moving the bullet
		this.moveBullet = function(bullet){
//the bullet moves to its target at this speed
			map.physics.moveToObject(bullet, bullet.target, 500)
//call the function when the bullet reaches its target
			map.physics.add.overlap(bullet, bullet.target, mapLogic.hitEnemy)
		}
		
//function for when the bullet reaches its target
		this.hitEnemy = function(bullet, enemy){
//the enemy loses 1 hp
			enemy.hp -= 1
//the bullet is removed from the world
			bullet.destroy()
			console.log('enemy key: ' + enemy.key + ', enemy hp: ' + enemy.hp)
//if the enemy has 0 hp then money increases
			if(enemy.hp == 0){
				gameStats.money += enemy.value
				console.log('money: ' + gameStats.money)
			}
		}

//function for when the enemy is destroyed
		this.updateBullet = function(bullet){
//if the enemy's hp is 0 or it reaches the destination, the bullet is removed from the world
			if((bullet.target.hp <= 0) || (bullet.target.destReached)){
				bullet.target.destroyEnemy(bullet.target)
				bullet.destroy()
			}
		}
		
//function for limiting the attack speed of the tower
		this.towerSpeed = function(site){
//first determine if there is a tower at the building site
			var tower = site.getByName('tower')
			if(tower != null){
//if there is a tower and if its state is 'firing', immediately change it to 'reload' then after a time, call the function to make it 'ready'
				if(tower.state == 'firing'){
					tower.state = 'reload'
					map.time.delayedCall(500, tower.reload, [tower], map)
				}
			}
		}
		
//function for removing a tower from a container and in turn the world
		this.clearTower = function(site){
//determine if there is a tower at the building site
			var tower = site.getByName('tower')
			var cross = site.getByName('cross')
			if(cross != null){
//when the cross is clicked on, both the tower and cross are removed
				cross.on('pointerdown', function(){
					tower.destroy()
					cross.destroy()
//if there is a circle showing attack range, remove that too
					try{
						map.circle.destroy()
					}
					catch(err){
						null
					}
				})
			}
		}

//function for resetting the id counter for enemies
		this.resetEnemyID = function(){
			if(map.enemyGroup.getLength() == 0){
				map.enemyID = 0
			}
		}
		
//function for counting the number of living enemies
		this.getNumEnemies = function(){
			map.numEnemies = map.enemyGroup.getLength()
		}
		
		
	}
}

export default MapLogic
	
	
