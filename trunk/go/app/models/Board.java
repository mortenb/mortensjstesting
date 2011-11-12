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

    public Board(Game game, int size) {
        if (size != 13 && size != 9) {
            size = MAX;
        }
        this.size = size;
        positions = "";
        this.game = game;
    }
}
