const { ccclass, property } = cc._decorator;
import gameData from "../gameData"
@ccclass
export default class floor extends cc.Component {
    pos: cc.Vec2;
    type: number;
    @property(cc.Prefab)
    maskNode: cc.Prefab = null;

    @property(cc.SpriteFrame)
    doorIcon: cc.SpriteFrame = null;


    cleanMask: boolean = false;
    mask: cc.Node;
    isDoor: boolean = false;

    start() {
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            let event = new cc.Event.EventCustom(gameData.EventType.tarClick, true);
            event.setUserData(this);
            this.node.dispatchEvent(event);
        }, this)
    }

    /** 当前地板设置为出口 */
    setDoor() {
        this.isDoor = true;
        this.node.getComponent(cc.Sprite).spriteFrame = this.doorIcon;
        if (this.type == gameData.floorType.leftFloor) {
            this.node.scaleX = -1;
        }
    }

    initData(pos, type) {
        this.pos = pos;
        this.type = type;
        if (type == gameData.floorType.rightFloor) {
            let mask = cc.instantiate(this.maskNode);
            this.node.addChild(mask);
            this.mask = mask;
        }
    }

    cleanTheMask(bool: boolean, call) {
        if (bool) {
            if (!this.cleanMask) {
                this.cleanMask = bool;
                this.lightUp(true);
                call(true);
            } else {
                call(false);
            }
        }
    }

    lightUp(bool: boolean) {
        if (this.cleanMask) {
            if (this.mask) {
                this.mask.opacity = 255;
                let ani = cc.sequence(cc.fadeOut(1), cc.callFunc(() => {
                    this.mask.destroy();
                }));
                this.mask.runAction(ani);
            }
            return;
        }

        if (bool) {
            if (!this.mask) {
                let mask = cc.instantiate(this.maskNode);
                this.node.addChild(mask);
                this.mask = mask;
            } else {
                this.mask.active = true;
            }
            this.mask.opacity = 0;
            let ani = cc.fadeIn(0.3);
            this.mask.runAction(ani);
        } else {
            if (this.mask) {
                this.mask.opacity = 255;
                let ani = cc.fadeOut(0.3);
                this.mask.runAction(ani);
            }
        }
    }

    // update (dt) {}
}
