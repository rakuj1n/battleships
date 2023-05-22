/*----- constants -----*/
let SHIP_TYPE_SIZES = {
    destroyer: 2,
    submarine: 3,
    cruiser: 3,
    battleship: 4,
    carrier: 5,
}
let SHIP_VALUES = {
    destroyer: 2,
    submarine: 3.5,
    cruiser: 3,
    battleship: 4,
    carrier: 5,
}
 
let CELL_INDICATOR = {
    //null
    "0": "#DDE6ED",
    //player ships
    "2": "#EFECCA",
    "3.5": "#A9CBB7",
    "3": "#F7FF58",
    "4": "#FF934F",
    "5": "#5E565A",
    //enemy misses
    "10": "#9DB2BF",
    //player got hit
    "12": "#FF0000",
    "13.5": "#FF0000",
    "13": "#FF0000",
    "14": "#FF0000",
    "15": "#FF0000",
    //enemy ships (hidden)
    "-2": "#DDE6ED",
    "-3.5": "#DDE6ED",
    "-3": "#DDE6ED",
    "-4": "#DDE6ED",
    "-5": "#DDE6ED",
    //player misses
    "-10": "#9DB2BF",
    //enemy got hit
    "-12": "#FF0000",
    "-13.5": "#FF0000",
    "-13": "#FF0000",
    "-14": "#FF0000",
    "-15": "#FF0000",
}


/*----- state variables -----*/
let game = {
  turn: "player", //player, enemy
  winner: null, //enemy, player
  screen: "", //startscreen, setupscreen, gamescreen
  setupBoard:[
    [0,0,0,0,0,0,0,0,0,0], //r0 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r1 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r2 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r3 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r4 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r5 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r6 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r7 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r8 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
  ],
  enemyBoard: [
    [0,0,0,0,0,0,0,0,0,0], //r0 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r1 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r2 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r3 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r4 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r5 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r6 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r7 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r8 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
  ],
  playerBoard: [
    [0,0,0,0,0,0,0,0,0,0], //r0 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r1 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r2 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r3 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r4 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r5 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r6 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r7 c0-c9
    [0,0,0,0,0,0,0,0,0,0], //r8 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
  ],
}
let username = ""

let enemy = {} //stores ship type as key and its indexes on gameboard as values in array
let player = {}

let setupCurrSelectedShip = "destroyer" // "destroyer", "cruiser" etc
let setupOrientation = "v" // v or h

let availableShipTypesToPlace = ["destroyer","submarine","cruiser","battleship","carrier"]

let setupErrorMessage = ""

let enemyAttackLog = {}

/*----- cached elements  -----*/
let startScreen = document.querySelector("#startscreen")
let setupScreen = document.querySelector("#playersetup")
let gameScreen = document.querySelector("#game")
let playButton = document.querySelector("#startbutton")
let setupDestroyerButton = document.querySelector("#destroyer")
let setupSubmarineButton = document.querySelector("#submarine")
let setupCruiserButton = document.querySelector("#cruiser")
let setupBattleshipButton = document.querySelector("#battleship")
let setupCarrierButton = document.querySelector("#carrier")
let toggleOrientationButton = document.querySelector("#toggleOrientation")
let deployButton = document.querySelector("#deployButton")
let setupErrorMessageField = document.querySelector("#errorMessage")
let usernameField = document.querySelector("#username")
let resetButton = document.querySelector("#resetButton")
let playAgainButton = document.querySelector("#playAgainButton")

/*----- event listeners -----*/
setupDestroyerButton.addEventListener("click",toggleDestroyer)
setupSubmarineButton.addEventListener("click",toggleSubmarine)
setupCruiserButton.addEventListener("click",toggleCruiser)
setupBattleshipButton.addEventListener("click",toggleBattleship)
setupCarrierButton.addEventListener("click",toggleCarrier)
toggleOrientationButton.addEventListener("click",toggleOrientation)
deployButton.addEventListener("click",handleToGame)
playButton.addEventListener("click",handleToSetup)
resetButton.addEventListener("click",handleSetupReset)
playAgainButton.addEventListener("click",handlePlayAgain)

//event listeners functions for board tiles
function createSetupPlacementLensListeners() {
    for (let row = 0;row < game.setupBoard.length; row++) {
        for (let col = 0;col<game.setupBoard[0].length;col++ ) {
                document.querySelector(`#gridsetup>#r${row}c${col}`).addEventListener("mouseover",renderPlacementLens)
        }
    }
}
function createSetupPlacementLensListeners2() {
    for (let row = 0;row < game.setupBoard.length; row++) {
        for (let col = 0;col<game.setupBoard[0].length;col++ ) {
                document.querySelector(`#gridsetup>#r${row}c${col}`).addEventListener("mouseout",removePlacementLens)
        }
    }
}

function createSetupEventList() {
    for (let row = 0;row < game.setupBoard.length; row++) {
        for (let col = 0;col<game.setupBoard[0].length;col++ ) {
                document.querySelector(`#gridsetup>#r${row}c${col}`).addEventListener("click",handlePlaceShip)
        }
    }
}

function createAttackEnemyEventList() {
    for (let row = 0;row < game.enemyBoard.length; row++) {
        for (let col = 0;col<game.enemyBoard[0].length;col++ ) {
                document.querySelector(`#gridenemy>#r${row}c${col}`).addEventListener("click",handleAttack)
        }
    }
}


/*----- functions -----*/
function init() {
    game.screen = "startscreen"
    createBoard("#gridsetup")
    createBoard("#gridenemy")
    createBoard("#gridplayer")
    createSetupEventList()
    createSetupPlacementLensListeners()
    createSetupPlacementLensListeners2()
    createAttackEnemyEventList()
    render()
    console.log(game)
    console.log(enemy)
    console.log(player)
}


function createBoard(gridId) {
    for (let row = 0; row < 10; row++) {
        let rowId = `r`+ row
        for (let col = 0; col < 10; col++) {
            let id = rowId + `c` + col
            let div = document.createElement("div")
            div.setAttribute("id",id)
            let grid = document.querySelector(gridId)
            grid.append(div)
        }
    }
}

function handlePlayAgain() {
    game.screen = "startscreen"
    game.turn = "player"
    game.winner = null, //enemy, player
    game.setupBoard = [
      [0,0,0,0,0,0,0,0,0,0], //r0 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r1 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r2 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r3 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r4 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r5 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r6 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r7 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r8 c0-c9
      [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
    ]
    game.enemyBoard = [
      [0,0,0,0,0,0,0,0,0,0], //r0 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r1 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r2 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r3 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r4 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r5 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r6 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r7 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r8 c0-c9
      [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
    ]
    game.playerBoard = [
      [0,0,0,0,0,0,0,0,0,0], //r0 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r1 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r2 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r3 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r4 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r5 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r6 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r7 c0-c9
      [0,0,0,0,0,0,0,0,0,0], //r8 c0-c9
      [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
    ]
    enemyZoningAttackPattern = []
    username = ""
    enemyAttackLog = {}
    enemy = {} //stores ship type as key and its indexes on gameboard as values in array
    player = {}
    setupCurrSelectedShip = "destroyer" // "destroyer", "cruiser" etc
    setupOrientation = "v" // v or h
    availableShipTypesToPlace = ["destroyer","submarine","cruiser","battleship","carrier"]
    setupErrorMessage = ""
    render()
}

function changeBorderColorWhenHitEnemy(row,col) {
    // let allGrids = document.querySelectorAll("#gridplayer>div")
    // for (let x of allGrids) {
    //     x.style.borderColor = newColor
    // }
    // document.querySelector(`#gridplayer>#r${row}c${col}`).style.borderStyle = "dashed"
    document.querySelector("#enemywaters").style.color = "#FF0000"

    setTimeout(function() {
        // for (let x of allGrids) {
        //     x.style.borderColor = originalColor
        // }
        document.querySelector("#enemywaters").style.color = ""
    },700)
}

function changeBorderColorWhenHit(row,col) {
    let originalColor = ""
    let allGrids = document.querySelectorAll("#gridplayer>div")
    // for (let x of allGrids) {
    //     x.style.borderColor = newColor
    // }
    // document.querySelector(`#gridplayer>#r${row}c${col}`).style.borderStyle = "dashed"
    document.querySelector(`#gridplayer>#r${row}c${col}`).style.boxShadow = "0px 0px 0px 2px #27374D inset"
    document.querySelector("#yourwaters").style.color = "#FF0000"

    setTimeout(function() {
        // for (let x of allGrids) {
        //     x.style.borderColor = originalColor
        // }
        document.querySelector(`#gridplayer>#r${row}c${col}`).style.boxShadow = ""
        document.querySelector("#yourwaters").style.color = ""
    },700)
}

function changeBorderColorWhenMiss(row,col) {
    let originalColor = ""
    let allGrids = document.querySelectorAll("#gridplayer>div")
    // for (let x of allGrids) {
    //     x.style.borderColor = newColor
    // }
    // document.querySelector(`#gridplayer>#r${row}c${col}`).style.borderStyle = "dashed"
    document.querySelector(`#gridplayer>#r${row}c${col}`).style.boxShadow = "0px 0px 0px 2px #27374D inset"

    setTimeout(function() {
        // for (let x of allGrids) {
        //     x.style.borderColor = originalColor
        // }
        document.querySelector(`#gridplayer>#r${row}c${col}`).style.boxShadow = ""
    },700)
}

function handleAttack(e) {
    //return checks
    if (game.turn === "enemy") {return}
    if (game.winner !== null) {return}
    let currRowIdx = parseInt(e.target.id[1])
    let currColIdx = parseInt(e.target.id[3])
    if (game.enemyBoard[currRowIdx][currColIdx] === -10) {return}
    if (game.enemyBoard[currRowIdx][currColIdx] === -12) {return}
    if (game.enemyBoard[currRowIdx][currColIdx] === -13) {return}
    if (game.enemyBoard[currRowIdx][currColIdx] === -13.5) {return}
    if (game.enemyBoard[currRowIdx][currColIdx] === -14) {return}
    if (game.enemyBoard[currRowIdx][currColIdx] === -15) {return}
    //change to state 
    game.enemyBoard[currRowIdx][currColIdx] -= 10
    if (game.enemyBoard[currRowIdx][currColIdx]<-10) {changeBorderColorWhenHitEnemy(currRowIdx,currColIdx)}
    // searches enemy object to see if attacked cell is in any of enemy ship positions
    // if yes, finds index of it in found ship array and removes it
    attackShipAndRemoveInObj(enemy,currRowIdx,currColIdx)

    game.turn = "enemy"
    console.log("enemy", enemy)
    console.log("enemy game board", game)
    checkWin()
    render()

    let randomTime = Math.floor(Math.random()*(2201-2000)) +2000
    setTimeout(aiAttack,randomTime)
}

function aiAttack() {
    if (game.winner !== null) {
        game.turn = "player"
        return render()}
    let aiDetermineAttackTileResult = aiDetermineAttackTile()
    let currRowIdx = aiDetermineAttackTileResult[0]
    let currColIdx = aiDetermineAttackTileResult[1]
    
    if (game.playerBoard[currRowIdx][currColIdx] === undefined) {return aiAttack()} // check this again when ai is done
    if (game.playerBoard[currRowIdx][currColIdx] === 10) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 12) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 13) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 13.5) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 14) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 15) {return aiAttack()}
    game.playerBoard[currRowIdx][currColIdx] += 10
    attackShipAndRemoveInObj(player,currRowIdx,currColIdx)
    // enemy attack log
    if (game.playerBoard[currRowIdx][currColIdx]>10) {
        enemyAttackLog[`${currRowIdx},${currColIdx}`] = "hit"
        changeBorderColorWhenHit(currRowIdx,currColIdx)
    } else {
        enemyAttackLog[`${currRowIdx},${currColIdx}`] = "miss"
        changeBorderColorWhenMiss(currRowIdx,currColIdx)
    }
    console.log(enemyAttackLog)
    //
    game.turn = "player"
    console.log("ai attack coords",currRowIdx,currColIdx)
    console.log("player", player)
    console.log("player game board", game)
    checkWin()
    render()
}



let enemyZoningAttackPattern = []
function aiDetermineAttackTile() { //this function should return ONLY the attack tile coords to feed into the aiAttack function
    // check attacklog if there is "hit" && enemyZoningAttackPattern.length > 0
    if (Object.values(enemyAttackLog).some((x)=>x==="hit")) {
        // empty out enemyZoningAttackPattern
        // push 4 adjacent tile coords of all hits into enemyZoningAttackPattern e.g. [5][5] -> [4,5][6,5][5,4][5,6] https://stackoverflow.com/questions/25095789/return-an-object-key-only-if-value-is-true
        let keys = Object.keys(enemyAttackLog)
        let hitFilter = keys.filter((key)=>{    //stores array of keys that are hits
            return enemyAttackLog[key] === "hit"
        })
        console.log("hits",hitFilter) // ["1,9","2,1"] etc. extract coords from filter and push 4 for all coords
        for (let coord of hitFilter) {
            let curRow = parseInt(coord[0])
            let curCol = parseInt(coord[2])
            enemyZoningAttackPattern.push([curRow-1,curCol])
            enemyZoningAttackPattern.push([curRow+1,curCol])
            enemyZoningAttackPattern.push([curRow,curCol+1])
            enemyZoningAttackPattern.push([curRow,curCol-1])
        }
        console.log("inital push",enemyZoningAttackPattern) // [[1,2],[2,3]]
        // check all elements of enemyZoningAttackPattern for invalid coords and splice them out
        enemyZoningAttackPattern = enemyZoningAttackPattern.filter((coord)=>{ // [1,2]
            return (0<= coord[1] && coord[1]<=9)
        })
        enemyZoningAttackPattern = enemyZoningAttackPattern.filter((coord)=>{ // [1,2]
            return (0<= coord[0] && coord[0]<=9)
        })
        console.log("filter invalid",enemyZoningAttackPattern)
        // check all elements of enemyZoningAttackPattern for already-attacked coords with board and splice them out
        enemyZoningAttackPattern = enemyZoningAttackPattern.filter((coord)=>{ // [1,2]
            return game.playerBoard[coord[0]][coord[1]] < 10
        })
        console.log("filter already hit",enemyZoningAttackPattern)
        // if enemyZoningAttackPattern.length > 0, randomly choose any of the coords using index and set attack tile as those coords
        if (enemyZoningAttackPattern.length>0) {
            let rdmAttackIdx = Math.floor(Math.random()*enemyZoningAttackPattern.length)
            console.log(`enemy does attack pattern at ${enemyZoningAttackPattern[rdmAttackIdx][0]},${enemyZoningAttackPattern[rdmAttackIdx][1]}`)
            return [enemyZoningAttackPattern[rdmAttackIdx][0],enemyZoningAttackPattern[rdmAttackIdx][1]]
        } else {
        // else (for all hits, all adjacent tiles have been attacked) return aiDetermineAttackTile()
            console.log("enemy does random (2/3) after attack pattern tiles are all attacked")        
            // let remainingPlayer = [...player.destroyer,...player.submarine,...player.cruiser,...player.battleship,...player.carrier]
            // let oddsResult = Math.floor(Math.random() * 3) + 1
            // if (oddsResult === 1) {
            //     console.log("ai got 1/3")
            //     let randomIdx1 = Math.floor(Math.random() * remainingPlayer.length)
            //     return [remainingPlayer[randomIdx1][0],remainingPlayer[randomIdx1][1]]
            // } else 
            return [parseInt(Math.floor(Math.random() * 10)),parseInt(Math.floor(Math.random() * 10))]
        // }
        }        
    } else {
    // else default attack is random 
        console.log("skipped if of aidetermine")
        return [parseInt(Math.floor(Math.random() * 10)),parseInt(Math.floor(Math.random() * 10))]
    }
}

function attackShipAndRemoveInObj(obj,currRowIdx1,currColIdx1) { //obj = enemy or player, no quotes
    for (let ship in obj) {
        let index = obj[ship].findIndex((tilePos)=>{
            return tilePos[0] === currRowIdx1 && tilePos[1] === currColIdx1
        })
        if (index !== -1) {
            obj[ship].splice(index,1)
        }   
    }
}

function checkWin() {
    let totalEnemyLength = 0
    for (let shipType in enemy) {
        totalEnemyLength += enemy[shipType].length
    }
    console.log("enemy hp",totalEnemyLength)
    if (totalEnemyLength === 0) {game.winner = "player"}

    let totalPlayerLength = 0
    for (let shipType in player) {
        totalPlayerLength += player[shipType].length
    }
    console.log("player hp",totalPlayerLength)
    if (totalPlayerLength === 0) {game.winner = "enemy"}
}

function handleSetupReset() {
    game.setupBoard = [
        [0,0,0,0,0,0,0,0,0,0], //r0 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r1 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r2 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r3 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r4 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r5 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r6 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r7 c0-c9
        [0,0,0,0,0,0,0,0,0,0], //r8 c0-c9
        [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
      ]
    player = {}

    setupCurrSelectedShip = "destroyer" // "destroyer", "cruiser" etc
    setupOrientation = "v" // v or h
      
    availableShipTypesToPlace = ["destroyer","submarine","cruiser","battleship","carrier"]
      
    setupErrorMessage = ""
    render()
}

function handleToSetup() {
    username = usernameField.value
    document.querySelector("#yourwaters").innerText = `${username}'s waters`
    game.screen = "setupscreen"
    render()
}

function toggleOrientation() {
    if (setupOrientation === "h") {
        console.log(setupOrientation)
        setupOrientation = "v"
        return render()
    }
    if (setupOrientation === "v") {
        console.log(setupOrientation)
        setupOrientation = "h"
        return render()
    }
    
}

function handlePlaceShip(e) {
    setupErrorMessage = ""
    if (availableShipTypesToPlace.length === 0) {return}
    let tilePlacedRow = parseInt(e.target.id[1])
    let tilePlacedCol = parseInt(e.target.id[3])
    let orientation = setupOrientation
    let shipType = setupCurrSelectedShip
    placeShip(tilePlacedRow,tilePlacedCol,orientation,shipType,"setupBoard")
    if (game.setupBoard[tilePlacedRow][tilePlacedCol] === SHIP_VALUES[shipType]) {
        let index = availableShipTypesToPlace.findIndex((ship)=>ship === shipType)
        index != -1 ? availableShipTypesToPlace.splice(index,1) : console.log("null")
        console.log(availableShipTypesToPlace)
        setupCurrSelectedShip = availableShipTypesToPlace[0]
    }
    render()
    console.log(game)
    console.log(player)
}

function aiPlaceShip(shipType) {
    //randomise tilePlacedRow, tilePlacedCol,orientation
    let randomNumRow = Math.floor(Math.random() * 10)
    let randomNumCol = Math.floor(Math.random() * 10)
    let randomNumOrientation = Math.floor(Math.random() * 2)
    let randomOrientation;
    randomNumOrientation === 0 ? randomOrientation = "v" : randomOrientation = "h"
    placeShip(randomNumRow,randomNumCol,randomOrientation,shipType,"enemyBoard")
    //if current ship placed crosses with another ship
    if (game["enemyBoard"][randomNumRow][randomNumCol] != SHIP_VALUES[shipType] *-1) {aiPlaceShip(shipType)}
}

function placeShip(tilePlacedRow,tilePlacedCol,orientation,shipType,board) {
    let shipSize = SHIP_TYPE_SIZES[shipType] 
    //shipType = "destroyer", "submarine" etc. (? currSelectedShipSize etc)
    //board = "enemyBoard" "playerBoard" setupBoard will modify playerBoard object too
    //tilePlacedRow = 0, tilePlacedCol = 0 etc
    //orientation = "v" "h"
    //check if inital tile is already occupied
    if (game[board][tilePlacedRow][tilePlacedCol] != 0) {
        setupErrorMessage = "There is a ship in the way. Please choose another location."
        return console.log("There is a ship in the way. Please choose another location.")
    }
    //places starting tile of ship and changes state board to - value if enemy, + value if player * ship number to denote type of ship on board
    game[board][tilePlacedRow][tilePlacedCol] = SHIP_VALUES[shipType] * (board === "enemyBoard" ? -1 : 1)
    if (board === "enemyBoard") {enemy[shipType] = []}
    if (board === "setupBoard") {player[shipType] = []}
    //starting from game[board][i][j], set same value in downwards vertical for shipSizeth times
    if (orientation === "v") { 
        //check for out of board
        let lastRowIndex = tilePlacedRow+shipSize-1
        if (lastRowIndex > 9) {
            game[board][tilePlacedRow][tilePlacedCol] = 0
            setupErrorMessage = "Out of board. Please choose another location."
            return console.log("Out of board. Please choose another location.")
        }
        //check for ships already placed
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            if (game[board][tilePlacedRow+numTiles][tilePlacedCol] != 0) {
                game[board][tilePlacedRow][tilePlacedCol] = 0
                setupErrorMessage = "There is a ship in the way. Please choose another location."
                return console.log("There is a ship in the way. Please choose another location.")
            }
        }
        //creates ship in object
        if (board === "enemyBoard") {enemy[shipType].push([tilePlacedRow,tilePlacedCol])}
        if (board === "setupBoard") {player[shipType].push([tilePlacedRow,tilePlacedCol])}
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            game[board][tilePlacedRow+numTiles][tilePlacedCol] = SHIP_VALUES[shipType] * (board === "enemyBoard" ? -1 : 1)
            if (board === "enemyBoard") {enemy[shipType].push([tilePlacedRow+numTiles,tilePlacedCol])}
            if (board === "setupBoard") {player[shipType].push([tilePlacedRow+numTiles,tilePlacedCol])}

        }
    }
    if (orientation === "h") {
         //check for out of board
        let lastColIndex = tilePlacedCol+shipSize-1
        if (lastColIndex > 9) {
            game[board][tilePlacedRow][tilePlacedCol] = 0
            setupErrorMessage = "Out of board. Please choose another location."
            return console.log("Out of board. Please choose another location.")
        }
        //check for ships already placed
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            if (game[board][tilePlacedRow][tilePlacedCol+numTiles] != 0) {
                game[board][tilePlacedRow][tilePlacedCol] = 0
                setupErrorMessage = "There is a ship in the way. Please choose another location."
                return console.log("There is a ship in the way. Please choose another location.")
            }
        }
        if (board === "enemyBoard") {enemy[shipType].push([tilePlacedRow,tilePlacedCol])}
        if (board === "setupBoard") {player[shipType].push([tilePlacedRow,tilePlacedCol])}
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            game[board][tilePlacedRow][tilePlacedCol+numTiles] = SHIP_VALUES[shipType] * (board === "enemyBoard" ? -1 : 1)
            if (board === "enemyBoard") {enemy[shipType].push([tilePlacedRow,tilePlacedCol+numTiles])}
            if (board === "setupBoard") {player[shipType].push([tilePlacedRow,tilePlacedCol+numTiles])}
        }
    }
}

function toggleDestroyer() {
    setupCurrSelectedShip = "destroyer"
    console.log(setupCurrSelectedShip)
    render()
}
function toggleSubmarine() {
    setupCurrSelectedShip = "submarine"
    console.log(setupCurrSelectedShip)
    render()
}
function toggleCruiser() {
    setupCurrSelectedShip = "cruiser"
    console.log(setupCurrSelectedShip)
    render()
}
function toggleBattleship() {
    setupCurrSelectedShip = "battleship"
    console.log(setupCurrSelectedShip)
    render()
}
function toggleCarrier() {
    setupCurrSelectedShip = "carrier"
    console.log(setupCurrSelectedShip)
    render()
}



function handleToGame() {
    if (availableShipTypesToPlace.length != 0) {
        setupErrorMessage = "Not all ships have been placed."
        return render()
    }
    game.playerBoard = [...game.setupBoard]
    aiPlaceShip("destroyer")
    aiPlaceShip("submarine")
    aiPlaceShip("cruiser")
    aiPlaceShip("battleship")
    aiPlaceShip("carrier")
    game.screen = "gamescreen"
    console.log(game)
    render()
}

// render functions
function render() {
  renderScreen()
  renderBoard("player")
  renderBoard("setup")
  renderBoard("enemy")
  rendersetupCurrSelectedShip()
  renderTurn()
  renderErrorMsg()
  renderPlayAgainButton()
  renderWinMessage()
  renderOrientaion()
}

function renderScreen() {
  startScreen.classList.add("hide")
  setupScreen.classList.add("hide")
  gameScreen.classList.add("hide")

  if (game.screen === "startscreen") {
      startScreen.classList.remove("hide")
  }
  if (game.screen === "setupscreen") {
      setupScreen.classList.remove("hide")
  }
  if (game.screen === "gamescreen") {
      gameScreen.classList.remove("hide")
  } 
}

function renderBoard(board) { // "player"
    for (let row = 0;row < game[`${board}Board`].length; row++) {
        for (let col = 0;col<game[`${board}Board`][0].length;col++ ) {
                document.querySelector(`#grid${board}>#r${row}c${col}`).style.backgroundColor = ""
        }
    }

    for (let row = 0;row < game[`${board}Board`].length; row++) {
        for (let col = 0;col<game[`${board}Board`][0].length;col++ ) {
                document.querySelector(`#grid${board}>#r${row}c${col}`).style.backgroundColor = CELL_INDICATOR[`${game[`${board}Board`][row][col]}`]
        }
    }
}

// function changeTileColorWhenHit(newColor,row,col) {
//     let originalColor = "#D4FAFA"
//     document.querySelector(`#r${row}c${col}`).style.backgroundColor = newColor

//     setTimeout(function() {
//         document.querySelector(`#r${row}c${col}`).style.backgroundColor = originalColor
//     },700)
// }

function rendersetupCurrSelectedShip() {
    setupDestroyerButton.style.backgroundColor = ""
    setupSubmarineButton.style.backgroundColor = ""
    setupCruiserButton.style.backgroundColor = ""
    setupBattleshipButton.style.backgroundColor = ""
    setupCarrierButton.style.backgroundColor = ""

    setupDestroyerButton.classList.add("hide")
    setupSubmarineButton.classList.add("hide")
    setupCruiserButton.classList.add("hide")
    setupBattleshipButton.classList.add("hide")
    setupCarrierButton.classList.add("hide")
    let color = "#526D82"
    if (setupCurrSelectedShip === "destroyer") {setupDestroyerButton.style.backgroundColor = color}
    if (setupCurrSelectedShip === "submarine") {setupSubmarineButton.style.backgroundColor = color}
    if (setupCurrSelectedShip === "cruiser") {setupCruiserButton.style.backgroundColor = color}
    if (setupCurrSelectedShip === "battleship") {setupBattleshipButton.style.backgroundColor = color}
    if (setupCurrSelectedShip === "carrier") {setupCarrierButton.style.backgroundColor = color}
    
    //remove hide if exist in array
    if (availableShipTypesToPlace.includes("destroyer")) {setupDestroyerButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("submarine")) {setupSubmarineButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("cruiser")) {setupCruiserButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("battleship")) {setupBattleshipButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("carrier")) {setupCarrierButton.classList.remove("hide")}
}

function renderOrientaion() {
    document.querySelector("#toggleOrientation").innerText=""
    if (setupOrientation === "v") {document.querySelector("#toggleOrientation").innerText="Current orientation: Vertical"}
    if (setupOrientation === "h") {document.querySelector("#toggleOrientation").innerText="Current orientation: Horizontal"}
}

function renderErrorMsg() {
    setupErrorMessageField.innerText = ""
    setupErrorMessageField.innerText = setupErrorMessage
//     setTimeout(()=>{
//         setupErrorMessage=""
//         setupErrorMessageField.innerText = setupErrorMessage
// },5000)
}

let timer;
function renderTurn() {
    document.querySelector("#turnMessage").innerText = ""
    document.querySelector("#turnMessage").classList.remove("hide")

    let turnTimer = function() {
        document.querySelector("#turnMessage").innerText += "."
    }

    if (game.turn === "enemy") {
        document.querySelector("#turnMessage").style.color = "#dc4d01"
        document.querySelector("#turnMessage").innerText = `Enemy is launching an attack on ${username}'s waters` 
        timer = setInterval(turnTimer,350)
    }

    if (game.turn === "player") {
        clearInterval(timer)
        document.querySelector("#turnMessage").style.color = ""
        document.querySelector("#turnMessage").innerText = `${username}'s turn to attack`
    }

    if (game.winner !== null) {
        document.querySelector("#turnMessage").classList.add("hide")
    }
}

function renderPlayAgainButton() {
    document.querySelector("#playAgainButton").classList.add("hide")

    if (game.winner !== null) {
        document.querySelector("#playAgainButton").classList.remove("hide")
    }
}

function renderWinMessage() {
    let winMessage = document.querySelector("#winMessage")
    winMessage.innerText = ""

    if (game.winner === "enemy") {
        winMessage.style.color = "#dc4d01"
        winMessage.innerText = "The enemy has sunk all of your ships... You've lost."
    }
    if (game.winner === "player") {
        winMessage.style.color = ""
        winMessage.innerText = `${username} has sunk all of the enemy ships and emerges victorious!`
    }
}

// real-time render
function renderPlacementLens(e) {
    for (let row = 0;row < game[`setupBoard`].length; row++) {
        for (let col = 0;col<game[`setupBoard`][0].length;col++ ) {
                document.querySelector(`#gridsetup>#r${row}c${col}`).classList.remove("lenshover")
        }
    }
    let currRowIdx = parseInt(e.target.id[1])
    let currColIdx = parseInt(e.target.id[3])
    let orientation = setupOrientation
    let shipSize = SHIP_TYPE_SIZES[setupCurrSelectedShip]
    if (orientation === "h") {
    for (let col = 1; col < shipSize; col++) {
        document.querySelector(`#gridsetup>#r${currRowIdx}c${currColIdx+col}`) ?
        document.querySelector(`#gridsetup>#r${currRowIdx}c${currColIdx+col}`).classList.add("lenshover") : {}
    }}
    if (orientation === "v") {
    for (let row = 1; row < shipSize; row++) {
        document.querySelector(`#gridsetup>#r${currRowIdx+row}c${currColIdx}`) ?
        document.querySelector(`#gridsetup>#r${currRowIdx+row}c${currColIdx}`).classList.add("lenshover") : {}
    }}
}
function removePlacementLens(e) {
    let currRowIdx = parseInt(e.target.id[1])
    let currColIdx = parseInt(e.target.id[3])
    let orientation = setupOrientation
    let shipSize = SHIP_TYPE_SIZES[setupCurrSelectedShip]
    if (orientation === "h") {
    for (let col = 1; col < shipSize; col++) {
        document.querySelector(`#gridsetup>#r${currRowIdx}c${currColIdx+col}`) ?
        document.querySelector(`#gridsetup>#r${currRowIdx}c${currColIdx+col}`).classList.remove("lenshover") : {}
    }}
    if (orientation === "v") {
    for (let row = 1; row < shipSize; row++) {
        document.querySelector(`#gridsetup>#r${currRowIdx+row}c${currColIdx}`) ?
        document.querySelector(`#gridsetup>#r${currRowIdx+row}c${currColIdx}`).classList.remove("lenshover") : {}
    }}
}

// when refactoring after project finish: make a createboard function with arguments 
// "appendlocation" and place in init() and remove the boards in html

init()

