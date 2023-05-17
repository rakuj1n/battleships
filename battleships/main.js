//pseudo code
// ship types: 5 - carrier || 4 - battleship || 3.1 - cruiser || 3.0 - submarine || 2 - destroyer
// total 5 ships 

// enemy AI board values are negative || play board values are positive
// initial board value is 0
// each battleship type has different value e.g. 2-tile battleship has value of (-)2, 3-tile has (-)3 etc

// when enemy fires at playertile -> value += 10 on player board, player fire at enemytile -> value -= 10
// loops through board using adjacentcheck lens to see if there is:
    // 2 -12 values adjacent (2tile battleship) || 3 -13 values adjacent (3tile battleship) || 4 -14 values adjacent etc
    // to determine if an entire 2tile/3tile etc. battleship has been sunk
// missed shots should = -10 for enemyboard and 10 for playboard

// enemyAi first will place battleships:
    // startingplacepoint uses mathrandom for starting tile
    // code vertical and horizontal placement as two options that enemyAI will mathrandom choose before placing a battleship
    // use {while} to determine if off-board placement, if so, re-random a startingplacepoint
    // if no off-board placement until all respective # tiles for battleship type has been placed, move to next battleship type to place
    // loop until all battleships have been placed

//start game screen explaining rules?
//next screen 
    // -> initialise Ai placement of ships
    // -> player placement screen
        // player name field
        // list of ships and tile value that play can press and toggle through current selection
        // toggle for player to toggle vertical horizontal placement for current selected ship
        // when placed, ship placed is removed frmo list of ships
        // clicked tile is the pivotstarttile, will highlight the adjacent tiles as player hovers around different tiles
        // rmbr to code unplaceable tiles (values !== 0)

// state variables
    // enemy & player board ship death count


//screens
    //start screen
    //player setup screen
    //playing screen
    //playing screen w/o controls once game over with a reset button


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
    //player got hit
    "12": "#FF0000",
    "13.5": "#FF0000",
    "13": "#FF0000",
    "14": "#FF0000",
    "15": "#FF0000",
    //enemy ships
    "-2": "#EFECCA",
    "-3.5": "#A9CBB7",
    "-3": "#F7FF58",
    "-4": "#FF934F",
    "-5": "#5E565A",
    //enemy got hit
    "-12": "#FF0000",
    "-13.5": "#FF0000",
    "-13": "#FF0000",
    "-14": "#FF0000",
    "-15": "#FF0000",
}


/*----- state variables -----*/
let game = {
  turn: "",
  screen: "setupscreen", //startscreen, setupscreen, gamescreen
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

let enemy = {} //stores ship type as key and its indexes on gameboard as values in array
let player = {}

let setupCurrSelectedShip = "destroyer" // "destroyer", "cruiser" etc
let setupOrientation = "v" // v or h

let availableShipTypesToPlace = ["destroyer","submarine","cruiser","battleship","carrier"]

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

/*----- event listeners -----*/
setupDestroyerButton.addEventListener("click",toggleDestroyer)
setupSubmarineButton.addEventListener("click",toggleSubmarine)
setupCruiserButton.addEventListener("click",toggleCruiser)
setupBattleshipButton.addEventListener("click",toggleBattleship)
setupCarrierButton.addEventListener("click",toggleCarrier)
toggleOrientationButton.addEventListener("click",toggleOrientation)


/*----- functions -----*/
function init() {
    createBoard("#gridsetup")
    createBoard("#gridenemy")
    createBoard("#gridplayer")
    createSetupEventList()
    aiPlaceShip("destroyer")
    aiPlaceShip("submarine")
    aiPlaceShip("cruiser")
    aiPlaceShip("battleship")
    aiPlaceShip("carrier")
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
    let tilePlacedRow = parseInt(e.target.id[1])
    let tilePlacedCol = parseInt(e.target.id[3])
    let orientation = setupOrientation
    let shipType = setupCurrSelectedShip
    placeShip(tilePlacedRow,tilePlacedCol,orientation,shipType,"setupBoard")
    if (game.setupBoard[tilePlacedRow][tilePlacedCol] === SHIP_VALUES[shipType]) {
        let index = availableShipTypesToPlace.findIndex((ship)=>ship === shipType)
        console.log(index)
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
    if (game[board][tilePlacedRow][tilePlacedCol] != 0) {return console.log("There is a ship in the way. Please choose another location.")}
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
            return console.log("Out of board. Please choose another location.")
        }
        //check for ships already placed
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            if (game[board][tilePlacedRow+numTiles][tilePlacedCol] != 0) {
                game[board][tilePlacedRow][tilePlacedCol] = 0
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
            return console.log("Out of board. Please choose another location.")
        }
        //check for ships already placed
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            if (game[board][tilePlacedRow][tilePlacedCol+numTiles] != 0) {
                game[board][tilePlacedRow][tilePlacedCol] = 0
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

function createSetupEventList() {
    for (let row = 0;row < game.setupBoard.length; row++) {
        for (let col = 0;col<game.setupBoard[0].length;col++ ) {
                document.querySelector(`#gridsetup>#r${row}c${col}`).addEventListener("click",handlePlaceShip)
        }
    }
}

// render functions
function render() {
  renderScreen()
  renderBoard("player")
  renderBoard("setup")
  renderBoard("enemy") //remove this later
  rendersetupCurrSelectedShip()
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

// when refactoring after project finish: make a createboard function with arguments 
// "appendlocation" and place in init() and remove the boards in html

init()

