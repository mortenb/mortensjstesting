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

@Entity
public class Game extends Model {

    @OneToOne(mappedBy="game", cascade=CascadeType.ALL)
    public Board board;

    public String player1 = "B";
    public String player2 = "W";
    public boolean isPlayer1Turn = true;

    public Game(int boardSize) {
        board = new Board(this, boardSize);
    }


}
