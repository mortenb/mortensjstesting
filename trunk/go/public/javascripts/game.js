
    // TODO: Make a nicer GUI (Scoreboard++)
    // TODO: longpolling
    // TODO: websockets

    var game = function(canvas, size, isPlayer1Turn) {
        //private properties / methods:
        var debug = false;
        var player1Points = 0;
        var player2Points = 0;
        var player1Turn = isPlayer1Turn;

        var board = GoBoard(size);
        var boardCanvas = BoardCanvas(canvas, size);



        function putStoneInPosition(pos) {
            if (debug) {
                console.debug(pos[0] + "," + pos[1]);
            }
            var boardPos = boardCanvas.screenPosToBoardPos(pos)
            var x = boardPos[0];
            var y = boardPos[1];
//            var currentPlayer = player1Turn?player1:player2;
//            var retVal = board.placeStone(x,y,player)
//            if ( retVal.legalMove ) {
//                if (player1Turn) {
//                    player1Points += retVal.points;
//                } else {
//                    player2Points += retVal.points;
//                }
//
//                // switch turn
//                player1Turn = !player1Turn;
//                if (player1Turn) {
//                    turnsPlayed ++;
//                }

                // update screen
                //boardCanvas.draw(board.getPositions());
                //legal move, send to server!
                //sendToServer(player, x, y);
                return true;
            }


        function updateScoreBoard(player1Turn) {
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
                    return true;
                    //updateScoreBoard();
                }
                else {
                    showError("illegal move!");
                    if (debug) {
                        console.log("Illegal position!");
                    }
                    return false;
                }
            },

            draw : function(){
                boardCanvas.draw(board.getPositions());
                updateScoreBoard(player1Turn);
            },
            setPositionsFromString : function(positions) {
                board.setPositionsFromString(positions);
            },
            screenPosToBoardPos : function(pos) {
                return boardCanvas.screenPosToBoardPos(pos);
            }

        }
    }


