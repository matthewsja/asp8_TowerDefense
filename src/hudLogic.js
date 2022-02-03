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
			mapLogic.removePrev(hud.settings)
			var settings = new Phaser.GameObjects.Container(hud, 400, 300)

			hud.settings = hud.add.existing(settings)

			var red = new Phaser.GameObjects.Image(hud, 0, 0, 'red')
			red.displayWidth = 600
			red.displayHeight = 400
			settings.add(red, hud)

			var cross = new Phaser.GameObjects.Image(hud, 250, -150, 'cross').setInteractive()
			cross.displayWidth = 100
			cross.displayHeight = 100
			settings.add(cross, hud)
			
			cross.on('pointerdown', function(){
				hud.settings.destroy()
			})
			
			var one = new Phaser.GameObjects.Image(hud, -250, -150, 'one').setInteractive()
			settings.add(one, hud)
			
			var two = new Phaser.GameObjects.Image(hud, -150, -150, 'two').setInteractive()
			settings.add(two, hud)
			
			var three = new Phaser.GameObjects.Image(hud, -50, -150, 'three').setInteractive()
			settings.add(three, hud)
			
			var four = new Phaser.GameObjects.Image(hud, 50, -150, 'four').setInteractive()
			settings.add(four, hud)
			
			var five = new Phaser.GameObjects.Image(hud, 150, -150, 'five').setInteractive()
			settings.add(five, hud)			
			
			
			one.on('pointerdown', function () {
				console.log('change states1')
				this.scene.scene.start('menuState')
			})

			two.on('pointerdown', function () {
				console.log('change states2')
				this.scene.scene.start('levelState')
			})

			three.on('pointerdown', function () {
				console.log('change states3')
				this.scene.scene.start('playingState')
			})

			four.on('pointerdown', function () {
				console.log('change states4')
				this.scene.scene.start('completeState')
			})

			five.on('pointerdown', function () {
				console.log('change states5')
				this.scene.scene.start('overState')
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
			var green = new Phaser.GameObjects.Image(hud, 0, -200, 'green').setInteractive()
			green.displayWidth = 100
			green.displayHeight = 100
			
			green.on('pointerdown', function(){
				mapLogic.makeTower(container, resources.tower1)
				hud.towerMenu.destroy()
				console.log('tower made')
			})
			
			hud.towerMenu.add(green, hud)
			
			var blue = new Phaser.GameObjects.Image(hud, 0, -100, 'blue').setInteractive()
			blue.displayWidth = 100
			blue.displayHeight = 100
			
			blue.on('pointerdown', function(){
				mapLogic.makeTower(container, resources.tower2)
				hud.towerMenu.destroy()
				console.log('tower made')
			})
			
			hud.towerMenu.add(blue, hud)

			
			
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
			var towerName = new Phaser.GameObjects.Text(hud, -25, -225, name, { font: '12px Arial' })
			towerName.setTint(0x000000);
			hud.towerMenu.add(towerName, hud)
			
			var damage = ('damage: ' + bullet.damage)
			var towerDamage = new Phaser.GameObjects.Text(hud, -25, -200, damage,{font: '12px Arial'})
			towerDamage.setTint(0x000000)
			hud.towerMenu.add(towerDamage, hud)
			
			var range = ('range: ' + tower.range)
			var towerRange = new Phaser.GameObjects.Text(hud, -25, -175, range,{font: '12px Arial'})
			towerRange.setTint(0x000000)
			hud.towerMenu.add(towerRange, hud)
			
			var speed = ('speed: ' + tower.speedMaster)
			var towerSpeed = new Phaser.GameObjects.Text(hud, -25, -150, speed,{font: '12px Arial'})
			towerSpeed.setTint(0x000000)
			hud.towerMenu.add(towerSpeed, hud)

			
			
//when clicked on, a circle appears around the tower indicating its attack range
			var tower = container.getByName('tower')
			mapLogic.clickTower(tower)
		}
		
		
		this.removeTower = function(container){
			
			var tower = container.getByName('tower')

			tower.destroy()
			
//if there is a circle showing attack range, remove that too
			mapLogic.removePrev(map.circle)
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
		
		
    }
	
	update()
	{	
	}
}

export default HUDLogic