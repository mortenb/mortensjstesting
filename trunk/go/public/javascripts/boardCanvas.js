var BoardCanvas = function(canvas, size) {
    //private properties / methods:
    var numberOf = size;
    var ctx = canvas[0].getContext("2d");

    var width = canvas.width();
    var height = canvas.height();

    var gridWidth = width / numberOf;
    var gridHeight = height / numberOf;
    var stoneSize = gridWidth / 2.5

    function drawBoard(positions) {

        // fill background color
        ctx.beginPath();
        ctx.fillStyle = "#ea0";
        ctx.fillRect(0, 0, width, height);

        // set line style
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 4; // TODO: change width according to canvas and board size??

        // draw board grid
        for (i = 0; i <= numberOf; i++) {
            drawLine( gridToScreenXY(0,i), gridToScreenXY(numberOf-1,i))
            drawLine(gridToScreenXY(i,0),gridToScreenXY(i,numberOf-1))
        }

        // draw black dots on the board
        ctx.fillStyle = "#000";
        for (i = -1; i <= 1; i++) {
            for (j = -1; j <= 1; j++) {
                // default: ( numberOf == 19 )
                screenXY = gridToScreenXY( 9 + i*6 , 9 + j*6);

                if( numberOf == 9 ){
                    if(Math.abs(i+j)%2 == 0)
                        screenXY = gridToScreenXY( 4 + i*2 , 4 + j*2);
                    else
                        screenXY = gridToScreenXY( 4 , 4 );
                } else if( numberOf == 13 )
                    screenXY = gridToScreenXY( 6 + i*3 , 6 + j*3);
                drawCircle( screenXY[0], screenXY[1], gridWidth/8);
            }
        }

        //draw stones in play based on the positions array:
        for (i = 0; i < numberOf; i++) {
            for (var j = 0; j < numberOf; j++) {
                var val = positions[i][j];
                if (val != ".") {
                    screenXY = gridToScreenXY(i,j);
                    drawStone(val, screenXY[0], screenXY[1]);
                }
            }
        }

    }




    function gridToScreenXY(gridX, gridY) {
        return [ ((gridX * gridWidth) + gridWidth / 2), ( (gridY * gridHeight) + gridHeight / 2)];
    }

    function drawCircle( xPos, yPos, size) {
        ctx.beginPath();
        ctx.arc(xPos, yPos, size, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    function drawLine( startXY, endXY ){
        ctx.beginPath();
        ctx.moveTo(startXY[0],startXY[1]);
        ctx.lineTo(endXY[0],endXY[1]);
        ctx.stroke();
        ctx.closePath();
    }
    
    function drawStone(stoneColor, xPos, yPos ) {
        if (stoneColor == "B") {
            ctx.fillStyle = "#000";
        } else {
            ctx.fillStyle = "#FFF";
        }
        drawCircle(xPos, yPos, stoneSize)
    }



    // Public members
    return {
        draw : drawBoard,
        screenPosToBoardPos : function(screenPos) {
            return [ Math.floor(screenPos[0]/gridWidth), Math.floor(screenPos[1]/gridHeight)];
        }
    }
}

