class CheckJSON extends Phaser.Scene
{
	constructor ()
    {
//the scene changes to this one when this keyword is used
        super('checkJSON');	
	}
	preload()
	{
	}
	create(){
//these allow usage of attributes and functions from other scenes
		var resources = this.scene.get('resources')
		var checkJSON = this.scene.get('checkJSON')
		
//this function checks that every relevant value of a given dictionary is the right data type
//takes in as parameters 1)the dictionary to check and 2)a key for another dictionary
//the second dictionary contains the data types for all the relevant values for any dictionary used in the game but only those covered by the key are checked
		this.checkDict = function(dict, keys){
//this variable will become the dictionary through which the values will be checked
			var checkKeys = resources.keys[keys]

//iterate over all relevant keys
//if any of these conditions fail, then a message is printed to the console that the a data type is wrong, what the dictionary where the wrong data is, which key is wrong and how it is wrong
//the function also prematurely returns a false indicating to the function that calls it that this dictionary failed
			for (const key of Object.keys(checkKeys)){
//a switch is used as the value type are discrete
				switch(checkKeys[key]){	
//in the case we have a nested dictionary, this will check that there is an inner dictionary at this key
					case 'dictionary':
//JavaScript lists dictionaries in the broad umbrella of 'object' which is quite vague
//if this fails, then the dictionary is rejected
						if(typeof dict[key] != 'object'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not an object')
							return false
						}
//if the value is an object then try to make a list of all the keys of this object
//only possible if the object is a dictionary
						else{
//make an empty list
							var keyList = []
//iterate over all the keys
//if there are no keys, no error messages occur so the object not being a dictionary won't be detected be default
							for (const k of Object.keys(dict[key])){
//add the key to the list
								keyList.push(k)
							}
//if there are no keys due to the object not being a dictionary, then the entire dictionary is rejected
							if(!keyList.length){
								console.log('something wrong with')
								console.log(dict)
								console.log(key)
								console.log('not a dictionary')
								return false
							}
						}
						break;
					
						
//JavaScript can detect if a variable is a string so this only asks if the value is a string
					case 'string':
						if(typeof dict[key] != 'string'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not a string')
							return false
						}
						break;
						
//Javascript can detect if a variable is a number so this only asks if the value is a number
//a float is just a subset of all numbers, one that can have a decimal place
					case 'float':
						if(typeof dict[key] != 'number'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not a number')
							return false
						}
						break;
					
//JavaScript can detect if a variable is a number so this asks if the value is a number
					case 'integer':
						if(typeof dict[key] != 'number'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not a number')
							return false
						}
//in the case that it is a number, this will ask if this number could be divided by one with no remainders
//no integer if divided by one should have a remainder
						if(dict[key] % 1 != 0){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not an integer')
							return false
						}
						break;
						
//JavaScript can detect if a variable is a boolean so this asks if the value is a boolean
					case 'boolean':
						if(typeof dict[key] != 'boolean'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not a boolean')
							return false	
						}
						break;
						
//in this case, the value could either be a string or there is no value ie null
//JavaScript can detect if a variable is a string or null so this asks if this is either data type
					case 'condictionalString':
						if(typeof dict[key] != 'string' && typeof dict[key] != null){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not a string or null')
							return false
						}
						break;
						
//JavaScript lists arrays in the broad umbrella of 'object' which is quite vague
//this will first ask if it is an object at all
					case 'array':
						if(typeof dict[key] != 'object'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not an object')
							return false
						}
//if it is an object, then it will first try to access element at the first index
//if it can't access this element, then it is not an array
						if(!dict[key][0]){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not an array')
							return false
						}
						
						break;

//JavaScript lists nested arrays in the broad umbrella of 'object' which is quite vague
//this will first ask if it is an object at all
					case 'nestedArray':
						if(typeof dict[key] != 'object'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not an object')
							return false
						}
//if it is an object, then it will first try to access element at the first index
//if it can't access this element, then it is not an array
						if(typeof dict[key][0] != 'object'){
							console.log('something wrong with')
							console.log(dict)
							console.log(key)
							console.log('not a nested array')
							return false
						}
//as this check is used to determine the validity of a tile map, all the inner arrays should be the same length
//if they are all the same length, then getting the length of the first element should be enough to check on all of them
//the tile map still runs fine if the lengths of the inner arrays are not the same size but this enforces the standard of only allowing the map to be rectangular
						var arraySize = dict[key][0].length
						for(var i = 0; i < dict[key].length; i++){
//this compares the length of the current array with the length of the first array
//if they don't match, then the dictionary is invalid
							if(dict[key][i].length != arraySize){
								console.log('something wrong with')
								console.log(dict)
								console.log(key)
								console.log('inner arrays not same size')
								return false
							}
							
//this checks if every element is an integer
//this means iterating over all elements of the tile map
							for(var j = 0; j < arraySize; j++){
//the first part to check is whether the element is a number
								if(typeof dict[key][i][j] != 'number'){
									console.log('something wrong with')
									console.log(dict)
									console.log(key)
									console.log('not a number')
									return false
								}
//the next part is to check whether it is also an integer
//the tile map still runs fine if the values are not strictly integers as Phaser only reads the integer portions of the tile map but this enforces the standard of only allowing integers
								if(dict[key][i][j] % 1 != 0){
									console.log('something wrong with')
									console.log(dict)
									console.log(key)
									console.log('not an integer')
									return false
								}
							}
						}
						break;
						
					default:
						break;
				}		
			}
//if the dictionary passes all tests, then it passes and is a valid dictionary to use for the game
			return true
		}
		
		
//this function is used specifically for checking the inner arrays of the level dictionaries
//takes in as parameters 1)the dictionary to add the data to, 2)the dictionary containing all the data to check and 3)the key of the dictionary to check
		this.checkLevel = function(dict, data, key){
//by default, all dictionaries pass therefore may be added to the larger level dictionary
//if any of the tests fail a test, then it will not be added to the larger level dictionary
			var pass = true
//this is a list of the keys of all the inner dictionaries
			var keyList = ['selection', 'startParams', 'enemyWaves', 'map']
//iterate over the list
			for(var i = 0; i < keyList.length; i++){
//the check every inner dictionary to see if they pass
				if(!checkJSON.checkDict(data[key][keyList[i]], keyList[i])){
//if it fails anything, the entire dictionary fails
					pass = false
				}
			}
			
//next all the waves are checked
//the data for the enemy waves is in the form of a list of dictionaries, so each dictionary has to be checked
//the code is a bit verbose, this shortens it for later use
			var waves = data[key]['enemyWaves']['waves']
//this iterated over all waves
			for(var i = 0; i < waves.length; i++){
//the dictionaries will be passed on to the function that checks dictionary value types
				if(!checkJSON.checkDict(waves[i], 'wave')){
//if it fails anything, the entire dictionary fails
					pass = false
				}
			}
//if it manages to avoid failing any tests, then it passes and is able to be added to the greater dictionary
			if(pass){
				dict[key] = data[key]
			}
//if it fails any test, then a message is printed on the console
			else{
				console.log('loading failed')
				console.log('')
			}
		}
	}
}

export default CheckJSON