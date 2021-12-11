// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class loadingScene extends cc.Component {

    @property(cc.Node)
    logo: cc.Node = null;
    @property(cc.Node)
    flash: cc.Node = null

    start() {
        cc.debug.setDisplayStats(false);
        setTimeout(() => {
            let ani = cc.fadeIn(1);
            this.logo.runAction(ani);

            let ani2 = cc.fadeOut(0.8);
            this.flash.runAction(ani2);
            setTimeout(() => {
                cc.director.loadScene("loadScene")
            }, 1500);
        }, 1200);
    }

    // update (dt) {}
}
