package controllers;

import com.google.gson.reflect.TypeToken;
import flexjson.JSONSerializer;
import models.Game;
import models.GameRoom;
import play.data.validation.Required;
import play.libs.F;
import play.mvc.*;

import java.util.List;


public class Application extends Controller {

    public static void index() {
            render();
        }

        public static void play(Long id, @Required String playerId, @Required int x, @Required int y) {
            Game g = Game.findById(id);

            if (validation.hasErrors()) {
                render("Application/show.html", g);
            }
            System.out.println(" playerId = " + playerId + " , id = " + id + " ( " + x + ", " + y + ")");

            int res = 0;
            if (g != null) {
                res = g.play(playerId, x, y);
            }
            if( res >= 0 ){
                GameRoom.get( g.otherPlayerId( playerId ) ).play(x,y);
                System.out.println("move sent to other player!");
            } else {
                System.out.println("move failed!");
            }

            JSONSerializer gameSerializer = new JSONSerializer();
            renderJSON((gameSerializer.serialize(g)));
        }

        public static void create(int size) {
            Game game = new Game(size).save();
            show(game.id, game.playerBlackId);
        }

        public static void show(Long id, @Required String playerId ) {
            Game game = Game.findById(id);
            long lastReceived = GameRoom.get( playerId ).getLastPublishedEventId();
            char player = playerId.equals(game.playerBlackId) ? 'B':'W';
            render(game, playerId, lastReceived, player);
        }


    public static void waitMessages(Long lastReceived, String playerId) {
        // Here we use continuation to suspend
        // the execution until a new message has been received
        System.out.println(playerId + " waiting for event");
        List messages = await(GameRoom.get(playerId).nextMessages( lastReceived ));
        System.out.println(playerId + " Event received!" + messages.toString());
        renderJSON(messages, new TypeToken<List<F.IndexedEvent<GameRoom.Event>>>() {}.getType());
    }
}