class LevelState extends Phaser.Scene
{
	constructor ()
    {
        super('levelState');
    }

    preload ()
    {
    }
      
    create ()
    {	
		this.scene.stop('gameStats')
		this.scene.stop('hud')
		this.scene.stop('map')
		
		var resources = this.scene.get('resources')
		var gameRecords = this.scene.get('gameRecords')
		var levelSelect = this.scene.get('level')

		var back = this.add.image(50, 50, 'left').setInteractive()
		
		back.on('pointerdown', function () {
			this.scene.scene.start('menuState')
		})
		
		this.title = this.add.text(350, 0, 'Level Select', { font: '32px Arial' })
		
		this.descBox
		
		this.makeButton = function(level, x, y){
			var levelButton = this.add.image(x, y, resources.levels[level]['selection']['picture']).setInteractive()
			
			levelButton.description = resources.levels[level]['selection']['description']
			
			this.input.on('pointerover', function(pointer, gameobject){
				try{
					 if(this.scene.descBox){
						this.scene.descBox.destroy()
					}
					if(gameobject[0].description){
						this.scene.descBox = this.scene.add.container(pointer.x + 100, pointer.y)
						var red = new Phaser.GameObjects.Image(this.scene, 0, 0, 'red')
						red.displayWidth = 200
						red.displayHeight = 200
						this.scene.descBox.add(red, level)

						var desc = gameobject[0].description
						var config = {fontSize:'18px', color:'#000000', fontFamily: 'Arial'}

//display the description in the little window
						var displayDesc = new Phaser.GameObjects.Text(
							this.scene,
							-90,
							-90,
							desc,
							config
						)

						this.scene.descBox.add(displayDesc, this.scene)
					}
				}
				catch(err){
					err
				}
				
				this.scene.input.on('pointerout', function(){
					if(this.scene.descBox){
						this.scene.descBox.destroy()
					}
				})	
			})
			
			levelButton.on('pointerdown', function(){
				this.scene.clickButton(level)
			})
			
		}
		
		this.levelButtons = function(){
			for(var i = 0; i < resources.levelList.length; i++){
				var x
				var y = 250
				switch (i){
					case 0:
						x = 50
						break;
					case 1: 
						x = 150
						break;
					case 2:
						x = 250
						break;
					case 3:
						x = 350
						break;
					case 4:
						x = 450
						break;
					default:
						console.log('x error')
						break;
				}
				this.makeButton(resources.levelList[i], x, y)		
			}
		}
		
		this.levelButtons()
		
		this.clickButton = function(level){
			gameRecords.levelSelect = level.toString()
			resources.mapData = resources.levels[gameRecords.levelSelect]
			this.scene.start('playingState')		
		}
    }
}

export default LevelState

