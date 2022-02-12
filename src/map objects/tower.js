//the image of the tower
class Tower extends Phaser.Physics.Arcade.Image
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
	

//this is used to change the value of state for this tower	
	reload(target){
		target.state = 'ready'
	}
}

export default Tower