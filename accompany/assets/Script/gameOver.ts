const { ccclass, property } = cc._decorator;
import SoundManager, { soundEffType } from "./SoundManager";

import gameData from "./gameData"
@ccclass
export default class gameOver extends cc.Component {

    @property(cc.Node)
    nextLevelBtn: cc.Node = null;
    @property(cc.Node)
    restartBtn: cc.Node = null;


    @property(cc.Node)
    succNode: cc.Node = null;
    @property(cc.Node)
    faildNode: cc.Node = null;

    soundManger: SoundManager;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        gameData.gameState = gameData.GameState.gameOver;

        this.soundManger = cc.find("rootNode").getComponent("SoundManager");


        this.restartBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.soundManger.playSoundEff(soundEffType.click);

            this.node.destroy();
            let event = new cc.Event.EventCustom(gameData.EventType.restartGame, true);
            this.node.dispatchEvent(event);
        }, this)

        this.nextLevelBtn.on(cc.Node.EventType.TOUCH_END, () => {
            this.node.destroy();
            this.soundManger.playSoundEff(soundEffType.click);


            let event = new cc.Event.EventCustom(gameData.EventType.nextLevel, true);
            this.node.dispatchEvent(event);
        }, this)
    }

    setGameOver(bool: boolean) {

        let ani = cc.sequence(cc.scaleTo(0.2, 0.8), cc.scaleTo(0.4, 1.2), cc.scaleTo(0.2, 1));
        if (bool) {
            this.succNode.active = true;
            this.nextLevelBtn.runAction(cc.repeatForever(ani));
        } else {
            this.faildNode.active = true;
            this.restartBtn.runAction(cc.repeatForever(ani));
        }
    }



    // update (dt) {}
}
