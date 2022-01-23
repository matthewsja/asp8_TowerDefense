//CLICK 7 FIRST TO MAKE A PATH
//DONT CLICK 6 WHEN THERE IS NO PATH

//images that when clicked on changes scene
import one from '../assets/1.png'
import two from '../assets/2.png'
import three from '../assets/3.png'
import four from '../assets/4.png'
import five from '../assets/5.png'

//six adds an enemy
//seven makes the path for the enemy
import six from '../assets/6.png'
import seven from '../assets/7.png'

//background image repeated
import grassTile from '../assets/grass.png';

//image of the path that the enemy travels
import pathTile from '../assets/path.png'
//image of the enemy
import enemyTile from '../assets/enemy.png'
//image of where the enemy comes from
import originTile from '../assets/origin.png'
//image of where the enemy head towards
import destTile from '../assets/destination.png'

//background tile
var tile

//buttons for scene changes
var one1;
var two2;
var three3;
var four4;
var five5;

//buttons to add enemy and path
var six6;
var seven7;

//the points of the path
var curve;

//an instance of enemy
var enemy;


//where the enemy comes from
var origin
//where the enemy head towards
var dest
//list of coordinates that help make the path
var pathList = []
//list of tiles used for the path
var tileGroup
//list of enemies
var enemyGroup

class PlayingState extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('playingState');
		Phaser.Scene.call(this,{key: 'playingState'})
		
    }

    preload ()
    {
//background image
        this.load.image('grass', grassTile);
//scene change images
		this.load.image('one', one)
		this.load.image('two', two)
		this.load.image('three', three)
		this.load.image('four', four)
		this.load.image('five', five)
//images to add things
		this.load.image('six', six)
		this.load.image('seven', seven)
//images of the path and enemy
		this.load.image('originTile', originTile)
		this.load.image('destTile', destTile)
		this.load.image('pathTile', pathTile)
		this.load.image('enemy', enemyTile)
		
		
    }
      
    create ()
    {
//ensure that if it fails, nothing bad happens
//ensure that the path path is empty
		try{

			curve = null;
			pathList = []
//			console.log(pathList)

		}
		catch(err){
			console.log(err)
		}
//make the tiled background
		var container = this.add.container(400, 300)	

      	tile = this.add.tileSprite(0 , 0, 800, 600, 'grass')
		container.add(tile);
//make the buttons that change scenes
		one1 = this.add.image(50, 50, 'one').setInteractive()
		two2 = this.add.image(150, 50, 'two').setInteractive()
		three3 = this.add.image(250, 50, 'three').setInteractive()
		four4 = this.add.image(350, 50, 'four').setInteractive()
		five5 = this.add.image(450, 50, 'five').setInteractive()
//make the buttons that add things
		six6 = this.add.image(50, 150, 'six').setInteractive()
		seven7 = this.add.image(150, 150, 'seven').setInteractive()
		
//make the scene change buttons do as required
		one1.on('pointerdown', function () {
			console.log('change states1')
			this.scene.scene.start('menuState')
		})
		
		two2.on('pointerdown', function () {
			console.log('change states2')
			this.scene.scene.start('levelState')
		})
		
		three3.on('pointerdown', function () {
			console.log('change states3')
			this.scene.scene.start('playingState')
		})
		
		four4.on('pointerdown', function () {
			console.log('change states4')
			this.scene.scene.start('completeState')
		})
		
		five5.on('pointerdown', function () {
			console.log('change states5')
			this.scene.scene.start('overState')
		})
		

//generate the coordinates for the path	
		var start = [0, 600];
				
		pathList.push([0, 500])
		pathList.push([0, 400])
		pathList.push([100, 400])
		pathList.push([100, 500])
		pathList.push([200, 500])
		pathList.push([200, 400])
		pathList.push([200, 300])
		pathList.push([300, 300])
		pathList.push([400, 300])
		pathList.push([500, 300])
		pathList.push([600, 300])
		pathList.push([700, 300])
		pathList.push([800, 300])
		
//makes the 7 button do as required
		seven7.on('pointerdown', function(){
//set the origin
			origin = this.scene.add.image(start[0], start[1], 'originTile')
//ensure that nothing bad happens if it fails
//remove the previous instance of the path
			try{

				destTile.destroy()
				curve.destroy()
			}
			catch(err){
				console.log(err)
			}
			finally{
				console.log('path added')
				curve = new Phaser.Curves.Path(start[0], start[1]);
			}


//the list of tiles used in the path
			tileGroup = this.scene.add.group()
//iterate over coordinates
			for(var i = 0; i < pathList.length; i ++){
//adds the coordinates to the curve
				curve.lineTo(pathList[i][0], pathList[i][1])
//if the coordinate is not the last one, make the tile a normal path tile
				if(i < pathList.length-1){
					tileGroup.create(pathList[i][0], pathList[i][1], 'pathTile')
				}
//if the coordinate is the last one, make it the destination tile
//enable physics for this tile so it could be interacted with
				else{
					dest = this.scene.physics.add.image(pathList[i][0], pathList[i][1], 'destTile')
				}
			}
		})
		
//list of enemies that have physics enabled
		enemyGroup = this.physics.add.group()
//make the 6 button do as required
		six6.on('pointerdown', function(){
//say that an enemy has been added
			console.log('add enemy')
//make a follower at the specific point
			var enemy = new Phaser.GameObjects.PathFollower(this.scene, curve, 0, 600, 'enemy')
//add the follower to the list of enemies, physics enabled
			enemyGroup.add(enemy, this.scene)
//state the number of objects in the enemy list
			console.log(enemyGroup.getLength())
//make the enemy follow the specific path at a specific speed
			enemy.startFollow({
				duration: 2000,
				yoyo: false,
				repeat: 0,
				rotateToPath: false,
				verticalAdjust: false,
    		});
//check if the enemy has reached the destination
//if it has reached, remove the enemy from the list and say that the enemy has been removed
			this.scene.physics.add.overlap(enemy, dest, function(){
				enemy.destroy()
				console.log('remove enemy')
				console.log(enemyGroup.getLength())	
			})
		})
		
		

    }
	
	update()
	{
	}

}

export default PlayingState