//a circle representing the range of the tower
//a different class due to phaser keeping different object types separate
class TowerRange extends Phaser.GameObjects.Graphics
{
	constructor (config)
    {
//the scene changes to this one when this keyword is used
        super(
			config.scene,
			config.x,
			config.y
		);

		this.x = config.x
		this.y = config.y		
    }
	

	
	drawCirc(target){

		target.lineStyle(4, 0xff0000, 1);
		target.strokeCircle(0, 0, 100);

	}
	
	detectRange(target)
	{
		target.on('pointerover', function () {

//		target.clear();
		target.lineStyle(4, 0x0000ff, 1);
		target.strokeCircle(0, 0, 100);

		});

		target.on('pointerout', function () {

//		target.clear();
		target.lineStyle(4, 0xffff00, 1);
		target.strokeCircle(0, 0, 100);	
		
		})
		 
	}
	
}

export default TowerRange