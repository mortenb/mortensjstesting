package models;

import java.util.*;

import play.libs.F.*;

public class GameRoom {

    // ~~~~~~~~~ Let's chat! 

    final ArchivedEventStream<GameRoom.Event> gameEvents = new ArchivedEventStream<GameRoom.Event>(100);

    public static HashMap<Integer, GameRoom> gameRooms = new HashMap<Integer, GameRoom>();
    
    /**
     * For WebSocket, when a user join the room we return a continuous event stream
     * of ChatEvent
     */
    public EventStream<GameRoom.Event> join(String user) {
        gameEvents.publish(new Join(user));
        return gameEvents.eventStream();
    }
    
    /**
     * A user leave the room
     */
    public void leave(String user) {
        gameEvents.publish(new Leave(user));
    }
    
    /**
     * A user say something on the room
     */
    public void play(String user, String text) {
        gameEvents.publish(new PlayerMove(user, text));
    }
    
    /**
     * For long polling, as we are sometimes disconnected, we need to pass 
     * the last event seen id, to be sure to not miss any message
     */
    public Promise<List<IndexedEvent<GameRoom.Event>>> nextMessages(long lastReceived, int gameId) {
        return gameEvents.nextEvents(lastReceived);
    }
    
    /**
     * For active refresh, we need to retrieve the whole message archive at
     * each refresh
     */
    public List<GameRoom.Event> archive() {
        return gameEvents.archive();
    }
    
    // ~~~~~~~~~ Chat room events

    public static abstract class Event {
        
        final public String type;
        final public Long timestamp;
        
        public Event(String type) {
            this.type = type;
            this.timestamp = System.currentTimeMillis();
        }
        
    }
    
    public static class Join extends Event {
        
        final public String user;
        
        public Join(String user) {
            super("join");
            this.user = user;
        }
        
    }
    
    public static class Leave extends Event {
        
        final public String user;
        
        public Leave(String user) {
            super("leave");
            this.user = user;
        }
        
    }
    
    public static class PlayerMove extends Event {
        
        final public String user;
        final public String text;
        
        public PlayerMove(String user, String text) {
            super("playermove");
            this.user = user;
            this.text = text;
        }
        
    }

    // ~~~~~~~~~ Chat room factory

    public static GameRoom get(int gameId) {
        if(gameRooms.get(gameId) == null) {
            gameRooms.put(gameId, new GameRoom());
        }
        return gameRooms.get(gameId);
    }
    
}

