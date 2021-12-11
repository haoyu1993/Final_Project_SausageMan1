
const { ccclass, property } = cc._decorator;

@ccclass
export default class mom extends cc.Component {

    @property(cc.Animation)
    animation: cc.Animation = null;

    start() {
        this.animation.play("idle");

    }

    attack() {
        this.animation.play("attack");
        this.node.on(cc.Animation.EventType.FINISHED, this.finished, this);
    }

    finished() {
        this.animation.play("idle")
        this.node.off(cc.Animation.EventType.FINISHED, this.finished, this);
    }

    happy(){
        this.animation.play("happy");
    }

    // update (dt) {}
}
