class MapLogicEnemy extends Phaser.Scene
{
	constructor ()
	{
//the scene changes to this one when this keyword is used
        super('mapLogicEnemy');
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
		
//function that makes the enemy object
//takes in as a parameter the key of enemy to make
		this.makeEnemy = function(key){
			var origin = map.origin
//check if the origin is ready to make another enemy
			if(origin.state == 'creating'){
				
//in the case that the origin is ready, create a new enemy object using the value in the 'image' of key				
				var enemy = new Phaser.GameObjects.PathFollower(
					map,
					map.path,
					0,
					0,
					key['image']
				)

//give it some attributes for when it is moving and being attacked as well as how big the enemy is in pixels in height and width
				enemy.size = key['size']
				enemy.displayWidth = enemy.size[0]
				enemy.displayHeight = enemy.size[1]
//how far the enemy has to travel, helps ensure that the enemy travels at the same speed no matter how far it needs to travel
				enemy.pathLength = map.path.getLength()
//speed of the enemy
//this speed value is not impacted by how fast the game is being played at
				enemy.speedMaster = key['speed']
//this speed value depends on the how fast the game is being played at
				enemy.speed = enemy.speedMaster * gameStats.playSpeed
				
//HP of the enemy 
//HP of the enemy at the start
				enemy.maxHP = key['hp']
//current HP of the enemy, changes if it is attacked
				enemy.HP = enemy.maxHP;
//the portion of HP the enemy currently has
//starts off at 1 then goes down as the enemy is being attacked
				enemy.HPPortion = enemy.HP/enemy.maxHP
				
//HP bar
//the code to get the HP bar is from https://phasergames.com/how-to-make-a-health-bar-in-phaser-3/
//the bar is made of two rectangles of different colours, the current and max HP with the current HP overlapping the max HP
//they are placed directly above the enemy they are for
				enemy.maxHPBar = map.add.graphics()
				enemy.maxHPBar.x = enemy.x - enemy.size[0]/2
				enemy.maxHPBar.y = enemy.y - enemy.size[1]/2 - 10
//colour of the maxHP bar is a variant of red
				enemy.maxHPBar.fillStyle(0xe74c3c)
				enemy.maxHPBar.fillRect(enemy.maxHPBar.x, enemy.maxHPBar.y, enemy.size[0], 20)
				
				enemy.HPBar = map.add.graphics()
				enemy.HPBar.x = enemy.x - enemy.size[0]/2
				enemy.HPBar.y = enemy.y - enemy.size[1]/2 - 10
//colour of the current HP bar is a variant of green
				enemy.HPBar.fillStyle(0x2ecc71)
				enemy.HPBar.fillRect(enemy.HPBar.x, enemy.HPBar.y, enemy.size[0], 20)
//this part determines the size of the current HP bar, when it shrinks, more of the maxHP bar is revealed
				enemy.HPBar.scaleX = enemy.HPPortion
				
//amount of money rewarded when the enemy is defeated				
				enemy.value = key['value']

//add the follower to the list of enemies
				map.enemyGroup.add(enemy, map)

//state the number of objects in the enemy list
				console.log('number of enemies: ' + map.enemyGroup.getLength())
//enable physics for the enemy so it can react when detected, attacked or reach the destination
				map.physics.world.enable(enemy);

//make the enemy follow the specific path at a specific speed
				enemy.startFollow({
						positionOnPath: true,
						duration: enemy.pathLength,
						yoyo: false,
						repeat: 0,
						rotateToPath: false,
						verticalAdjust: false
				});
				
				
//ensure that the speed the enemy travels at the start is determined by how fast the game is being played at
				enemy.pathTween.timeScale = enemy.speed

//check if the enemy has reached the destination
//if it has reached it, call the function to handle such an event
				map.physics.add.overlap(enemy, map.dest, mapLogicEnemy.enemyReachDest)
				
				
//if the enemy is somehow buggy, this function will remove the enemy one minute after it has spawned, timer changes speed if the play speed changes
				enemy.lifeTime = map.time.delayedCall(60000, mapLogic.debugEnemy, [enemy], map)
//change the state of the origin so it won't make another enemy yet
				origin.state = 'created'
//increase the count of the number of enemies made for the current wave, when it reaches a certain threshold dependent on the attributes of the wave, not more enemies are spawned
				origin.created++
			}
		}
		
//function for removing the enemy
//takes in as a parameter the enemy to remove
		this.removeEnemy = function(enemy){
//as the HP bar is made of graphics, its components need to be removed individually
			enemy.maxHPBar.destroy()
			enemy.HPBar.destroy()
//remove the enemy from the game
			enemy.destroy()
		}
		
//function for removing an enemy in case it is buggy
//takes in as a parameter the enemy to remove
		this.debugEnemy = function(enemy){
//as the HP bar is made of graphics, its components need to be removed individually
			enemy.maxHPBar.destroy()
			enemy.HPBar.destroy()
			mapLogic.removeEnemy(enemy)
			console.log('buggy enemy')
		}

//function for updating the HP bar of an enemy
//takes in as a parameter the enemy whose HP bar to update
		this.updateHPBar = function(enemy){
//update the position of the maxHP bar as the enemy moves
			enemy.maxHPBar.x = enemy.x
			enemy.maxHPBar.y = enemy.y - 20

//update the size of the current HP bar as the enemy takes damage
			enemy.HPPortion = enemy.HP/enemy.maxHP
			enemy.HPBar.scaleX = enemy.HPPortion
			
//update the position of the current HP bar as the enemy moves
//the position is also dependent on what portion of HP it has left as the centre of the current HP bar shift left as the enemy takes damage
//shifting the current HP bar to the left means that the all damage received by the enemy is visually displayed on the right side
			enemy.HPBar.x = enemy.x - enemy.size[0]*(1-enemy.HPPortion)/2
			enemy.HPBar.y = enemy.y - 20
		}
		
		
//function for starting the game proper by sending the first wave
		this.startGame = function(){
			var waveData = resources.mapData['enemyWaves']['waves']
			map.origin.started = true
//determine the number of waves there are
			map.origin.waveMax = waveData.length
//call the function to change the parameters of the origin
//the values to change to are based on the value of the origin's waveCounter and the input wave data
			mapLogicEnemy.makeWave(waveData[map.origin.waveCounter])
		}
		
//function for starting the next wave prematurely when the rush button is clicked on while the countdown is active
		this.rushWave = function(){
//set the interactivity of the rush button to be this
//when the countdown is active and the button is clicked, the function to call the next wave is called
			map.start.on('pointerdown', function(){
				if(map.origin.coolDown){
					mapLogic.callNextWave()
				}
			})
		}
		
		
//function for changing the parameters of the origin so it is ready for another wave
//takes in as a parameter the data for the next wave
		this.makeWave = function(waveData){
//get the relavent data from the input dictionary
			var enemy = eval(waveData['enemy'])
			var rate = waveData['rate']
			var quant = waveData['quant']
			
			var origin = map.origin
			
//change the values of origin based on relavent data from the input dictionary
			origin.enemy = enemy
			origin.speedMaster = rate
			origin.quant = quant
			origin.created = 0
//this allows the origin to start making enemies again
			origin.state = 'creating'
		}
		
//function for determining the speed at which the enemies are made
//also stops making enemies when enough have been made
		this.updateWave = function(){
			var origin = map.origin
//if there are still more enemies to make for the current wave
			if(origin.created < origin.quant){
				if(origin.state == 'created'){
//temporarily change the state so this if statement won't be called until the next enemy is made
					origin.state = 'rest'
//an event delayed by an amount of time determined by the speed at which the enemies are made
					origin.delay = map.time.addEvent({
						delay: 1000/origin.speedMaster,
						timeScale: gameStats.playSpeed,
						loop: false
					})
				}
			}
//when the number of enemies made is at or above the maximum number of enemies for the wave, change the state so no more enemies are made
			if(origin.created >= origin.quant && origin.state != 'coolDown'){
				origin.state = 'finished'
			}
//when the state is such that no more enemies are made and there are no enemies alive, start the countdown for the next wave
			if((origin.state == 'finished') && (map.enemyGroup.getLength() == 0)){
				origin.state = 'coolDown'
				map.origin.coolDown = map.time.addEvent({
					delay: resources.mapData['enemyWaves']['wavePause'] * 1000,
					timeScale: gameStats.playSpeed,
					loop: false
				})
			}
		}

//function for changing the state of the origin so more enemies could be made
		this.reloadWave = function(){
			var origin = map.origin
			if(origin.delay){
//check if the timer has finished counting down so the state of origin could be changed
				if(origin.delay.getRemainingSeconds() == 0){
					origin.delay = false
//change the state of the origin so more enemies could be made
					origin.state = 'creating'
				}
			}
		}

//function for seeing if the origin is ready for another wave and if it is, call a function to change the origin parameters to fit this state
//also determines if the winning conditions have been met in which case the game state will change to the game complete state
		this.coolDown = function(){
//this is the countdown for between waves
			if(map.origin.coolDown){
//check if this is the last wave by temporarily increasing the wave counter by 1 and checking if the result is at or over the maximum number of waves
				if(map.origin.waveCounter+1 >= map.origin.waveMax){
//if it is the last wave and there are no enemies alive, then save the score, maybe update the top score and save the number of lives to the gameRecords scene, then change the game to the complete scene
					gameRecords.score = gameStats.score
					gameRecords.updateTopScore()
					gameRecords.lives = gameStats.lives
					this.scene.start('completeState')
					console.log('finished')
				}
				else{
					var progress = map.origin.coolDown.getRemainingSeconds()
//when the countdown id finished, the function to call the next wave is called
					if(progress == 0){
						mapLogicEnemy.callNextWave()
					}
				}
			}
		}
		
//function for calling the next wave
		this.callNextWave = function(){
//stop the cooldown timer as it has fulfilled its purpose
			map.origin.coolDown = false
//increase the waveCounter value so the next wave could be called
			map.origin.waveCounter++
			console.log('wave: ' + map.origin.waveCounter)
//call function that calls the next wave
			mapLogicEnemy.makeWave(resources.mapData['enemyWaves']['waves'][map.origin.waveCounter])
		}
		
		
//function for when an enemy reaches the destination
//takes in as parameters the 1)enemy and the 2)destination
//the destination is not used but the function call gives the function two parameters by default
		this.enemyReachDest = function(enemy, dest){
//this is to indicate that the enemy has reached the destination
//any bullets targeting it will be removed when it happens
			enemy.destReached = true;
//remove the enemy from the enemy group
			mapLogicEnemy.removeEnemy(enemy)
//decrease the number of lives by 1
			gameStats.lives -= 1;
			console.log('lives: ' + gameStats.lives)
		}
	}
}

export default MapLogicEnemy