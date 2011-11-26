package models;

/**
 * Created by IntelliJ IDEA.
 * User: mortenb
 * Date: 11/12/11
 * Time: 11:16 PM
 * To change this template use File | Settings | File Templates.
 */

import javax.persistence.*;
import play.db.jpa.*;

import java.util.Calendar;

@Entity
public class Game extends Model {

    @OneToOne(mappedBy="game", cascade=CascadeType.ALL)
    public Board board;

    public char player1 = 'B';
    public char player2 = 'W';
    public boolean isPlayer1Turn;
    public String player1URL;
    public String player2URL;

    @Transient
    public volatile String status;

    @Transient
    public volatile String player;

    public Game(int boardSize) {
        board = new Board(this, boardSize);
        isPlayer1Turn = true;
        generateGameURLs();
    }

    public boolean play(String playerId, int x, int y) {
       char player;
          if (isPlayer1Turn && !player1URL.equals(playerId)) {
              status = "";
              return false;
          }
        if (!isPlayer1Turn && !player2URL.equals(playerId)) {
            return false;
        }
        if (player1URL.equals(playerId)) {
            player = player1;
        }  else {
            player = player2;
        }
        if (board.play(player, x, y)) {
            isPlayer1Turn = !isPlayer1Turn;
            save();
            System.out.println(player + " played! ( " + x + ", " + y + ")");
            return true;
        }
        return false;
    }

    public void generateGameURLs() {
        Calendar c = Calendar.getInstance();
        player1URL = "" + c.getTimeInMillis() + "1";
        player2URL = "" + c.getTimeInMillis() + "2";
    }

}
