class HUDLogic extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('hudLogic');
		Phaser.Scene.call(this,{key: 'hudLogic'})
    }

    preload ()
    {
    }
      
    create ()
    {
		var resources = this.scene.get('resources')
		
		var hud = this.scene.get('hud')
		var hudLogic = this.scene.get('hudLogic')
		var map = this.scene.get('map')
		var mapLogic = this.scene.get('mapLogic')
		var gameStats = this.scene.get('gameStats')
		


		this.makeSettings = function(){
			mapLogic.removePrev(hud.rec)
			mapLogic.removePrev(hud.towerMenu)
			mapLogic.removePrev(hud.settings)
			
			gameStats.isPlaying = false
			map.siteContainer.each(function(container){
				container.getByName('site').disableInteractive()
			})
			hud.speedButton.disableInteractive()
			var rec = new Phaser.GameObjects.Rectangle(hud, -100, -100, 2000, 2000, '0xAA7878', 0.5)
			hud.rec = hud.add.existing(rec)
			
			var settings = new Phaser.GameObjects.Container(hud, 400, 300)

			hud.settings = hud.add.existing(settings)

			var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
			red.displayWidth = 600
			red.displayHeight = 400
			settings.add(red, hud)
			
			var resume = new Phaser.GameObjects.Image(hud, 0, -140, 'resume').setInteractive()
			settings.add(resume, hud)
			
			resume.displayWidth = 200
			resume.displayHeight = 100
			
			var restart = new Phaser.GameObjects.Image(hud, 0, -30, 'restart').setInteractive()
			settings.add(restart, hud)
			
			restart.displayWidth = 200
			restart.displayHeight = 100
			
			var menu = new Phaser.GameObjects.Image(hud, 0, 80, 'menu').setInteractive()
			settings.add(menu, hud)
			
			menu.displayWidth = 200
			menu.displayHeight = 100
			
			resume.on('pointerdown', function(){
				gameStats.isPlaying = true
				
				map.siteContainer.each(function(container){
					container.getByName('site').setInteractive()
				})
				hud.speedButton.setInteractive()
				rec.destroy()
				
				settings.destroy()
			})

			restart.on('pointerdown', function () {
				console.log('change states3')
				this.scene.scene.start('playingState')
			})
			
			menu.on('pointerdown', function () {
				console.log('change states1')
				this.scene.scene.start('menuState')
			})

		}
		
		this.makeTowerMenu = function(container){
			mapLogic.removePrev(map.circle)
			mapLogic.removePrev(hud.towerMenu)

			var towerMenu = new Phaser.GameObjects.Container(hud, 750, 350)
			hud.towerMenu = hud.add.existing(towerMenu)
			
			var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
			red.displayWidth = 100
			red.displayHeight = 500
			towerMenu.add(red, hud)
			
			var cross = new Phaser.GameObjects.Image(hud, 0, 200, 'cross').setInteractive()
			cross.displayWidth = 100
			cross.displayHeight = 100
			towerMenu.add(cross, hud)
			

			
			cross.on('pointerdown', function(){
				mapLogic.removePrev(map.circle)
				hud.towerMenu.destroy()
			})
			
			if(container.getByName('tower') == null){
				hudLogic.makeMenuBuy(container)
			}
			else{
				hudLogic.makeMenuStats(container)
			}
		}
		
		this.makeMenuBuy = function(container){			
			console.log('there is no tower at: ' + container.id)
			

			for(var i = 0; i < resources.startTowers.length; i++){
				var tower = eval(resources.startTowers[i])
				
				var button = new Phaser.GameObjects.Image(hud, 0, -200 + 100 * i, tower.image).setInteractive()
				

				button.tower = tower
				button.displayWidth = 100
				button.displayHeight = 100	
				button.name = 'towerButton'
				

				hudLogic.clickBuy(button, container, tower)
					
				hud.towerMenu.add(button, hud)				
			}
		}
		
		this.updateTint = function(){
			if(hud.towerMenu){
				hud.towerMenu.each(function(button){
					if(button.name == 'towerButton'){
						if(gameStats.money < button.tower.cost){
							button.setTint('0xAA7878')
						}
						else{
							button.clearTint()
						}
					}
				})
			}
		}
		
		this.clickBuy = function(button, container, tower){
			var towerMenu = hud.towerMenu
			
			hud.input.on('gameobjectmove', function(pointer, gameobject){
//				try{
					if(towerMenu.getByName('buyStats')){
						towerMenu.getByName('buyStats').destroy()
					}
					
					var towerStats = gameobject.tower

					var bullet = eval(towerStats.bulletKey)
					
					var name = 'name: ' + towerStats.id
					var damage = 'damage: ' + bullet.damage
					var range = 'range: ' + towerStats.range
					var speed = 'speed: ' + towerStats.speed
					var cost = 'cost: ' + towerStats.cost
					
					var buyStats = new Phaser.GameObjects.Container(
						hud,
						pointer.x - towerMenu.x - 100,
						pointer.y - towerMenu.y
					)
					buyStats.name = 'buyStats'

					towerMenu.buyStats = towerMenu.add(buyStats, hud)


					var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
					red.displayWidth = 200
					red.displayHeight = 200
					buyStats.add(red, hud)
					
					var config = {fontSize:'18px', color:'#000000', fontFamily: 'Arial'}


					var displayStats = new Phaser.GameObjects.Text(
						hud,
						-50,
						-90,
						name + '\n' + damage+ '\n' + range + '\n' + speed + '\n' + cost,
						config
					)

					buyStats.add(displayStats, hud)
//				}
//				catch(err){
//					null
//				}				
			})
			
			hud.input.on('pointerout', function(){
				if(towerMenu.getByName('buyStats')){
						towerMenu.getByName('buyStats').destroy()
				}
			})
			
			button.on('pointerdown', function(){
					hudLogic.removeTower(container)
					mapLogic.makeTower(container, tower)
					hud.towerMenu.destroy()
					console.log(tower.id + ' made')
					gameStats.money -= tower.cost
				})
		}
		
		this.makeMenuStats = function(container){
			console.log('there is a tower at: ' + container.id)
			var blue = new Phaser.GameObjects.Image(hud, 0, 100, 'blue').setInteractive()
			blue.displayWidth = 100
			blue.displayHeight = 100
			
			blue.on('pointerdown', function(){
				hudLogic.removeTower(container)
				console.log('tower removed')
				hud.towerMenu.destroy()
			})
			
			
			
			hud.towerMenu.add(blue, hud)
			
			var tower = container.getByName('tower')
			var bullet = eval(tower.bulletKey)
			
			
			var name = ('name: ' + tower.id)
			var damage = ('damage: ' + bullet.damage)
			var range = ('range: ' + tower.range)		
			var speed = ('speed: ' + tower.speedMaster)

			var config = {fontSize:'12px', color:'#000000', fontFamily: 'Arial'}


			var displayStats = new Phaser.GameObjects.Text(
				hud,
				-40,
				-225,
				name + '\n' + damage+ '\n' + range + '\n' + speed,
				config
			)
			hud.towerMenu.add(displayStats, hud)
			
			var upgrade = eval(tower.upgradeKey)
			if(upgrade){
				

				var upgradeButton = new Phaser.GameObjects.Image(hud, 0, 0, upgrade.image).setInteractive()
				
				upgradeButton.tower = upgrade
				upgradeButton.displayWidth = 100
				upgradeButton.displayHeight = 100
				upgradeButton.name = 'towerButton'
				
				hudLogic.clickBuy(upgradeButton, container, upgrade)
				hud.towerMenu.add(upgradeButton, hud)
			}

			
			
//when clicked on, a circle appears around the tower indicating its attack range
//			var tower = container.getByName('tower')
			mapLogic.clickTower(tower)
		}
		
		
		this.removeTower = function(container){
			var tower = container.getByName('tower')
			if(tower){
				tower.destroy()
				//if there is a circle showing attack range, remove that too
				mapLogic.removePrev(map.circle)
			}

		}
		
		this.changeSpeed = function(){
			switch(gameStats.speedSetting){
				case 1:
					gameStats.speedSetting = 2
					hud.speedButton  = hud.add.image(50, 550, 'two').setInteractive()

					break;
				case 2:
					gameStats.speedSetting = 3
					hud.speedButton  = hud.add.image(50, 550, 'three').setInteractive()
					break;
				case 3:
					gameStats.speedSetting = 1
					hud.speedButton  = hud.add.image(50, 550, 'one').setInteractive()
					break;
					
				default:
					break
			}
			
			hud.speedButton.on('pointerdown', function(){
				hudLogic.changeSpeed()
				mapLogic.updateSpeed()
			})
		}
		
		this.showStats = function(){
			var lives = 'lives: ' + gameStats.lives
			var money = 'money: ' + gameStats.money
			var score = 'score: ' + gameStats.score

			mapLogic.removePrev(hud.gameLives)
			mapLogic.removePrev(hud.gameMoney)
			mapLogic.removePrev(hud.gameScore)

			hud.gameLives = hud.add.text(200, 20, lives, { font: '32px Arial' })
			hud.gameLives.setTint(0x000000);

			hud.gameMoney = hud.add.text(350, 20, money, {font: '32px Arial'})
			hud.gameMoney.setTint(0x000000)

			hud.gameScore = hud.add.text(500, 20, score, {font: '32px Arial'})
			hud.gameScore.setTint(0x000000)

		}
		
		
    }
	
	update()
	{	
	}
}

export default HUDLogic