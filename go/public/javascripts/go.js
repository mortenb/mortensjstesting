$(document).ready(function() {

    // GoBoard is a "class" that contains state of the board (positions) and the logic for capturing stones
    // This logic should also run on the server side and should therefore be independent of the GUI logic
    //TODO:
    // fix Bug in chrome
    // Port client side logic to server..
    // This file is a mess - ditch most client logic
    // This file will still be a mess - rewrite and make it create canvas based on JSON from server.
    // Make a nicer GUI (Scoreboard)

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
                        positions[i][j] = false; // remove stone
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
            if (positions[x][y] == false)
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
        fill2dArray(positions,false);
        // create stone marker array (used when checking for surrounded stones)
        var positionMarked = create2dArray(boardSize,boardSize);
        fill2dArray(positionMarked,false);

        return {
            //public functions:
            setPositions : function(newPositions){
                copy2dArray(newPositions, positions);
            },
            getPositions : function(){
                return positions; // OBS! positions array is passed by reference and can be altered
            },
            placeStone : function(x,y,stoneColor){
                // check if position is occupied
                if( positions[x][y] )
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
                    positions[x][y] = false;
                    return { legalMove : false };
                }

                return { legalMove : true, points : capturedStones };
            }
        }
    }

    var game = function(canvas, size) {
        //private properties / methods:
         var debug = false;

        var player1 = "B", player2 = "W";
        var player1Turn = true;
        var turnsPlayed = 0;
        var player1Points = 0;
        var player2Points = 0;

        var numberOf = size;

        var width = canvas.width();
        var height = canvas.height();

        var stoneWidth = width / numberOf;
        var stoneHeigth = height / numberOf;

        function drawBoard(canvas, numberOf, positions) {
            var ctx = canvas[0].getContext("2d");
            ctx.beginPath();
            ctx.fillStyle = "#ea0"; //bordfarge
            ctx.fillRect(0, 0, width, height);
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 4;

            for (i = 0; i <= numberOf; i++) { //make rutetabell
                ctx.beginPath();
                var x = stoneWidth / 2;
                var y = (stoneHeigth / 2) + stoneHeigth * i;
                ctx.moveTo(x, y);
                ctx.lineTo((width - stoneWidth / 2), (stoneHeigth / 2) + stoneHeigth * i);
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo((stoneWidth / 2) + stoneWidth * i, (stoneHeigth / 2));
                ctx.lineTo((stoneWidth / 2) + stoneWidth * i, height - (stoneHeigth / 2));
                ctx.stroke();
                ctx.closePath();
            }

            //make black dots on the board
            for (i = -1; i <= 1; i++) {
                for (j = -1; j <= 1; j++) {
                    x = width / 2 + i * 6 * stoneWidth;
                    y = height / 2 + j * 6 * stoneHeigth;
                    drawStone(true, x, y, 8);
                }
            }

            //draw stones in play based on the positions array:
            for (i = 0; i < numberOf; i++) {
                for (var j = 0; j < numberOf; j++) {
                    var val = positions[i][j];
                    if (val) {
                        boardPos = convertPositionToActualBoardPosition([i,j], stoneWidth, stoneHeigth);
                        drawStone((val == "B"), boardPos[0], boardPos[1], stoneWidth / 2.5);
                    }
                }
            }

        }




        function convertPositionToActualBoardPosition(pos, stoneWidth, stoneHeigth) {
            var x = pos[0];
            var y = pos[1];
            return [ ((x * stoneWidth) + stoneWidth / 2), ( (y * stoneHeigth) + stoneHeigth / 2)];
        }

        function drawStone(isBlack, xPos, yPos, size) {
            var ctx = $("#canvas")[0].getContext("2d");
            if (isBlack) {
                ctx.fillStyle = "#000";
            } else {
                ctx.fillStyle = "#FFF";
            }
            ctx.beginPath();
            ctx.arc(xPos, yPos, size, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fill();
        }

        board = GoBoard(numberOf);

        drawBoard(canvas, numberOf, board.getPositions() );

        function sendToServer(player, x, y) {
            var gamedata = {
                "player" : player,
                "x" : x,
                "y" : y
            };
            $.ajax({
                type: "POST",
                url: "http://localhost:9000/play/1",
                data: gamedata,
                beforeSend: function() {
                    $('#ajax').text("Sending....");
                },
                error: function() {
                    $("#ajax").text("Error when sending to server!");
                },
                success: function() {
                    $("#ajax").text("Success!");
                },
                complete: function() {
                    $("#ajax").append("...Ferdig!");
                }
            });
        }

        function putStoneInPosition(pos) {
            if (debug) {
                console.debug(pos[0] + "," + pos[1]);
            }
            var x = Math.floor(pos[0] / stoneWidth);
            var y = Math.floor(pos[1] / stoneHeigth);
            var currentPlayer = player1Turn?player1:player2;
            var retVal = board.placeStone(x,y,currentPlayer)
            if ( retVal.legalMove ) {
                if (player1Turn) {
                    player1Points += retVal.points;
                } else {
                    player2Points += retVal.points;
                }

                // switch turn
                player1Turn = !player1Turn;
                if (player1Turn) {
                    turnsPlayed ++;
                }

                // update screen
                drawBoard(canvas, numberOf, board.getPositions() );
                //legal move, send to server!
                sendToServer(currentPlayer, x, y);
                return true;
            }
            return false;
        }


        function updateScoreBoard() {
            if (player1Turn) {
                currentPlayer = "Black's";
            } else {
                currentPlayer = "White's";
            }
            $("#blackPoints").text(player1Points);
            $("#whitePoints").text(player2Points);
            $("#playerTurn").text(currentPlayer);
            showError("");
        }
        function showError(errorMsg) {
            $("#error").text(errorMsg);
        }

        //end private

        return {
            play : function(pos) {
                if (debug) {
                    console.log(pos);
                }
                if (putStoneInPosition(pos)) {
                    updateScoreBoard();
                    if (debug) {
                        console.log("played");
                    }
                }
                else {
                    showError("illegal move!");
                    if (debug) {
                        console.log("Illegal position!");
                    }
                }
            },

            getLegalPositions : function() {
                return positions;
            },

            getStoneSize : function() {
                return stoneWidth;
            }
        }
    }

    var canvas = $("#canvas");
    var myGame = game(canvas, 19);

    canvas.mousemove(
            function(e) {
                pos = getCursorPosition(this, e);
            }).mouseup(function(e) {
                pos = getCursorPosition(this, e);
                myGame.play(pos);
            });


    function getCursorPosition(canvas, event) {
        var x, y;
        canoffset = $(canvas).offset();
        x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left);
        y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1;
        return [x,y];
    }

});