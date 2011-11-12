package controllers;

import play.mvc.Controller;

public class Game extends Controller {

    public static void play(String player, String x, String y) {
        System.out.println(player + " played! ( " + x + ", " + y + ")");
    }

}