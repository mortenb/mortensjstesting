package models;

import java.util.*;

import play.libs.F.*;

public class GameRoom {


    final ArchivedEventStream<GameRoom.Event> gameEvents = new ArchivedEventStream<GameRoom.Event>(5);

    public static HashMap<String, GameRoom> gameRooms = new HashMap<String, GameRoom>();
    
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
    public void play(int x, int y) {
        gameEvents.publish(new PlayerMove(x, y));
    }
    
    /**
     * For long polling, as we are sometimes disconnected, we need to pass 
     * the last event seen id, to be sure to not miss any message
     */
    public Promise<List<IndexedEvent<GameRoom.Event>>> nextMessages(long lastReceived) {
        return gameEvents.nextEvents(lastReceived);
    }

    public long getLastPublishedEventId(){
        List<IndexedEvent> eventList = gameEvents.availableEvents(0);
        long lastReceived = 0;
        if( eventList.size() > 0 ){
            lastReceived = eventList.get(eventList.size() - 1 ).id;
        }
        return( lastReceived );
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
        
        final public int x;
        final public int y;
        
        public PlayerMove(int x, int y) {
            super("playermove");
            this.x = x;
            this.y = y;
        }
        
    }


    public static GameRoom get(String playerId) {
        if(gameRooms.get(playerId) == null) {
            gameRooms.put(playerId, new GameRoom());
        }
        return gameRooms.get(playerId);
    }
    
}
