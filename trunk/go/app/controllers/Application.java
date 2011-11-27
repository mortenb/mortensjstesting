package controllers;

import flexjson.JSONSerializer;
import models.Game;
import play.data.validation.Required;
import play.mvc.*;


public class Application extends Controller {

    public static void index() {
            render();
        }

        public static void play(Long id, @Required int x, @Required int y) {
            Game g = Game.findById(id);
            String playerId = session.get("playerId");

            if (validation.hasErrors()) {
                render("Application/show.html", g);
            }
            System.out.println(" playerId = " + playerId + " , id = " + id + " ( " + x + ", " + y + ")");
            int res = 0;
            if (g != null) {
                res = g.play(playerId, x, y);
            }
            JSONSerializer gameSerializer = new JSONSerializer();
            renderJSON((gameSerializer.serialize(g)));
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
            game.player = session.get("playerId");
            render(game);
//            JSONSerializer gameSerializer = new JSONSerializer().include(
//                            "isPlayer1Turn",
//                            "board.positions"
//                            );
//            renderJSON(new String(gameSerializer.serialize(game)));
        }

    public static void load(Long id, String playerId, int res) {
        Game game = Game.findById(id);
        game.myStatusCode = res;
        game.player = playerId;
            JSONSerializer gameSerializer = new JSONSerializer();
            renderJSON(new String(gameSerializer.serialize(game)));
    }
}