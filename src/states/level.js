var back;


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
		var level = this.scene.get('level')
		
		back = this.add.image(50, 50, 'menu').setInteractive()
		
		back.on('pointerdown', function () {
			console.log('change states1')
			this.scene.scene.start('menuState')
		})
		
		
		this.makeButton = function(level, x, y){
			var levelButton = this.add.image(x, y, resources.levels[level]['selection']['picture']).setInteractive()
			
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
			resources.levelSelect = level.toString()
			resources.mapData = resources.levels[resources.levelSelect]
			this.scene.start('playingState')		
		}

		
    }
	
}

export default LevelState

