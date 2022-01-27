
class Site extends Phaser.GameObjects.Image
{
	constructor (config)
    {
//initial parameters
        super(
			config.scene,
			config.x,
			config.y,
			config.image
		);
		
    }
	
	
}

export default Site