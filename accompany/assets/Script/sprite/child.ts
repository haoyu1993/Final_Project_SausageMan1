
const { ccclass, property } = cc._decorator;

@ccclass
export default class child extends cc.Component {

    @property(cc.Node)
    atomNode: cc.Node = null;

    @property(cc.Animation)
    ani: cc.Animation = null;
    start() {

    }

    playerDead() {
        this.atomNode.active = true;
        setTimeout(() => {
            this.atomNode.active = false;
            this.atomNode.active = true;
        }, 2000);
    }

    happy() {
        this.ani.play("happy");
    }

    // update (dt) {}
}
