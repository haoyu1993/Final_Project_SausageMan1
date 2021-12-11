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
export default class monster extends cc.Component {

    pos: cc.Vec2;
    lastPos: cc.Vec2;

    @property(cc.Animation)
    animation: cc.Animation = null;
    start() {
        // this.animation.play("idle");
    }

    initData(pos) {
        this.pos = pos;
    }

    attack(){
        // this.animation.play("attack");
    }

    randomMoving(posArr, callBack) {
        if (posArr.length <= 0)
            return;
        // this.animation.play("walk");
        let random = posArr[Math.floor(Math.random() * posArr.length)];
        if (random) {
            let floor = random.getComponent("floor");
            this.pos = floor.pos;
            // this.animation.play("idle");
            //走动
            callBack(floor.pos);
        }
    }

    // update (dt) {}
}
