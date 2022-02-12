class SiteC extends Phaser.GameObjects.Container{
	constructor (config)
    {
//initial parameters
        super(
			config.scene,
			config.x,
			config.y
		);
		this.x = config.x
		this.y = config.y
    }
}

export default SiteC