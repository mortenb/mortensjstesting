function Game(canvas, size) {
    this.playerBlackPoints = 0;
    this.playerWhitePoints = 0;
    this.playerTurn = 'B';

    this.board = GoBoard(size);
    this.boardCanvas = BoardCanvas(canvas, size);

    this.play = function(x, y) {

        var retVal = this.board.placeStone(x,y,this.playerTurn)

        if ( retVal.legalMove ) {

            if ( this.playerTurn == 'B' ) {
                this.playerBlackPoints += retVal.points;
                this.playerTurn = 'W' // switch turn
            } else {
                this.playerWhitePoints += retVal.points;
                this.playerTurn = 'B' // switch turn
            }

            // update screen
            this.boardCanvas.draw(this.board.getPositions());
            return true;
        }
        return false; // illegal move
    }

    this.draw = function(){
        this.boardCanvas.draw( this.board.getPositions() );
    }
}

