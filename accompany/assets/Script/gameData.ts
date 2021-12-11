
let GameData = [
    { level: 1, mapSize: "3x3", doorPos: "2,2", hearts: 2, momPos: "0,0", monster: ["2,2"], pickPos: [] },
    { level: 1, mapSize: "3x3", doorPos: "2,2", hearts: 1, momPos: "0,1", monster: ["2,2"], pickPos: ["0,0"] },
    { level: 1, mapSize: "4x4", doorPos: "3,3", hearts: 2, momPos: "0,0", monster: ["3,3"], pickPos: [] },
    { level: 1, mapSize: "5x5", doorPos: "4,4", hearts: 2, momPos: "0,0", monster: ["4,4", "4,3"], pickPos: ["2,2"] },
]

let EventType = {
    crashMonster: "crashMonster",
    entryNextLevel: "entryNextLevel",
    tarClick: "tarClick",
    restartGame: "restartGame",
    nextLevel: "nextLevel"
}

let floorType = {
    leftFloor: 1,
    rightFloor: 2,
}

let SpriteType = {
    Monster: 1,
    Child: 2,
    Mom: 3,
    Heart: 4,
}

let GameState = {
    Stop: 1,
    Gaming: 2,
    Pause: 3,
    gameOver: 4,
}

let gameState = GameState.Stop;

export default {
    GameData,
    EventType,
    SpriteType,
    floorType,
    gameState,
    GameState
}