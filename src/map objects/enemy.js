//image of the enemy
//import enemyTile from './assets/enemy.png'

class Enemy extends Phaser.GameObjects.PathFollower
{
	constructor (config)
    {
//the scene changes to this one when this keyword is used
        super(
			config.scene,
			config.curve,
			config.x,
			config.y,
			config.image
		);
    }

//this is used to fillow the specified path
	follow(self){
		self.startFollow({
				positionOnPath: true,
				duration: self.pathLength,
				yoyo: false,
				repeat: 0,
				rotateToPath: false,
				verticalAdjust: false
		});
	}

//this is used to remove the enemy when its hp is 0
	destroyEnemy(self){
		console.log('enemy defeated')
		self.destroy()
	}

}

export default Enemy