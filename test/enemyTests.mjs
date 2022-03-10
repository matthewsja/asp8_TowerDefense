import { assert } from 'chai';
import sinon from 'sinon';
import Enemy from '../src/map objects/enemy.js';

// Generates a mock Enemy objecy
function createEnemyMock() {
  let testEnemy = {};
  sinon.stub(testEnemy.context, "resume").callsFake(() => 'mock');
  return testEnemy;
}

//Testing structure
describe('Enemy', function() {
    it('Enemy should exist', function() {
        assert.
    });
});

/*
describe ('Enemy', function() {
    //test object
    var testEnemy;
    
    //before each test, initialise a new object to test with
    beforeEach(function() {
        testEnemy = new Enemy();
    });
    
    describe ('#initialisation', function() {
        it('Initialises an enemy, function () {
            
            //I need to assert some created function to check whether the object initialised
            //sinon.assert.calledOnce(phaserSoundManager.context.resume);
        });
    });
});
*/