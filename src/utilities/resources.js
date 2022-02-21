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
				fileType: 'image',
				path:'src/assets/images/1.png'
			},
			'two': {
				fileType: 'image',
				path:'src/assets/images/2.png'
			},
			'three':{
				fileType: 'image',
				path:'src/assets/images/3.png'
			},
			'four': {
				fileType: 'image',
				path:'src/assets/images/4.png'
			},
			'six': {
				fileType: 'image',
				path:'src/assets/images/6.png'
			},
			'seven': {
				fileType: 'image',
				path:'src/assets/images/7.png'
			},	
			'tower1a': {
				fileType: 'image',
				path:'src/assets/images/tower1a.png'
			},
			'tower2a':  {
				fileType: 'image',
				path:'src/assets/images/tower2a.png'
			},
			'tower3a': {
				fileType: 'image',
				path:'src/assets/images/tower3a.png'
			},

			'tower1b':  {
				fileType: 'image',
				path:'src/assets/images/tower1b.png'
			},
			'tower2b':  {
				fileType: 'image',
				path:'src/assets/images/tower2b.png'
			},
			'tower3b': {
				fileType: 'image',
				path:'src/assets/images/tower3b.png'
			},
			'resume':  {
				fileType: 'image',
				path:'src/assets/images/resume.png'
			},
			'restart': {
				fileType: 'image',
				path:'src/assets/images/restart.png'
			},
			'menu': {
				fileType: 'image',
				path:'src/assets/images/menu.png'
			},
			'red': {
				fileType: 'image',
				path:'src/assets/images/red_square.png'
			},
			'blue': {
				fileType: 'image',
				path:'src/assets/images/blue_square.png'
			},	
			'cross': {
				fileType: 'image',
				path:'src/assets/images/x.png'
			},
			'circle': {
				fileType: 'image',
				path:'src/assets/images/circle.png'
			},
			'sell': {
				fileType: 'image',
				path:'src/assets/images/sell.png'
			},
			'enemy1': {
				fileType: 'image',
				path:'src/assets/images/enemy1.png'
			},
			'enemy2': {
				fileType: 'image',
				path:'src/assets/images/enemy2.png'
			},
			
			'bullet1': {
				fileType: 'image',
				path:'src/assets/images/bullet1.png'
			},
			'bullet2': {
				fileType: 'image',
				path:'src/assets/images/bullet2.png'
			},	
			'bullet3': {
				fileType: 'image',
				path:'src/assets/images/bullet3.png'
			},
			'tileset': {
				fileType: 'image',
				path:'src/assets/images/tileset.png'
			},
			'level': {
				fileType: 'image',
				path:'src/assets/images/level.png'
			},
			'arrow1': {
				fileType: 'image',
				path:'src/assets/images/arrow1.png'
			},
			'arrow2': {
				fileType: 'image',
				path:'src/assets/images/arrow2.png'
			},
			'arrow3': {
				fileType: 'image',
				path:'src/assets/images/arrow3.png'
			},
			'pause': {
				fileType: 'image',
				path:'src/assets/images/pause.png'
			},
			'start': {
				fileType: 'image',
				path:'src/assets/images/start.png'
			},
			'left': {
				fileType: 'image',
				path:'src/assets/images/left.png'
			},
			'rush': {
				fileType: 'image',
				path:'src/assets/images/rush.png'
			},
			'bulletD1':{
				fileType: 'json',
				dataType: 'bullet',
				path:'src/assets/json/bullets/1.json'
			},
			'bulletD2':{
				fileType: 'json',
				dataType: 'bullet',
				path:'src/assets/json/bullets/2.json'
			},
			'bulletD3':{
				fileType: 'json',
				dataType: 'bullet',
				path:'src/assets/json/bullets/3.json'
			},
			'towerD1':{
				fileType: 'json',
				dataType: 'tower',
				path:'src/assets/json/towers/1.json'
			},
			'towerD2':{
				fileType: 'json',
				dataType: 'tower',
				path:'src/assets/json/towers/2.json'
			},
			'towerD3':{
				fileType: 'json',
				dataType: 'tower',
				path:'src/assets/json/towers/3.json'
			},
			'towerD4':{
				fileType: 'json',
				dataType: 'tower',
				path:'src/assets/json/towers/4.json'
			},
			'towerD5':{
				fileType: 'json',
				dataType: 'tower',
				path:'src/assets/json/towers/5.json'
			},
			'towerD6':{
				fileType: 'json',
				dataType: 'tower',
				path:'src/assets/json/towers/6.json'
			},
			'enemyD1':{
				fileType: 'json',
				dataType: 'enemy',
				path:'src/assets/json/enemies/1.json'
			},
			'enemyD2':{
				fileType: 'json',
				dataType: 'enemy',
				path:'src/assets/json/enemies/2.json'
			},
			'levelD1':{
				fileType: 'json',
				dataType: 'level',
				path:'src/assets/json/levels/1.json'
			},
			'levelD2':{
				fileType: 'json',
				dataType: 'level',
				path:'src/assets/json/levels/2.json'
			},
			'levelD3':{
				fileType: 'json',
				dataType: 'level',
				path:'src/assets/json/levels/3.json'
			}
		}
				
		this.bulletStore = []
		this.towerStore = []
		this.levelStore = []
		this.enemyStore = []
		
		for (const key of Object.keys(this.assets)) {
			if(this.assets[key]['fileType'] == 'image'){
				this.load.image(key, this.assets[key]['path'])
			}
			else if(this.assets[key]['fileType'] == 'json'){
				this.load.json(key, this.assets[key]['path'])
				switch(this.assets[key]['dataType']){
					case 'bullet':
						this.bulletStore.push(key)
						break;
					case 'tower':
						this.towerStore.push(key)
						break;
					case 'level':
						this.levelStore.push(key)
						break;
					case 'enemy':
						this.enemyStore.push(key)
						break;
					default:
						break;
				}
			}
		}
    }
		
	create ()
    {		
		this.makeDict = function(store, dict){
			for(var i = 0; i < store.length; i++){
				var data = this.cache.json.get(store[i])
				for (const key of Object.keys(data)) {
					dict[key] = data[key]
				}
			}
		}
		
		this.levels = {}
		this.makeDict(this.levelStore, this.levels)
		this.levelList = []
		
		
		for(var key in this.levels){
			this.levelList.push(key)
		}

		this.mapData = this.levels[this.levelList[0]]
		
//dictionary displaying different towers and their stats
		this.towers = {}
		this.makeDict(this.towerStore, this.towers)
		
		this.startTowers = []
		
		for (const key of Object.keys(this.towers)) {
			var keyLength = key.length
			if(key[keyLength-1] == 'a'){
				this.startTowers.push(key)
			}
		}
		
		
		
//dictionary displaying different bullets and their stats				
		this.bullets = {}
		this.makeDict(this.bulletStore, this.bullets)
		
//dictionary displaying different enemies and their stats
		this.enemies = {}
		this.makeDict(this.enemyStore, this.enemies)
    }
	
	update()
	{	
	}
}

export default Resources