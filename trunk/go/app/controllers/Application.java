package controllers;

import flexjson.JSONSerializer;
import models.Game;
import play.mvc.*;


public class Application extends Controller {

    public static void index() {
            render();
        }

        public static void play(String player, String x, String y) {
            System.out.println(player + " played! ( " + x + ", " + y + ")");

        }

        public static void create(int size) {
            Game newGame = new Game(size).save();

        }

        public static void show() {
            Game newGame = new Game(19).save();
            JSONSerializer gameSerializer = new JSONSerializer().include(
                            "isPlayer1Turn",
                            "board"
                            ).exclude("*");
            renderJSON(new String(gameSerializer.serialize(newGame)));
        }


}