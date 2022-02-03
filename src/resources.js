
class Resources extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('resources');
		Phaser.Scene.call(this,{key: 'resources'})

    }

    preload ()
    {
    }
      
    create ()
    {
		this.tower1 = {
			id: 'tower_1a',
			image: 'tower1',
			bulletKey: 'resources.bullet1a',
			range: 200,
			speed: 2
		}
		
		this.tower2 = {
			id: 'tower_2a',
			image: 'tower2',
			bulletKey: 'resources.bullet2a',
			range: 300,
			speed: 1
		}
		
		this.bullet1a = {
			image: 'bullet1',
			size: [50, 50],
			speed: 500,
			damage: 1,
			damageType: 'normal',
			AOE: 0
		}

		this.bullet2a = {
			image: 'bullet2',
			size: [10, 10],
			speed: 1000,
			damage: 2,
			damageType: 'normal',
			AOE: 0
		}

	
		this.enemy1 = {
			image: 'enemy1',
			size: [100, 100],
			speed: 0.5,
			hp: 2,
			value: 1
		}
		

		this.enemy2 = {
			image: 'enemy2',
			size: [50, 50],
			speed: 0.7,
			hp: 3,
			value: 5
		}
		
		this.pathList1 = [
			[0, 600],
			[0, 500],
			[0, 400],
			[100, 400],
			[100, 500],
			[200, 500],
			[200, 400],
			[200, 300],
			[300, 300],
			[400, 300],
			[500, 300],
			[600, 300],
			[700, 300],
			[800, 300]
		]
		
		
		this.pathList2 = [
			[650, 50],
			[650, 150],
			[550, 150],
			[550, 250],
			[450, 250],
			[350, 250],
			[250, 250],
			[150, 250],
			[150, 350],
			[50, 350],
			[50, 450],
			[150, 450],
			[250, 450],
			[250, 550]
		]
		
		this.siteList = []
		//coordinates for the building sites
		this.siteList.push([350, 450])
		this.siteList.push([250, 350])
		this.siteList.push([350, 350])
		this.siteList.push([150, 550])
		
    }
	
	update()
	{	
	}
}

export default Resources