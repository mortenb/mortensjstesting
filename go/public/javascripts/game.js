
    // GoBoard is a "class" that contains state of the board (positions) and the logic for capturing stones
    // This logic should also run on the server side and should therefore be independent of the GUI logic
    // TODO: Make a nicer GUI (Scoreboard++)
    // TODO: longpolling
    // TODO: websockets

    var game = function(canvas, size, gameId, thePlayer) {
        //private properties / methods:
        var debug = false;
        var id = gameId;
        var player = thePlayer;
        var turnsPlayed = 0;
        var player1Points = 0;
        var player2Points = 0;

        board = GoBoard(size);
        boardCanvas = BoardCanvas(canvas, size);

        function sendToServer(player, x, y) {
            var gamedata = {
                "player" : player,
                "x" : x,
                "y" : y
            };
            $.ajax({
                type: "POST",
                url: "play/" + id,
                data: gamedata,
                beforeSend: function() {
                    $('#ajax').text("Sending....");
                },
                error: function() {
                    $("#ajax").text("Error when sending to server!");
                },
                success: function( data ) {
                    $("#ajax").text("Success!");
                    board.setPositionsFromString(data.board.positions);
                    boardCanvas.draw(board.getPositions());
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
            var boardPos = boardCanvas.screenPosToBoardPos(pos)
            var x = boardPos[0];
            var y = boardPos[1];
//            var currentPlayer = player1Turn?player1:player2;
//            var retVal = board.placeStone(x,y,currentPlayer)
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
                sendToServer(player, x, y);
                return true;
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

            draw : function(){
                boardCanvas.draw(board.getPositions());
            }

        }
    }


