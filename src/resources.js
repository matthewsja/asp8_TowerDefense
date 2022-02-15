import one from './assets/images/1.png'
import two from './assets/images/2.png'

import three from './assets/images/3.png'
import four from './assets/images/4.png'

import six from './assets/images/6.png'
import seven from './assets/images/7.png'


import tower1a from './assets/images/tower1a.png'
import tower2a from './assets/images/tower2a.png'

import tower1b from './assets/images/tower1b.png'
import tower2b from './assets/images/tower2b.png'

import resume from './assets/images/resume.png'
import restart from './assets/images/restart.png'
import menu from './assets/images/menu.png'

import red from './assets/images/red_square.png'
import blue from './assets/images/blue_square.png'

import cross from './assets/images/x.png'
import circle from './assets/images/circle.png'
import sell from './assets/images/sell.png'

//image of the enemy
import enemy1 from './assets/images/enemy1.png'
import enemy2 from './assets/images/enemy2.png'

//image of the bullet
import bullet1 from './assets/images/bullet1.png'
import bullet2 from './assets/images/bullet2.png'


import tileset from './assets/images/tileset.png'

import towerData from './assets/json/towers.json'
import bulletData from './assets/json/bullets.json'
import enemyData from './assets/json/enemies.json'

import levelData from './assets/json/levels.json'

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
		this.load.image('one', one)
		this.load.image('two', two)		
		
		this.load.image('three', three)
		this.load.image('four', four)
		
		this.load.image('six', six)
		this.load.image('seven', seven)
		
		this.load.image('tower1a', tower1a)
		this.load.image('tower2a', tower2a)
		
		this.load.image('tower1b', tower1b)
		this.load.image('tower2b', tower2b)
		
		this.load.image('resume', resume)
		this.load.image('restart', restart)
		this.load.image('menu', menu)
		
		this.load.image('red', red)
		this.load.image('blue', blue)
		
		this.load.image('cross', cross)
		this.load.image('circle', circle)
		this.load.image('sell', sell)
		
		this.load.image('enemy1', enemy1)
		this.load.image('enemy2', enemy2)
		
		this.load.image('bullet1', bullet1)
		this.load.image('bullet2', bullet2)	
		
		this.load.image('tileset', tileset)
		
		this.load.json('towerData', towerData);
		this.load.json('bulletData', bulletData)
		this.load.json('enemyData', enemyData)
		this.load.json('levelData', levelData)
    }
      
    create ()
    {
		var resources = this.scene.get('resources')
		
		this.levelSelect = -1
		
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