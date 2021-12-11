let windowSize = cc.winSize;

let NodeBezierTo = function (node, starPos, endPos, callFunc) {
    let x = (endPos.x + starPos.x) / 2;
    let hight = starPos.y > endPos.y ? starPos.y : endPos.y;

    let bezier = [starPos, new cc.Vec2(x, hight + 240), endPos];
    let ani = cc.sequence(cc.bezierTo(1, bezier), cc.callFunc(() => {
        if (node && callFunc) {
            callFunc();
        }
    }));
    node.runAction(ani);
}


export default {
    NodeBezierTo

}