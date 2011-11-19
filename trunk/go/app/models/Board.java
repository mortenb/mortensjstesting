package models;

/**
 * Created by IntelliJ IDEA.
 * User: mortenb
 * Date: 11/12/11
 * Time: 11:16 PM
 * To change this template use File | Settings | File Templates.
 */

import play.db.jpa.Model;

import javax.persistence.*;

@Entity
public class Board extends Model {

    @OneToOne
    public Game game;

    private static final int[][] XYoffsets = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    public static final int MAX = 19;

    public int size;
    @Lob
    public String positions;

    @Transient
    private char[][] theBoard;
    @Transient
    private boolean[][] positionMarked;

    public Board(Game game, int size) {
        if (size != 13 && size != 9) {
            size = MAX;
        }
        this.size = size;
        this.game = game;


        theBoard = new char[size][size];
        fill2dArray(theBoard, '.');
        positions = boardToString();
    }

    public boolean play(char stoneColor, int x, int y) {
        // load transient variables
        theBoard = boardFromString(positions, this.size);
        this.positionMarked = new boolean[size][size];
        clearMarks();

        if ( x < 0 || size <= x || y < 0 ||size <= y) {
            return false;
        }

        // check if position is occupied
        if (theBoard[x][y] != '.')
            return false;

        // place stone
        theBoard[x][y] = stoneColor;

        // check if any enemy stones are captured
        int capturedStones = 0;
        int xoff, yoff;
        for (int i = 0; i < 4; i++) {
            xoff = XYoffsets[i][0];
            yoff = XYoffsets[i][1];
            clearMarks();
            if (isBlocked(x + xoff, y + yoff, stoneColor))
                capturedStones += removeMarkedStones();
        }

        // check if suicide
        char enemyStone = (stoneColor == 'W') ? 'B' : 'W';
        clearMarks();
        if (isBlocked(x, y, enemyStone)) { // oh no! suicide
            // remove placed stone
            theBoard[x][y] = '.';
            return false;
        }

        positions = boardToString();
        save();
        return true; // TODO: increase score

    }

    private String boardToString() {
        StringBuilder board = new StringBuilder("");
        for (int i = 0; i < this.size; i++) {
            for (int j = 0; j < this.size; j++) {
                board.append(theBoard[j][i]);
            }
        }
        return board.toString();
    }

    private char[][] boardFromString(String boardString, int s) {
        if (s < 1) {
            return null;
        }
        if (boardString == null || boardString == "") {
            boardString = "";
            for (int i = 0; i < s * s; i++) {
                boardString += ".";
            }
        }
        char[][] board = new char[s][s];
        char[] b = boardString.toCharArray();
        int k = 0;
        for (int i = 0; i < s; i++) {
            for (int j = 0; j < s; j++) {
                board[j][i] = b[k++];
            }
        }
        return board;
    }

    // helper functions:
    private void fill2dArray(char[][] array, char fillValue) {
        for (int i = 0; i < array.length; i++) {
            for (int j = 0; j < array[i].length; j++) {
                array[i][j] = fillValue;
            }
        }
    }

    private void clearMarks() {
        for (int i = 0; i < positionMarked.length; i++) {
            for (int j = 0; j < positionMarked[i].length; j++) {
                positionMarked[i][j] = false;
            }
        }
    }

    private int removeMarkedStones() { // returns number of removed stones
        int numberOfRemovedStones = 0;
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size; j++) {
                if (positionMarked[i][j]) {
                    theBoard[i][j] = '.'; // remove stone
                    numberOfRemovedStones++; // count
                }
            }
        }
        return numberOfRemovedStones;
    }

    private boolean isBlocked(int x, int y, char enemyStone) {
        // recursive function to check if a position is blocked
        // if the position is occupied by the the current player the surrounding positions are checked

        // check if blocked by borders
        if (x < 0 || y < 0 || x >= size || y >= size)
            return true;
        // check if position has already been marked as checked
        if (positionMarked[x][y])
            return true;
        // check if position is free
        if (theBoard[x][y] == '.')
            return false;
        // check if position is blocked the other player
        if (theBoard[x][y] == enemyStone)
            return true;

        // mark this position to prevent re-checking
        positionMarked[x][y] = true;

        // check surrounding positions
        int xoff, yoff;
        for (int i = 0; i < 4; i++) {
            xoff = XYoffsets[i][0];
            yoff = XYoffsets[i][1];
            if (!isBlocked(x + xoff, y + yoff, enemyStone))
                return false;
        }
        return true;
    }





}

