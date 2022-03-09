import { assert } from 'chai';
import sinon from 'sinon';
import { createMockScene, createMockSceneManager } from './stateTestUtils.mjs';

import {launchScenes} from '../src/states/bootstrapLogic.mjs';

describe('Bootstrap State Tests', function() {

    
    it('create() check all scenes are launched', function() {
        let mockSceneManager = createMockSceneManager();
        launchScenes(mockSceneManager);

        sinon.assert.calledWithExactly(mockSceneManager.launch, 'resources');
        sinon.assert.calledWithExactly(mockSceneManager.launch, 'checkJSON');
        sinon.assert.calledWithExactly(mockSceneManager.launch, 'gameRecords');
        sinon.assert.calledWithExactly(mockSceneManager.launch, 'mapLogic');
        sinon.assert.calledWithExactly(mockSceneManager.launch, 'mapLogicEnemy');
        sinon.assert.calledWithExactly(mockSceneManager.launch, 'mapLogicTower');
        sinon.assert.calledWithExactly(mockSceneManager.launch, 'hudLogic');
        sinon.assert.calledWithExactly(mockSceneManager.launch, 'hudLogicTower');

        // create ()
        // {
        //     this.add.image(400, 250, "logo");
            
        //     this.scene.launch('resources')
        //     this.scene.launch('checkJSON')
        //     this.scene.launch('gameRecords')
        //     this.scene.launch('mapLogic')
        //     this.scene.launch('mapLogicEnemy')
        //     this.scene.launch('mapLogicTower')
        //     this.scene.launch('hudLogic')
        //     this.scene.launch('hudLogicTower')
        // }
    
    });
});