import { assert } from 'chai';
import sinon from 'sinon';
import AudioManager from '../src/audiomanager/audioManager.mjs';

// Generates a mock Phaser Sound Manager object
function createPhaserSoundManagerMock() {
  let phaserSoundManager = {
    context: {
      state: 'suspended',
      resume: function() {}
    }
  };
  sinon.stub(phaserSoundManager.context, "resume").callsFake(() => 'mock');
  return phaserSoundManager;
}

// Generates a mock Phaser Loader object.
function createMockPhaserLoader() {
  let phaserLoader = {
    audio: function(keyName, assetPath) {}
  };

  sinon.stub(phaserLoader, "audio").callsFake((keyName, assetPath) => 'mock');
  return phaserLoader;
}

describe('Audio Tests', function() {

  describe('#AudioManager', function() {
    it('Initialize()', function() {
        let audioManager = new AudioManager();
        assert.isObject(AudioManager._instance, 'Audio Manager Instance created successfully');

        let phaserSoundManager = createPhaserSoundManagerMock();

        // ensures that phasers sound manager's resume function is called if the audio is suspended at the initialization of the game.
        audioManager.init(phaserSoundManager);
        sinon.assert.calledOnce(phaserSoundManager.context.resume);
    });


    it('Preload()', function() {
      let audioManager = new AudioManager();
      assert.isObject(AudioManager._instance, 'Audio Manager Instance created successfully');
      let phaserSoundManager = createPhaserSoundManagerMock();
      audioManager.init(phaserSoundManager);

      let mockPreloader = createMockPhaserLoader();
      audioManager.preload(mockPreloader);

      // checks to make sure that the number of audio assets requested to load is at least 2.
      let calls = mockPreloader.audio.getCalls();
      sinon.assert.called(mockPreloader.audio);
      assert.isAtLeast(calls.length, 2);
    });
  });
});