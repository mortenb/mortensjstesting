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
            String playerId = session.get("playerId");

            if (validation.hasErrors()) {
                render("Application/show.html", g);
            }
            System.out.println(" playerId = " + playerId + " , id = " + id + " player = " + player + " ( " + x + ", " + y + ")");
            if (g != null) {
                char p = player.charAt(0);
                g.play(playerId, p, x, y);
            }
            load(id);

        }

        public static void create(int size) {
            Game game = new Game(size).save();
            session.put("playerId", game.player1URL);
            show(game.id);

        }

        public static void show(Long id) {
            String playerId = params.get("playerId");
            if (playerId != null) {
                session.put("playerId", playerId);
            }
            Game game = Game.findById(id);
            render(game);
//            JSONSerializer gameSerializer = new JSONSerializer().include(
//                            "isPlayer1Turn",
//                            "board.positions"
//                            );
//            renderJSON(new String(gameSerializer.serialize(game)));
        }

    public static void load(Long id) {
        Game game = Game.findById(id);
            JSONSerializer gameSerializer = new JSONSerializer();
            renderJSON(new String(gameSerializer.serialize(game)));
        }


}