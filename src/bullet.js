
class Bullet extends Phaser.Physics.Arcade.Image
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
		this.x = config.x
		this.y = config.y
    }
}

export default Bullet