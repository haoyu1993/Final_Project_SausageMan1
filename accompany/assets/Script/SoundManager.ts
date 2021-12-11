const { ccclass, property } = cc._decorator;

enum soundEffType {
    click = 0,
    momSkill = 1,
}

export {
    soundEffType
}

@ccclass
export default class SoundManager extends cc.Component {

    @property({type: cc.AudioClip})
    bgMusic: cc.AudioClip = null;

    @property({type: cc.AudioClip})
    soundEffArr: Array<cc.AudioClip> = [];

    onLoad(){ 
        cc.game.addPersistRootNode(this.node);

    }

    start() {
        setTimeout(() => {
            cc.audioEngine.stopMusic();
            cc.audioEngine.playMusic(this.bgMusic, true);
        }, 700);
    }

    playSoundEff(type: soundEffType) {
        let sound = this.soundEffArr[type];
        if (sound)
            cc.audioEngine.playEffect(sound, false);
    }


    stopAllSound(){
        cc.audioEngine.stopAllEffects();
    }
    // update (dt) {}
}
