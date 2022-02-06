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
      
    create ()
    {
//		var map = this.scene.get('map')
    }
	
	update()
	{	
		var resources = this.scene.get('resources')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		
		
//function for making the path
		this.makePath = function(pathList){
			if(map.enemyGroup.getLength() > 0){
				console.log("can't change paths, it is still active")
			}
			else{
//remove the previous instance of the destination tile

				mapLogic.removePrev(map.origin)
				mapLogic.removePrev(map.tileGroup)
				mapLogic.removePrev(map.dest)
				
				console.log('path added')

//iterate over coordinates
				for(var i = 0; i < pathList.length; i ++){
					if(i == 0){
						map.origin = map.add.image(pathList[i][0], pathList[i][1], 'originTile')
						map.origin.state = null
						map.origin.quant = 0
						map.curve = new Phaser.Curves.Path(pathList[i][0], pathList[i][1]);
						map.tileGroup = map.add.group()
					}
//adds the coordinates to the curve
					else{
						map.curve.lineTo(pathList[i][0], pathList[i][1])
//if the coordinate is not the last one, make the tile a normal path tile
						if(i < pathList.length-1){
							map.tileGroup.create(pathList[i][0], pathList[i][1], 'pathTile')
						}
//if the coordinate is the last one, make it the destination tile
//enable physics for this tile so it could be interacted with
						else{
							map.dest = map.physics.add.image(pathList[i][0], pathList[i][1], 'destTile')
							map.dest.setCircle(10, -5+map.dest.displayWidth/2, -5+map.dest.displayHeight/2)
//							
						}
					}
				}
			}
		}
		
		
		
//function that makes the enemy object
		this.makeEnemy = function(key){

			var x = map.origin.x
			var y = map.origin.y			
			var image = key['image']
			
			var enemy = new Enemy
			({
				scene: map,
				curve: map.curve,
				x: x,
				y: y,
				image: image
			})
			
	
//give it some attributes for when it is being attacked
			enemy.size = key['size']
			enemy.displayWidth = enemy.size[0]
			enemy.displayHeight = enemy.size[1]
			enemy.pathLength = map.curve.getLength()
			enemy.speedMaster = key['speed']
			enemy.speed = enemy.speedMaster * gameStats.playSpeed
			enemy.progress = 0
			enemy.progressPercent = 0
			enemy.maxHP = key['hp']
			enemy.HP = enemy.maxHP;
			enemy.value = key['value']
		

//add the follower to the list of enemies, physics enabled
			map.enemyGroup.add(enemy, map)
			
//state the number of objects in the enemy list
			console.log('number of enemies: ' + map.enemyGroup.getLength())
			
			map.physics.world.enable(enemy);
			
//make the enemy follow the specific path at a specific speed
			enemy.startFollow(enemy)

			enemy.pathTween.timeScale = enemy.speed
			
			
//check if the enemy has reached the destination
//if it has reached, call the function to handle such an event
			map.physics.add.overlap(enemy, map.dest, mapLogic.enemyReachDest)

			
			
// used for the winning condition
//when this number is 0 and there are no more enemies, then the player wins
			gameStats.monsters -=1
			console.log('enemies left: ' + gameStats.monsters)
			
			map.time.delayedCall(60000, mapLogic.debugEnemy, [enemy], map)
		}
		
		this.debugEnemy = function(enemy){
			console.log('buggy enemy')
			enemy.destroy()
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
				mapLogic.makeBullet(enemy, tower)
			}
		}
		
		this.makeBullet = function(enemy, tower){
			var  key = eval(tower.bulletKey)
			var image = key['image']
			var x = tower.x
			var y = tower.y
			
			var bullet = new Phaser.GameObjects.Image(map, x, y, image)
			
			var size = key['size']
//make the bullet a certain size
			bullet.displayWidth = size[0];
			bullet.displayHeight = size[1];
			bullet.speedMaster = key['speed']
			bullet.speed = bullet.speedMaster * gameStats.playSpeed
			bullet.damageType = key['damageType']
			bullet.damage = key['damage']
			bullet.AOE = key['AOE']
			
//make the bullet target a specific enemy, it's the one in the input parameter
			bullet.target = enemy
//add the bullet to the group and in turn the map itself
			map.bulletGroup.add(bullet, map)
			console.log('number of bullets: ' + map.bulletGroup.getLength())
//change the state so it won't fire again for the time being
			tower.state = 'firing'
			
		}

//function for making the building site
		this.makeSite = function(coordinates){
//make the building site container object
//this would contain the empty building site as well as any tower that is built upon it
//it is placed at 0,0 because otherwise the detection range of the towers would be distorted
			var container = new Phaser.GameObjects.Container(map, 0, 0)

			container.id = map.siteID;
//place the container in the container holding all building site containers, it is a nested set of containers
			map.siteContainer.add(container)

//make the building site image object that would show when building site is empty
//also hold the coordinates of this building site so could be refered to when building a tower
			var site = new Phaser.GameObjects.Image(map, coordinates[0], coordinates[1], 'site').setInteractive()


//name of the object so it may be referenced from the container
			site.name = 'site'
			


//this adds the image to the inner container
			container.add(site, map)
			
			map.siteID++
		}
		
//function for when a building site image is clicked on
		this.clickSite = function(container){
//gets the image of the building site
			var site = container.getByName('site')
//when the image of this site is clicked on, the coordinates of the site are used to make a tower
			site.on(
				'pointerdown',
				function(){
					hudLogic.makeTowerMenu(container)
				}
			)
			
		}
			
//function for making a tower
		this.makeTower = function(container, key){
//			if(container.getByName('tower') == null){
			var site = container.getByName('site')
			
			var image = key['image']
				
			var x = site.x
			var y = site.y
			
//attack range of the tower
			var r = 200
			
//make the tower image object
			var tower = new Phaser.Physics.Arcade.Image(map, x, y, image)

//set the state of the tower so it may attack
			tower.state = 'ready'
//set the name of the tower so it may be referenced from the container
			tower.name = 'tower'
			tower.id = key['id']
			tower.range = key['range']
			tower.speedMaster = key['speed']
			tower.speed = tower.speedMaster * gameStats.playSpeed
			tower.bulletKey = key['bulletKey']
			tower.upgradeKey = key['upgradeKey']

//enable physics for the tower so it may detect enemies
			map.physics.world.enable(tower);
//alter the physics parameters of the tower so it makes a circle of tower range radius around the tower
			tower.setCircle(tower.range, (-tower.range+tower.displayWidth/2), (-tower.range+tower.displayHeight/2))

//add the tower to the container
			container.add(tower, map)
		}
		
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
		this.towerSpeed = function(site){
//first determine if there is a tower at the building site
			var tower = site.getByName('tower')
			if(tower != null){
//if there is a tower and if its state is 'firing', immediately change it to 'reload' then after a time, call the function to make it 'ready'
				if(tower.state == 'firing'){
					tower.state = 'reload'
					map.time.delayedCall(1000/tower.speed, mapLogic.towerReload, [tower], map)
				}
			}
		}
		
		this.towerReload = function(tower){
			tower.state = 'ready'
		}

		
//function for counting the number of living enemies
		this.getNumEnemies = function(){
			map.numEnemies = map.enemyGroup.getLength()
		}
		
		this.removePrev = function(object){
			if(object){
				object.destroy(true)
			}
		}
		
		this.enemyProgress = function(enemy){
			enemy.pathTween.timeScale = enemy.speed

		}
		
		this.updateSpeed = function(){
			map.bulletGroup.getChildren().forEach(function(bullet){
				bullet.speed = bullet.speedMaster * gameStats.playSpeed
			})
			
			map.enemyGroup.getChildren().forEach(function(enemy){
				enemy.speed = enemy.speedMaster * gameStats.playSpeed
				enemy.pathTween.timeScale = enemy.speed

			})
			map.siteContainer.each(function(site){
				if(site.getByName('tower') != null){
					var tower = site.getByName('tower')
					tower.speed = tower.speedMaster * gameStats.playSpeed
				}
			})
		}
		
		
		
		this.waveMake = function(){
			var origin = map.origin
			if(origin.state == 'creating'){
				console.log(origin.state)
				mapLogic.makeEnemy(origin.enemy)
				origin.state = 'created'
				origin.created++
			}
		}
		
		this.waveSpeed = function(){
			var origin = map.origin
			if(origin.created < origin.quant){
				if(origin.state == 'created'){
					origin.state = 'rest'
					map.time.delayedCall(1000/origin.speed,mapLogic.waveReload,[],map)
				}
			}
			if(origin.created >= origin.quant){
				console.log('wave finished')
			}
		}
		
		this.waveReload = function(){
			
			map.origin.state = 'creating'
		}
		
		this.makeWave = function(data){
			console.log(data)
			var enemy = eval(data[0])
			var rate = data[1]
			var quant = data[2]
			var origin = map.origin
			
			origin.quant = quant
			origin.created = 0
			origin.speedMaster = rate
			origin.speed = origin.speedMaster * gameStats.playSpeed
			origin.state = 'creating'
			origin.enemy = enemy
		}
	}
}

export default MapLogic
	
	
