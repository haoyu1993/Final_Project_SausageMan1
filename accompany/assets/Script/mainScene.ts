
const { ccclass, property } = cc._decorator;

import gameData from "./gameData";
import monster from "./sprite/monster";
import floor from "./sprite/floor";
import util from "./util"
import SoundManager, { soundEffType } from "./SoundManager"

@ccclass
export default class mainScene extends cc.Component {


    @property(cc.Prefab)
    gameOverPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    floorPrefabArr: Array<cc.Prefab> = [];

    @property(cc.Prefab)
    monsterPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    heartPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    momPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    childPrefab: cc.Prefab = null;
    @property(cc.Prefab)
    skillStarPrefab: cc.Prefab = null;


    @property(cc.Node)
    heartsNode: cc.Node = null;

    @property(cc.Node)
    floorsNodeL: cc.Node = null;
    @property(cc.Node)
    floorsNodeR: cc.Node = null;
    @property(cc.Node)
    restartBtn: cc.Node = null;
    @property(cc.Node)
    clearBtn: cc.Node = null;
    @property(cc.Node)
    topShowView: cc.Node = null;
    @property(cc.Node)
    hideView: cc.Node = null;

    deadTotal: number = 0;
    leftNodeArr = [];
    rightNodeArr = [];
    nowPos = new cc.Vec2();
    child: cc.Node;
    mom: cc.Node;
    lastFloor: cc.Node;
    monsterArr: Array<cc.Node> = [];
    canBeMove: boolean = true;
    hearsNums: number = 0;

    clearState: boolean = false;

    level: number = 1;

    lightOnceArr: Array<cc.Node> = [];
    soundManger: SoundManager;

    start() {

        let root = cc.find("rootNode");
        if (root)
            this.soundManger = root.getComponent("SoundManager");

        cc.debug.setDisplayStats(false);
        this.addListener();
        this.initGameScene(this.level);
    }

    initGameScene(level) {
        this.soundManger.stopAllSound();
        gameData.gameState = gameData.GameState.Stop;
        this.deadTotal = 0;
        this.topShowView.removeAllChildren();
        this.floorsNodeL.removeAllChildren();
        this.floorsNodeR.removeAllChildren();
        this.heartsNode.removeAllChildren();
        this.canBeMove = true;

        this.leftNodeArr = [];
        this.rightNodeArr = [];
        this.monsterArr = [];

        let data = gameData.GameData[level - 1];
        if (!data) {
            level = 1;
            data = gameData.GameData[level - 1]
        }

        this.hearsNums = data.hearts;
        for (let i = 0; i < data.hearts; i++) {
            let heart = cc.instantiate(this.heartPrefab);
            this.heartsNode.addChild(heart);
        }

        this.level = level;
        this.initBackBoard(data.mapSize, data.doorPos.split(","));

        this.initSpritePos(level);
    }

    initSpritePos(level) {
        let data = gameData.GameData[level - 1];
        let monstersData = data.monster;
        for (let item of monstersData) {
            let mons = cc.instantiate(this.monsterPrefab);
            let pos = item.split(",");
            let monsPos = new cc.Vec2(Number(pos[0]), Number(pos[1]));
            mons.getComponent("monster").initData(monsPos);
            mons["type"] = gameData.SpriteType.Monster;
            let tarNode: cc.Node = this.rightNodeArr[monsPos.x][monsPos.y];
            mons.parent = tarNode.children[0];
            tarNode.getComponent("floor").lightUp(false);
            this.lightOnceArr.push(tarNode);
            this.monsterArr.push(mons);
        }

        for (let item of data.pickPos) {
            let pos = item.split(",");
            let ht = cc.instantiate(this.heartPrefab);
            ht["type"] = gameData.SpriteType.Heart;
            this.setSpritePos(ht, new cc.Vec2(Number(pos[0]), Number(pos[1])), this.leftNodeArr);
        }

        let momData = data.momPos;
        let mom = cc.instantiate(this.momPrefab);
        this.mom = mom;
        mom["type"] = gameData.SpriteType.Mom;
        let starPos = momData.split(",");
        this.setSpritePos(mom, new cc.Vec2(Number(starPos[0]), Number(starPos[1])), this.leftNodeArr);
        this.nowPos = new cc.Vec2(Number(starPos[0]), Number(starPos[1]));
        this.lastFloor = this.rightNodeArr[this.nowPos.x][this.nowPos.y];
        this.lastFloor.getComponent("floor").lightUp(false);

        let childData = data.momPos;
        let child = cc.instantiate(this.childPrefab);
        this.child = child;
        child["type"] = gameData.SpriteType.Child;
        this.setSpritePos(child, new cc.Vec2(Number(starPos[0]), Number(starPos[1])), this.rightNodeArr);
    }

    setSpritePos(node: cc.Node, pos: cc.Vec2, nodeArr, call?: Function, bool: boolean = false) {
        let tarNode: cc.Node = nodeArr[pos.x][pos.y];

        if (node.parent) {
            let nodeToPar = node.parent.convertToWorldSpaceAR(node.position);
            node.position = this.topShowView.convertToNodeSpaceAR(nodeToPar);
            if (node["type"] == gameData.SpriteType.Monster) {
                node.parent = this.hideView;
            } else
                node.parent = this.topShowView;

            let nodeToTar = tarNode.parent.convertToWorldSpaceAR(tarNode.position);
            let endPos = this.topShowView.convertToNodeSpaceAR(nodeToTar);

            let ani = cc.sequence(cc.moveTo(0.5, endPos), cc.callFunc(() => {
                node.parent = tarNode.children[0];
                node["pos"] = pos;
                node.x = 0;
                node.y = 0;
                if (call) {
                    call();
                }
            }));
            node.runAction(ani);

        } else {
            node.parent = tarNode.children[0];
            node["pos"] = pos;
            node.x = 0;
            node.y = 0;
            if (call) {
                call();
            }
        }
    }

    getFloorByName(name: string) {
        let prefab: cc.Prefab;
        for (let item of this.floorPrefabArr) {
            if (item.name.indexOf(name) != -1) {
                prefab = item;
                break;
            }
        }
        return prefab;
    }

    initBackBoard(siz: string, doorPos: Array<string>) {
        let size = siz.split("x");
        let floorPrefab = this.getFloorByName(siz);
        if (!floorPrefab || !size[0] || !size[1])
            return;

        ///left
        for (let i = 0; i < Number(size[0]); i++) {
            for (let j = 0; j < Number(size[1]); j++) {
                let track = cc.instantiate(floorPrefab);
                track.getComponent("floor").initData(new cc.Vec2(i, j), gameData.floorType.leftFloor);
                this.floorsNodeL.addChild(track);

                if (i == Number(doorPos[0]) && j == Number(doorPos[1])) {
                    track.getComponent("floor").setDoor();
                }

                if (!this.leftNodeArr[i])
                    this.leftNodeArr[i] = [];
                this.leftNodeArr[i][j] = track;
            }
        }
        ///right
        for (let i = 0; i < Number(size[0]); i++) {
            for (let j = 0; j < Number(size[1]); j++) {
                let track = cc.instantiate(floorPrefab);
                track.getComponent("floor").initData(new cc.Vec2(i, j), gameData.floorType.rightFloor);
                this.floorsNodeR.addChild(track);

                if (i == Number(doorPos[0]) && j == Number(doorPos[1])) {
                    track.getComponent("floor").setDoor();
                }

                if (!this.rightNodeArr[i])
                    this.rightNodeArr[i] = [];
                this.rightNodeArr[i][j] = track;
            }
        }

    }

    getClosedPos(pos: cc.Vec2) {
        let pos1: cc.Vec2;
        let pos2: cc.Vec2;
        if (this.rightNodeArr[pos.x + 1])
            pos1 = this.rightNodeArr[pos.x + 1][pos.y];
        if (this.rightNodeArr[pos.x - 1])
            pos2 = this.rightNodeArr[pos.x - 1][pos.y];
        let pos3 = this.rightNodeArr[pos.x][pos.y + 1];
        let pos4 = this.rightNodeArr[pos.x][pos.y - 1];

        let posArr = [pos1, pos2, pos3, pos4];
        return this.clearArr(posArr);
    }

    /** 返回数组中的非空数值 */
    clearArr(arr) {
        let newArr = [];
        for (let item of arr) {
            if (item)
                newArr.push(item);
        }
        return newArr;
    }

    monsterMove() {
        for (let item of this.monsterArr) {
            let monster: monster = item.getComponent("monster");
            if (monster.pos.x == this.nowPos.x && monster.pos.y == this.nowPos.y) {
                gameData.gameState = gameData.GameState.gameOver;
                monster.attack();
                monster.node.zIndex++;
                this.child.getComponent("child").playerDead();

                setTimeout(() => {

                    let gameOverNode = cc.instantiate(this.gameOverPrefab);
                    gameOverNode.getComponent("gameOver").setGameOver(false);
                    this.topShowView.addChild(gameOverNode);
                }, 1000);
                console.log("game over");
                break;
            }

            monster.randomMoving(this.getClosedPos(monster.pos), (pos) => {
                setTimeout(() => {
                    this.setSpritePos(item, pos, this.rightNodeArr, () => {
                        if (gameData.gameState == gameData.GameState.Gaming) {
                            if (pos.x == this.nowPos.x && pos.y == this.nowPos.y) {
                                gameData.gameState = gameData.GameState.gameOver;
                                setTimeout(() => {
                                    let gameOverNode = cc.instantiate(this.gameOverPrefab);
                                    gameOverNode.getComponent("gameOver").setGameOver(false);
                                    this.topShowView.addChild(gameOverNode);
                                }, 1000);
                                console.log("game over");
                                monster.attack();
                                this.child.getComponent("child").playerDead();
                            }
                            this.canBeMove = true;
                        }
                    });
                }, 350);
            });
        }
    }

    clearMaskAtMonster() {
        let heart = this.heartsNode.children[this.heartsNode.childrenCount - 1];
        if (!heart || !this.canBeMove) {
            return;
        }


        this.canBeMove = false;

        let posToW = heart.parent.convertToWorldSpaceAR(heart.position);
        let posToShow = this.topShowView.convertToNodeSpaceAR(posToW);
        heart.position = posToShow;
        heart.parent = this.topShowView;

        let posToN = this.mom.convertToWorldSpaceAR(this.mom.position);
        let pos = this.topShowView.convertToNodeSpaceAR(posToN);
        this.hearsNums--;

        util.NodeBezierTo(heart, posToShow, pos, () => {
            setTimeout(() => {
                this.soundManger.playSoundEff(soundEffType.momSkill);
            }, 200);

            heart.destroy();
            this.mom.getComponent("mom").attack();
            let monster = this.monsterArr[Math.floor(Math.random() * this.monsterArr.length)];
            if (monster) {
                let skil = cc.instantiate(this.skillStarPrefab);
                this.topShowView.addChild(skil);
                skil.position = pos;
                let Tpos = monster.getComponent("monster").pos;
                let tarFloor = this.rightNodeArr[Tpos.x][Tpos.y];

                let TarPosToW = tarFloor.parent.convertToWorldSpaceAR(tarFloor.position);
                let TarPosToN = this.topShowView.convertToNodeSpaceAR(TarPosToW);

                let ani = cc.sequence(cc.moveTo(1, TarPosToN), cc.callFunc(() => {
                    setTimeout(() => {
                        tarFloor.getComponent("floor").cleanTheMask(true, (bool) => {
                        });
                        skil.destroy();
                    }, 500);
                }))
                skil.runAction(ani);
            }
            this.canBeMove = true;
        });

        // let windowSize = cc.winSize;
        // var bezier = [posToShow, cc.v2(0, windowSize.height / 2), pos];
        // let ani = cc.sequence(cc.bezierTo(1.5, bezier), cc.callFunc(() => {
        //     if (heart) {

        //     }
        // }));
        // heart.runAction(ani);
    }

    getHeart(heart: cc.Node) {
        console.log("捡到心")
        let posToW = heart.parent.convertToWorldSpaceAR(heart.position);
        let posToShow = this.topShowView.convertToNodeSpaceAR(posToW);
        heart.position = posToShow;
        heart.parent = this.topShowView;
        let posToN = this.heartsNode.parent.convertToWorldSpaceAR(this.heartsNode.position);
        let pos = this.topShowView.convertToNodeSpaceAR(posToN);
        pos.x += this.heartsNode.width + 40;
        util.NodeBezierTo(heart, posToShow, pos, () => {
            this.hearsNums++;
            // this.heartsNode.addChild(heart);
            heart.x = 0;
            heart.y = 0;
            heart.parent = this.heartsNode;
        })
    }

    floorClick(floor) {
        if (floor.type == gameData.floorType.rightFloor) {
            return;
        }

        if (Math.abs(floor.pos.x - this.nowPos.x) + Math.abs(floor.pos.y - this.nowPos.y) == 1) {
            this.canBeMove = false;
            if (gameData.gameState == gameData.GameState.Stop) {
                gameData.gameState = gameData.GameState.Gaming;

                if (this.lightOnceArr.length > 0) {
                    for (let item of this.lightOnceArr) {
                        item.getComponent("floor").lightUp(true);
                    }
                    this.lightOnceArr = [];
                }
            }

            this.setSpritePos(this.mom, floor.pos, this.leftNodeArr);
            this.setSpritePos(this.child, floor.pos, this.rightNodeArr, () => {
                if (floor.isDoor && gameData.gameState == gameData.GameState.Gaming) {//成功逃脱
                    gameData.gameState = gameData.GameState.gameOver;
                    this.child.parent = this.mom.parent;

                    this.child.getComponent("child").happy();
                    this.mom.getComponent("mom").happy();

                    setTimeout(() => {
                        console.log("success")
                        // this.initGameScene(this.level);
                        let gameOverNode = cc.instantiate(this.gameOverPrefab);
                        gameOverNode.getComponent("gameOver").setGameOver(true);
                        this.topShowView.addChild(gameOverNode);
                    }, 2000);
                }
            });
            this.nowPos = floor.pos;
            this.lastFloor.getComponent("floor").lightUp(true);
            this.lastFloor = this.rightNodeArr[floor.pos.x][floor.pos.y];
            this.rightNodeArr[floor.pos.x][floor.pos.y].getComponent("floor").lightUp(false);
            this.monsterMove();
            let sprite = floor.node.children[0].children[0];
            if (sprite && sprite["type"] == gameData.SpriteType.Heart) {
                this.getHeart(sprite);
            }

        }
    }

    addListener() {

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, (event: cc.Event.EventKeyboard) => {
            if (!this.canBeMove || gameData.gameState == gameData.GameState.gameOver)
                return;
            switch (event.keyCode) {
                case cc.macro.KEY.space:
                    this.clearMaskAtMonster();
                    break;
                case cc.macro.KEY.d:
                    let floor = this.leftNodeArr[this.nowPos.x][this.nowPos.y + 1];
                    if (floor)
                        this.floorClick(floor.getComponent("floor"));
                    break;
                case cc.macro.KEY.a:
                    let floor2 = this.leftNodeArr[this.nowPos.x][this.nowPos.y - 1];
                    if (floor2)
                        this.floorClick(floor2.getComponent("floor"));
                    break;
                case cc.macro.KEY.s:
                    let floor3;
                    if (this.leftNodeArr[this.nowPos.x - 1])
                        floor3 = this.leftNodeArr[this.nowPos.x - 1][this.nowPos.y];
                    if (floor3)
                        this.floorClick(floor3.getComponent("floor"));
                    break;
                case cc.macro.KEY.w:
                    let floor4;
                    if (this.leftNodeArr[this.nowPos.x + 1])
                        floor4 = this.leftNodeArr[this.nowPos.x + 1][this.nowPos.y];
                    if (floor4)
                        this.floorClick(floor4.getComponent("floor"));
                    break;
                case cc.macro.KEY.r:
                    if (gameData.gameState == gameData.GameState.gameOver)
                        return;

                    this.initGameScene(this.level);
                    break;

            }
        }, this)

        this.node.on(gameData.EventType.tarClick, (event) => {
            if (!this.canBeMove || gameData.gameState == gameData.GameState.gameOver)
                return;
            let floor: floor = event.getUserData();
            this.floorClick(floor);

        }, this);

        this.node.on(gameData.EventType.restartGame, () => {
            this.initGameScene(this.level);
        }, this);

        this.node.on(gameData.EventType.nextLevel, () => {
            this.level++;
            this.initGameScene(this.level);
        }, this);


        this.restartBtn.on(cc.Node.EventType.TOUCH_END, () => {
            if (gameData.gameState == gameData.GameState.gameOver)
                return;

            this.initGameScene(this.level);
        }, this);

        this.clearBtn.on(cc.Node.EventType.TOUCH_END, () => {
            if (gameData.gameState == gameData.GameState.gameOver)
                return;

            this.clearMaskAtMonster();
        }, this);


    }
    // update (dt) {}
}
