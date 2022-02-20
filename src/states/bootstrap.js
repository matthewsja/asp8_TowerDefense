import Phaser from 'phaser';
import AudioManager, { MUSIC } from '../audiomanager/audioManager.js';

const MIN_DISPLAY_TIME = 2000; // in milliseconds

const LOADING_BOX_LEFT = 240;
const LOADING_BOX_TOP = 460;
const LOADING_BOX_RIGHT = 320;
const LOADING_BOX_HEIGHT = 50;

const LOADING_PADDING = 10;

const LOADING_BAR_LEFT = LOADING_BOX_LEFT + LOADING_PADDING;
const LOADING_BAR_TOP = LOADING_BOX_TOP + LOADING_PADDING;
const LOADING_BAR_RIGHT = LOADING_BOX_RIGHT - LOADING_PADDING * 2;
const LOADING_BAR_HEIGHT = LOADING_BOX_HEIGHT - LOADING_PADDING * 2;

export default class Bootstrap extends Phaser.Scene
{
    constructor ()
    {
        super('bootstrapState');
        this.audioManager = new AudioManager();
        this._elapsedTime = 0;
        this._loaded = false;
        this._progressBar = undefined;
        this._progressBox = undefined;
    }

    preload ()
    {
        this.audioManager.init(this.sound);

        this._progressBar = this.add.graphics();
        this._progressBox = this.add.graphics();

        this._progressBox.fillStyle(0x222222, 0.8);
        this._progressBox.fillRect(LOADING_BOX_LEFT, LOADING_BOX_TOP, LOADING_BOX_RIGHT, LOADING_BOX_HEIGHT);

        this.load.on('progress', value => {
            this._progressBar.clear();
            this._progressBar.fillStyle(0xffffff, 1);
            this._progressBar.fillRect(LOADING_BAR_LEFT, LOADING_BAR_TOP, LOADING_BAR_RIGHT * value, LOADING_BAR_HEIGHT);
        });

        this.load.on('complete', () => {
            this._loaded = true;
        });

        this.load.image('logo', './src/assets/images/main_logo.png');
        this.audioManager.preload(this.load)
    }

    create ()
    {
        this.add.image(400, 250, "logo");
		
		this.scene.launch('resources')
		this.scene.launch('gameRecords')
		this.scene.launch('mapLogic')
		this.scene.launch('hudLogic')
    }

    update(time, delta) {
        if (this._loaded && this._elapsedTime > MIN_DISPLAY_TIME)
        {
            this._switchScenes();
        }
        this._elapsedTime += delta;
    }

    _switchScenes() {
        console.log('Loading Complete... Switching to Menu State');
        this._progressBox.destroy();
        this._progressBar.destroy();
        this.scene.stop('bootstrapState');
        this.scene.start('menuState');
        AudioManager.playMusic(MUSIC.MAIN);
    }
}