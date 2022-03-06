class Resources extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('resources');	
	}

    preload ()
    {
//the dictionary holding almost all the asset names, their file types and their URL's
//the method on how to export the dictionary to an external file to be read has not been developed yet
		this.assets = {
//these are image files which may or may not show up in the game itself
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
			'tower5a': {
				fileType: 'image',
				path:'src/assets/images/tower5a.png'
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
			///////////////////////////////////////////////////////////////////////
			// below several are added by XYu on Mar2: 
			'level_completion':{
				fileType: 'image',
				path:'src/assets/images/level_completion.png'
			}, 
			'background_jungle':{
				fileType: 'image', 
				path:'src/assets/images/background_jungle.png'
			}, 
			'jungle02':{
				fileType: 'image', 
				path:'src/assets/images/jungle02.png'
			}, 
			'treasure_bg':{
				fileType: 'image', 
				path:'src/assets/images/treasure_box_full.png'
			},   //added Mar 5
			'embrace_bg':{
				fileType: 'image', 
				path:'src/assets/images/embrace_full.png'
			},
			'level_selection_bar':{
				fileType: 'image', 
				path:'src/assets/images/level_selection.png'
			},

			////////////////////////////////////////////////////////////////////////


//the dictionary of the keys and expected value types that the main data files should contain
			'keys':{
				fileType: 'json',
				dataType: 'keys',
				path: 'src/assets/json/keys.json'
			},
			
//these are the files of the bullets that the towers will shoot to hit the enemies
			'bulletD0':{
				fileType: 'json',
				dataType: 'bullet',
				path:'src/assets/json/bullets/0.json'
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
		
//these are the files of the towers that the player would build to defend from the enemies
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
			'towerD7':{
				fileType: 'json',
				dataType: 'tower',
				path:'src/assets/json/towers/7.json'
			},
		
//these are the files of the enemies that would try to head towards the destination and the player has to defend against
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
			'levelD0':{
				fileType: 'json',
				dataType: 'level',
				path:'src/assets/json/levels/0.json'
			},
			
//these are the files of the levels
//contains what is displayed in the selections screen for it, the starting parameters of the level, the map and the waves of enemies
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
				
//these arrays store all the names of the main JSON files so they could be referred to later
		this.bulletStore = []
		this.towerStore = []
		this.levelStore = []
		this.enemyStore = []
		
//this loads every file from the assets dictionary
//this iterates over all the keys in the dictionary to get an inner dictionary
//this reads the 'fileType' value of the inner dicationary to determine if this assets is an image or JSON file
		for (const key of Object.keys(this.assets)) {
			if(this.assets[key]['fileType'] == 'image'){
//code to load images from https://learn.yorkcs.com/2019/09/27/phaser-3-basics-loading-images/
				this.load.image(key, this.assets[key]['path'])
			}
			else if(this.assets[key]['fileType'] == 'json'){
//code to load json files from https://phaser.io/examples/v3/view/cache/json-file#
				this.load.json(key, this.assets[key]['path'])
//in the case that it is a JSON file, the files are further categorised based on what part of the game the files is for
//a switch is used as the values are discrete
//in most cases, the name that would be used to get the data is added to their respective arrays
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
					case 'keys':
						break;
					default:
						break;
				}
			}
		}
    }
		
	create ()
    {	
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var checkJSON = this.scene.get('checkJSON')

//dictionary containing what the data types of all the data from the JSON files should be
		this.keys = this.cache.json.get('keys')
		
//this function checkes all relevant JSON data such that they all key value pairs are the correct data type, then if the data passes, store them in a dictionary
//takes in as paramaters 1)the list of names to look for, 2)the dictionary in which to store the JSON data, 3)the key to find the dictionary of what the data types should be and 4)whether the data is level data
		this.makeDict = function(
			store,
		  	dict,
			keys,
			levels = false
		){
//iterate over all the given names
			for(var i = 0; i < store.length; i++){
//get the data based on the name and store it in a temporary variable
				var data = this.cache.json.get(store[i])
//even though this does iterate, there should only be one key value pair to iterate
//the purpose of this is to extract the key for later use which would be used as a unique identifier
				for (const key of Object.keys(data)) {
//the real dictionary is extracted and all values are checked for being the correct data type
					if(checkJSON.checkDict(data[key], keys)){
//in the event that it passes and it is level data, then it is further processed
						if(levels){
							checkJSON.checkLevel(dict, data, key)
						}
//if it passes and is not level data, then it is added to the dictionary using the extracted key as the key in the new dictionary
						else{
							dict[key] = data[key]
						}
					}
//if it fails then a message is printed on the console
					else{
						console.log('loading failed')
						console.log('')
					}
					
				}
			}
		}
		
//empty for dictionary to storing the level data
		this.levels = {}
//call the function to check all the level data dictionaries and if they are valid, add them to the level dictionary
		this.makeDict(
			this.levelStore, 
			this.levels, 
			'level', 
			true
		)

//list which would contain all the keys to the valid levels in the level dictionaries
		this.levelList = []
//add all the keys to the list
		for(var key in this.levels){
			this.levelList.push(key)
		}
//the default map to play would be the first one on the list
//should not be needed but here in case a bug occurs that allows someone to skip the level selection state
		this.mapData = this.levels[this.levelList[0]]
		
		
//dictionary for storing different towers and their stats
		this.towers = {}
//call the function to check all the tower data dictionaries and if they are valid, add them to the tower dictionary
		this.makeDict(
			this.towerStore, 
			this.towers, 
			'tower'
		)
		
//list which would contain the keys to the starting tower in the tower dictionary
		this.startTowers = []		
//the starting towers are found by their names all of them ending with the letter 'a'
		for (const key of Object.keys(this.towers)) {
			var keyLength = key.length
			if(key[keyLength-1] == 'a'){
				this.startTowers.push(key)
			}
		}
		
		
//dictionary for storing different bullets and their stats				
		this.bullets = {}
//call the function to check all the bullet data dictionaries and if they are valid, add them to the bullet dictionary
		this.makeDict(
			this.bulletStore, 
			this.bullets, 
			'bullet'
		)
		
		
//dictionary for storing different enemies and their stats
		this.enemies = {}
//call the function to check all the enemy data and if they are valid, add them to the enemy dictionary
		this.makeDict(
			this.enemyStore, 
			this.enemies, 
			'enemy'
		)
		
    }
	
	update()
	{	
	}
}

export default Resources