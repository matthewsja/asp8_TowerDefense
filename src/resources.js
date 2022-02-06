import one from './assets/1.png'
import two from './assets/2.png'

import three from './assets/3.png'
import four from './assets/4.png'

import six from './assets/6.png'
import seven from './assets/7.png'


import tower1a from './assets/tower1a.png'
import tower2a from './assets/tower2a.png'

import tower1b from './assets/tower1b.png'
import tower2b from './assets/tower2b.png'

import resume from './assets/resume.png'
import restart from './assets/restart.png'
import menu from './assets/menu.png'

import red from './assets/red_square.png'
import blue from './assets/blue_square.png'

import cross from './assets/x.png'

import circle from './assets/circle.png'

//image of the path that the enemy travels
import pathTile from './assets/path.png'
//image of the enemy
import enemy1 from './assets/enemy1.png'
import enemy2 from './assets/enemy2.png'

//image of where the enemy comes from
import originTile from './assets/origin.png'
//image of where the enemy head towards
import destTile from './assets/destination.png'

//image of the bullet
import bullet1 from './assets/bullet1.png'
import bullet2 from './assets/bullet2.png'

import siteTile from './assets/site.png'

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
		
		this.load.image('originTile', originTile)
		this.load.image('destTile', destTile)
		this.load.image('pathTile', pathTile)
		this.load.image('enemy1', enemy1)
		this.load.image('enemy2', enemy2)
		
		this.load.image('bullet1', bullet1)
		this.load.image('bullet2', bullet2)	

		this.load.image('site', siteTile)
    }
      
    create ()
    {
		var resources = this.scene.get('resources')
		var gameStats = this.scene.get('gameStats')
		
		
		this.startTowers = ['resources.tower1a', 'resources.tower2a']
		
		this.tower1a = {
			id: 'tower_1a',
			image: 'tower1a',
			bulletKey: 'resources.bullet1a',
			range: 200,
			speed: 2,
			cost: 5,
			upgradeKey: 'resources.tower1b'
		}
		
		this.tower1b = {
			id: 'tower_1b',
			image: 'tower1b',
			bulletKey: 'resources.bullet1a',
			range: 250,
			speed: 3,
			cost: 7,
			upgradeKey: null
		}
		
		this.tower2a = {
			id: 'tower_2a',
			image: 'tower2a',
			bulletKey: 'resources.bullet2a',
			range: 300,
			speed: 1,
			cost: 7,
			upgradeKey: 'resources.tower2b'
		}
		
		this.tower2b = {
			id: 'tower_2b',
			image: 'tower2b',
			bulletKey: 'resources.bullet2a',
			range: 350,
			speed: 1.5,
			cost: 10,
			upgradeKey: null
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
		
//coordinates for the building sites		
		this.siteList = [
			[350, 450],
			[250, 350],
			[350, 350],
			[150, 550]
		]
		

		this.startParam = {
			lives: 20,
			money: 10,
			monsters: 50,
			score: 0,
			speedSetting: 1,
			isPlaying: true
		}
		
		this.waveData = [
			['resources.enemy1', 0.5, 10],
			['resources.enemy2', 0.7, 7]
		]
    }
	
	update()
	{	
	}
}

export default Resources