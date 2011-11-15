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

   public static final int MAX = 19;
   public int size;
   @Lob
   public String positions;

    @Transient
    public char[][] theBoard;

    public Board(Game game, int size) {
        if (size != 13 && size != 9) {
            size = MAX;
        }
        this.size = size;
        this.game = game;
        this.theBoard = new char[size][size];
        for (int i = 0; i < this.size; i++) {
            for (int j = 0; j < this.size; j++) {
                theBoard[i][j] = '.'; //free space
            }
        }
        positions = generateBoardAsString();
    }

    public boolean play(char color, int x, int y) {
        if (size <= x || size <= y) {
            return false;
        }
        theBoard = generateBoardFromString(positions, this.size);
        Character c = theBoard[x][y];
        if ( c.equals('.')) { //space is free
            //should perform proper validation here..
            theBoard[x][y] = color;
            positions = generateBoardAsString();
            save();
            return true;
        }
        return false;
    }

    public String generateBoardAsString() {
        StringBuilder board = new StringBuilder("");
        for (int i = 0; i < this.size; i++) {
            for (int j = 0; j < this.size; j++) {
                board.append(theBoard[i][j]);
            }
        }
        return board.toString();
    }

    public char[][] generateBoardFromString(String boardString, int s) {
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
                board[i][j] = b[k++];
            }
        }
        return board;
    }
}
