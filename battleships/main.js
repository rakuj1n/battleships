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
    "0": "#FFFFFF",
    //player ships
    "2": "#EFECCA",
    "3.5": "#A9CBB7",
    "3": "#F7FF58",
    "4": "#FF934F",
    "5": "#5E565A",
    //enemy misses
    "10": "#D4FAFA",
    //player got hit
    "12": "#FF0000",
    "13.5": "#FF0000",
    "13": "#FF0000",
    "14": "#FF0000",
    "15": "#FF0000",
    //enemy ships (hidden)
    "-2": "#FFFFFF",
    "-3.5": "#FFFFFF",
    "-3": "#FFFFFF",
    "-4": "#FFFFFF",
    "-5": "#FFFFFF",
    //player misses
    "-10": "#D4FAFA",
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
  winner: null,
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
    // searches enemy object to see if attacked cell is in any of enemy ship positions
    // if yes, finds index of it in found ship array and removes it
    attackShipAndRemoveInObj(enemy,currRowIdx,currColIdx)

    game.turn = "enemy"
    console.log("enemy", enemy)
    console.log("enemy game board", game)
    render()

    let randomTime = Math.floor(Math.random()*(2001-500)) +500
    setTimeout(aiAttack,randomTime)
}

function aiAttack() {
    let currRowIdx = parseInt(Math.floor(Math.random() * 10))
    let currColIdx = parseInt(Math.floor(Math.random() * 10))
    if (game.playerBoard[currRowIdx][currColIdx] === 10) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 12) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 13) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 13.5) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 14) {return aiAttack()}
    if (game.playerBoard[currRowIdx][currColIdx] === 15) {return aiAttack()}
    game.playerBoard[currRowIdx][currColIdx] += 10
    attackShipAndRemoveInObj(player,currRowIdx,currColIdx)
    game.turn = "player"
    console.log(currRowIdx,currColIdx)
    console.log("player", player)
    console.log("player game board", game)
    render()
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
    document.querySelector("#game>#yourwaters").innerText = `${username}'s waters`
    game.screen = "setupscreen"
    render()
}

function toggleOrientation() {
    if (toggleOrientationButton.innerText === "Vertical") {
        setupOrientation = "h"
        console.log(setupOrientation)
        return toggleOrientationButton.innerText = "Horizontal"
    }
    if (toggleOrientationButton.innerText === "Horizontal") {
        setupOrientation = "v"
        console.log(setupOrientation)
        return toggleOrientationButton.innerText = "Vertical"
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
    
    if (setupCurrSelectedShip === "destroyer") {setupDestroyerButton.style.backgroundColor = "#FDFD96"}
    if (setupCurrSelectedShip === "submarine") {setupSubmarineButton.style.backgroundColor = "#FDFD96"}
    if (setupCurrSelectedShip === "cruiser") {setupCruiserButton.style.backgroundColor = "#FDFD96"}
    if (setupCurrSelectedShip === "battleship") {setupBattleshipButton.style.backgroundColor = "#FDFD96"}
    if (setupCurrSelectedShip === "carrier") {setupCarrierButton.style.backgroundColor = "#FDFD96"}
    
    //remove hide if exist in array
    if (availableShipTypesToPlace.includes("destroyer")) {setupDestroyerButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("submarine")) {setupSubmarineButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("cruiser")) {setupCruiserButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("battleship")) {setupBattleshipButton.classList.remove("hide")}
    if (availableShipTypesToPlace.includes("carrier")) {setupCarrierButton.classList.remove("hide")}
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
    document.querySelector("#game>h1").innerText = ""

    let turnTimer = function() {
        document.querySelector("#game>h1").innerText += "."
    }

    if (game.turn === "enemy") {
        document.querySelector("#game>h1").innerText = "Enemy is launching an attack"
        timer = setInterval(turnTimer,250)
    }

    if (game.turn === "player") {
        clearInterval(timer)
        document.querySelector("#game>h1").innerText = `${username}'s turn`
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

