package controllers;

import flexjson.JSONSerializer;
import models.Game;
import play.data.validation.Required;
import play.mvc.*;


public class Application extends Controller {

    public static void index() {
            render();
        }

        public static void play(Long id, @Required String player, @Required int x, @Required int y) {
            Game g = Game.findById(id);
            if (validation.hasErrors()) {
                render("Application/show.html", g);
            }
            System.out.println("id = " + id + " player = " + player + " ( " + x + ", " + y + ")");
            if (g != null) {
                char p = player.charAt(0);
                if (g.play(p, x, y)) {
                    flash.success("%s played %s %s", player, x, y);
                } else {
                    flash.error("Invalid move: %s played %s %s", player, x, y);
                }
            }
            System.out.println(player + " played! ( " + x + ", " + y + ")");
            show(g.id);

        }

        public static void create(int size) {
            Game game = new Game(size).save();
            show(game.id);

        }

        public static void show(Long id) {
            Game game = Game.findById(id);
            render(game);
//            JSONSerializer gameSerializer = new JSONSerializer().include(
//                            "isPlayer1Turn",
//                            "board.positions"
//                            );
//            renderJSON(new String(gameSerializer.serialize(game)));
        }


}