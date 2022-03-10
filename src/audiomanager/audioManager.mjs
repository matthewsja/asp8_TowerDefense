const SUSPENDED_STATE = 'suspended';

export var SFX = {
    BUTTON_CLICK: Symbol("src/assets/audio/sfx/menu_click.wav"),
}

export var MUSIC = {
    MAIN: Symbol("src/assets/audio/music/main_music.mp3"),
}

export default class AudioManager {
    constructor() {
        if (AudioManager._instance) {
            return AudioManager._instance;
        }
        AudioManager._instance = this;
        return AudioManager._instance;
    }

    init(soundManager) {
        this._soundManager = soundManager;
        
        this._sfxEvents = {};
        this._musicEvents = {};

        this._musicSounds = {};

        this._volume = 1;
        this._musicVolume = 1;
        this._sfxVolume = 1;

        this._currentMusic = undefined;

        if (this._soundManager.context.state === SUSPENDED_STATE) {
            this._soundManager.context.resume();
        }
    }

    preload(loader) {
        let effectKeys =  Object.keys(SFX);
        for (let i = 0; i < effectKeys.length; i++) {
            let effectName = effectKeys[i];
            let eventName = 'SFX_' + effectName;
            let eventSymbol = SFX[effectName];

            this._sfxEvents[eventSymbol] = eventName;
            let assetPath = eventSymbol.description;
            loader.audio(eventName, assetPath);
        }
        
        let musicKeys =  Object.keys(MUSIC);
        for (let i = 0; i < musicKeys.length; i++) {
            let musicName = musicKeys[i];
            let eventName = 'MUSIC_' + musicName;
            let eventSymbol = MUSIC[musicName];

            this._musicEvents[eventSymbol] = eventName;
            let assetPath = eventSymbol.description;
            loader.audio(eventName, assetPath);
        }
    }

    static pause() {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            instance._soundManager.pauseAll();
        }
    }

    static resume() {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            instance._soundManager.resumeAll();
        }
    }

    static stopAll() {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            instance._soundManager.stopAll();
        }
    }
    
    static playMusic(musicEvent) {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            if (instance._currentMusic != undefined) {
                instance._currentMusic.stop();
            }
            
            if (!(musicEvent in instance._musicSounds)) {
                instance._musicSounds[musicEvent] = instance._soundManager.add(instance._musicEvents[musicEvent]);
            }

            instance._currentMusic = instance._musicSounds[musicEvent];
            instance._currentMusic.play({volume: instance._musicVolume, loop: true});
        }
    }

    static stopMusic() {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            if (instance._currentMusic != undefined) {
                instance._currentMusic.stop();
            }
        }
    }

    static playEffect(sfxEvent) {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            instance._soundManager.play(instance._sfxEvents[sfxEvent], {volume: instance._sfxVolume, loop: false});
        }
    }

    static getVolume() {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            return instance._volume;
        }
    }

    static setVolume(volume) {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            instance._soundManager.setVolume(volume);
        }
    }

    static getMusicVolume() {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            return instance._musicVolume;
        }
    }

    static setMusicVolume(musicVolume) {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            instance._musicVolume = musicVolume;
            if (instance._currentMusic != undefined) {
                instance._currentMusic.setVolume(instance._musicVolume);
            }
        }
    }

    static getSfxVolume() {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            return instance._sfxVolume;
        }
    }

    static setSfxVolume(sfxVolume) {
        let instance = AudioManager._getInstance();
        if (instance != undefined) {
            instance._sfxVolume = sfxVolume;
        }
    }

    static _getInstance() {
        if (AudioManager._instance) {
            return AudioManager._instance;
        }
        console.error("AudioManager is unitialized.  Make sure it is created before trying to use.");
        return null;
    }
}