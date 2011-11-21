
    // GoBoard is a "class" that contains state of the board (positions) and the logic for capturing stones
    // This logic should also run on the server side and should therefore be independent of the GUI logic
    // TODO: fix Bug in chrome
    // TODO: Clean up client js - divide into board.js, game.js, (board graphics)
    // TODO: Make a nicer GUI (Scoreboard++)
    // TODO: 2 player game logic (wait for other player)
    // TODO: longpolling
    // TODO: websockets

var GoBoard = function(size) {
    // private members:

    var XYoffsets = [ [1,0],[-1,0],[0,1],[0,-1] ];

    // helper functions:
    var create2dArray = function(xsize, ysize){
        var new2dArray = [];

        for (var i = 0; i < xsize; i++) {
            new2dArray[i] = new Array(ysize);
        }
        return new2dArray;
    }
    var fill2dArray = function(array, fillValue){
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[i].length; j++) {
                array[i][j] = fillValue;
            }
        }
    }
    var copy2dArray = function(srcArray, dstArray){
        for (var i = 0; i < srcArray.length; i++) {
            for (var j = 0; j < srcArray[i].length; j++) {
                dstArray[i][j] = srcArray[i][j];
            }
        }
    }

    var clearMarks = function(){
        fill2dArray(positionMarked,false);
    }
    var removeMarkedStones = function(){ // returns number of removed stones
        var numberOfRemovedStones = 0
        for (var i = 0; i < boardSize; i++) {
            for (var j = 0; j < boardSize; j++) {
                if (positionMarked[i][j]) {
                    positions[i][j] = "."; // remove stone
                    numberOfRemovedStones++; // count
                }
            }
        }
        return numberOfRemovedStones;
    }

    function isBlocked(x, y, enemyStone) {
        // recursive function to check if a position is blocked
        // if the position is occupied by the the current player the surrounding positions are checked

        // check if blocked by borders
        if (x < 0 || y < 0 || x >= boardSize || y >= boardSize)
            return true;
        // check if position has already been marked as checked
        if (positionMarked[x][y])
            return true;
        // check if position is free
        if (positions[x][y] == ".")
            return false;
        // check if position is blocked the other player
        if (positions[x][y] == enemyStone)
            return true;

        // mark this position to prevent re-checking
        positionMarked[x][y] = true;

        // check surrounding positions
        var xoff,yoff;
        for( var i = 0; i < 4; i++){
            xoff = XYoffsets[i][0];
            yoff = XYoffsets[i][1];
            if (!isBlocked(x + xoff, y + yoff, enemyStone))
                return false;
        }
        return true;
    }

    var boardSize = size; // store size parameter
    // create empty board position matrix
    var positions = create2dArray(boardSize,boardSize);
    fill2dArray(positions,".");
    // create stone marker array (used when checking for surrounded stones)
    var positionMarked = create2dArray(boardSize,boardSize);
    fill2dArray(positionMarked,false);

    return {
        //public functions:
        setPositions : function(newPositions){
            copy2dArray(newPositions, positions);
        },
        setPositionsFromString : function(strPos){
            var k = 0;
            for (var i = 0; i < positions.length; i++) {
                for (var j = 0; j < positions[i].length; j++) {
                    positions[j][i] = strPos[k++];
                }
            }
        },
        getPositions : function(){
            return positions; // OBS! positions array is passed by reference and can be altered
        },
        placeStone : function(x,y,stoneColor){
            // check if position is occupied
            if( positions[x][y] != "." )
                return { legalMove : false };

            // place stone
            positions[x][y] = stoneColor;

            // check if any enemy stones are captured
            var capturedStones = 0;
            var xoff,yoff;
            for( var i = 0; i < 4; i++){
                [xoff,yoff] = XYoffsets[i];
                clearMarks();
                if (isBlocked(x + xoff, y + yoff, stoneColor))
                    capturedStones += removeMarkedStones();
            }

            // check if suicide
            enemyStone = (stoneColor=="W")?"B":"W";
            clearMarks();
            if( isBlocked(x,y,enemyStone) ){ // oh no! suicide
                // remove placed stone
                positions[x][y] = ".";
                return { legalMove : false };
            }

            return { legalMove : true, points : capturedStones };
        }
    }
}

