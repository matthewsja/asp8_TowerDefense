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
		this.image = config.image;
    }

	follow(target){
		target.startFollow({
				duration: 2000,
				yoyo: false,
				repeat: 0,
				rotateToPath: false,
				verticalAdjust: false,
    		});
	}
	
	customFunc()
	{
		console.log('image: ' + this.image)
		
	}

}

export default Enemy