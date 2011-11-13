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
   public String positions;

    @Transient
    public char[][] theBoard;

    public Board(Game game, int size) {
        if (size != 13 && size != 9) {
            size = MAX;
        }
        this.size = size;
        positions = "";
        this.game = game;
        this.theBoard = new char[size][size];
        for (int i = 0; i < this.size; i++) {
            for (int j = 0; j < this.size; j++) {
                theBoard[i][j] = '.'; //free space
            }
        }
    }

    public boolean play(char color, int x, int y) {
        if (size <= x || size <= y) {
            return false;
        }
        Character c = theBoard[x][y];
        if ( c.equals('.')) { //space is free
            //should perform proper validation here..
            theBoard[x][y] = color;
            positions = generateBoardAsString();
            return true;
        }
        return false;
    }

    public String generateBoardAsString() {
        StringBuilder board = new StringBuilder("");
        char sep = ',';
        for (int i = 0; i < this.size; i++) {
            for (int j = 0; j < this.size; j++) {
                board.append(theBoard[i][j]).append(sep);
            }
        }
        board.setLength(board.length() -1);
        return board.toString();
    }
}
