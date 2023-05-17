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


/*----- state variables -----*/
let game = {
  turn: "",
  screen: "setupscreen", //startscreen, setupscreen, gamescreen
  enemyBoard: [
    [0,0,0,0,0,0,0,0,0,0] //r0 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r1 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r2 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r3 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r4 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r5 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r6 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r7 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r8 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
  ],
  playerBoard: [
    [0,0,0,0,0,0,0,0,0,0] //r0 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r1 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r2 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r3 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r4 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r5 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r6 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r7 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r8 c0-c9
    [0,0,0,0,0,0,0,0,0,0] //r9 c0-c9
  ],
}

let enemy = {} //stores ship type as key and its indexes on gameboard as values in array
let player = {}


/*----- cached elements  -----*/
let startScreen = document.querySelector("#startscreen")
let setupScreen = document.querySelector("#playersetup")
let gameScreen = document.querySelector("#game")
let playButton = document.querySelector("#startbutton")

/*----- event listeners -----*/


/*----- functions -----*/
function init() {
    createBoard("#gridsetup")
    createBoard("#gridenemy")
    createBoard("#gridplayer")
    render()
}

// function showShipPlacement(index) 

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

function placeShip(tilePlacedRow,tilePlacedCol,orientation,shipType,board) {
    shipSize = SHIP_TYPE_SIZES[shipType] 
    //shipType = "destroyer", "submarine" etc. (? currSelectedShipSize etc)
    //board = "enemyBoard" "playerBoard" setupBoard will modify playerBoard object too
    //tilePlacedRow = 0, tilePlacedCol = 0 etc
    //orientation = "v" "h"

    //places starting tile of ship and changes state board to - value if enemy, + value if player * ship number to denote type of ship on board
    game[board][tilePlacedRow][tilePlacedCol] = shipSize * (board === "enemyBoard" ? -1 : 1)
    //starting from game[board][i][j], set same value in downwards vertical for shipSizeth times
    if (orientation === "v") { 
        //check for out of board
        let lastRowIndex = tilePlacedRow+shipSize-1
        if (lastRowIndex > 9) {return console.log("Out of board. Please choose another location.")}
        //check for ships already placed
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            if (game[board][tilePlacedRow+numTiles][tilePlacedCol] != 0) {return console.log("There is a ship in the way. Please choose another location.")}
        }
        //creates ship in enemy object
        let obj;
        if (board === "enemyBoard") {obj = enemy}
        if (board === "playerBoard") {obj = player}
        obj[shipType] = []
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            game[board][tilePlacedRow+numTiles][tilePlacedCol] = shipSize * (board === "enemyBoard" ? -1 : 1)
            obj[shipType].push([tilePlacedRow+numTiles,tilePlacedCol])
        }
    }
    if (orientation === "h") {
        let lastColIndex = tilePlacedCol+shipSize-1
        if (lastColIndex > 9) {return console.log("Out of board. Please choose another location.")}
        //check for ships already placed
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            if (game[board][tilePlacedRow][tilePlacedCol+numTiles] != 0) {return console.log("There is a ship in the way. Please choose another location.")}
        }
        let obj;
        if (board === "enemyBoard") {obj = enemy}
        if (board === "playerBoard") {obj = player}
        obj[shipType] = []
        for (let numTiles = 1; numTiles < shipSize; numTiles++) {
            game[board][tilePlacedRow][tilePlacedCol+numTiles] = shipSize * (board === "enemyBoard" ? -1 : 1)
            obj[shipType].push([tilePlacedRow,tilePlacedCol+numTiles])
        }
    }
}


// render functions
function render() {
  renderScreen()
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

// when refactoring after project finish: make a createboard function with arguments 
// "appendlocation" and place in init() and remove the boards in html

init()