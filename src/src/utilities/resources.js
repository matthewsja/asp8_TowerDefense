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
		this.assets = {
			'one': {
				type: 'image',
				path:'src/assets/images/1.png'
			},
			'two': {
				type: 'image',
				path:'src/assets/images/2.png'
			},
			'three':{
				type: 'image',
				path:'src/assets/images/3.png'
			},
			'four': {
				type: 'image',
				path:'src/assets/images/4.png'
			},
			'six': {
				type: 'image',
				path:'src/assets/images/6.png'
			},
			'seven': {
				type: 'image',
				path:'src/assets/images/7.png'
			},	
			'tower1a': {
				type: 'image',
				path:'src/assets/images/tower1a.png'
			},
			'tower2a':  {
				type: 'image',
				path:'src/assets/images/tower2a.png'
			},
			'tower3a': {
				type: 'image',
				path:'src/assets/images/tower3a.png'
			},

			'tower1b':  {
				type: 'image',
				path:'src/assets/images/tower1b.png'
			},
			'tower2b':  {
				type: 'image',
				path:'src/assets/images/tower2b.png'
			},
			'tower3b': {
				type: 'image',
				path:'src/assets/images/tower3b.png'
			},
			'resume':  {
				type: 'image',
				path:'src/assets/images/resume.png'
			},
			'restart': {
				type: 'image',
				path:'src/assets/images/restart.png'
			},
			'menu': {
				type: 'image',
				path:'src/assets/images/menu.png'
			},
			'red': {
				type: 'image',
				path:'src/assets/images/red_square.png'
			},
			'blue': {
				type: 'image',
				path:'src/assets/images/blue_square.png'
			},	
			'cross': {
				type: 'image',
				path:'src/assets/images/x.png'
			},
			'circle': {
				type: 'image',
				path:'src/assets/images/circle.png'
			},
			'sell': {
				type: 'image',
				path:'src/assets/images/sell.png'
			},
			'enemy1': {
				type: 'image',
				path:'src/assets/images/enemy1.png'
			},
			'enemy2': {
				type: 'image',
				path:'src/assets/images/enemy2.png'
			},
			
			'bullet1': {
				type: 'image',
				path:'src/assets/images/bullet1.png'
			},
			'bullet2': {
				type: 'image',
				path:'src/assets/images/bullet2.png'
			},	
			'bullet3': {
				type: 'image',
				path:'src/assets/images/bullet3.png'
			},

			'tileset': {
				type: 'image',
				path:'src/assets/images/tileset.png'
			},
			'level': {
				type: 'image',
				path:'src/assets/images/level.png'
			},
			'arrow1': {
				type: 'image',
				path:'src/assets/images/arrow1.png'
			},
			'arrow2': {
				type: 'image',
				path:'src/assets/images/arrow2.png'
			},
			'arrow3': {
				type: 'image',
				path:'src/assets/images/arrow3.png'
			},
			'pause': {
				type: 'image',
				path:'src/assets/images/pause.png'
			},
			'start': {
				type: 'image',
				path:'src/assets/images/start.png'
			},
			'left': {
				type: 'image',
				path:'src/assets/images/left.png'
			},
			'rush': {
				type: 'image',
				path:'src/assets/images/rush.png'
			},
			'towerData': {
				type: 'json',
				path:'src/assets/json/towers.json'
			},
			'bulletData':{
				type: 'json',
				path:'src/assets/json/bullets.json'
			},
			'enemyData':{
				type: 'json',
				path:'src/assets/json/enemies.json'
			},
			'levelData':{
				type: 'json',
				path:'src/assets/json/levels.json'
			}		
		}
		
		for (const key of Object.keys(this.assets)) {
			if(this.assets[key]['type'] == 'image'){
				this.load.image(key, this.assets[key]['path'])
			}
			else if(this.assets[key]['type'] == 'json'){
				this.load.json(key, this.assets[key]['path'])
			}
		}
    }
      
    create ()
    {		
		this.levelList = []
		
		this.levels = this.cache.json.get('levelData')
		
		for(var key in this.levels){
			this.levelList.push(key)
		}

		this.mapData = this.levels[this.levelList[0]]
		
//dictionary displaying different towers and their stats
		this.towers = this.cache.json.get('towerData')
		
		this.startTowers = []
		
		for (const key of Object.keys(this.towers)) {
			var keyLength = key.length
			if(key[keyLength-1] == 'a'){
				this.startTowers.push(key)
			}
		}
		
//dictionary displaying different bullets and their stats				
		this.bullets = this.cache.json.get('bulletData')
		
//dictionary displaying different enemies and their stats
		this.enemies = this.cache.json.get('enemyData')
    }
	
	update()
	{	
	}
}

export default Resources