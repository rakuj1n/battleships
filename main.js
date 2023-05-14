//pseudo code
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
