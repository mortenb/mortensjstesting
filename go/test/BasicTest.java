import org.junit.*;
import java.util.*;
import play.test.*;
import models.*;

public class BasicTest extends UnitTest {

    @Before
    public void setup() {
        Fixtures.deleteDatabase();
    }

    @Test
    public void createSaveAndRetrieveGameAndBoard() {
        Game g = new Game(5).save();
        assertNotNull(g);
        assertEquals(g.board.size, 19);
        Game g2 = new Game(9).save();
        assertEquals(9, g2.board.size);
        assertEquals(2, Board.count());
        g.delete();
        assertEquals(1, Board.count());
    }

    @Test
    public void testLegalMoves() {
        Game g = new Game(9).save();
        char player1 = 'B';
        char player2 = 'W';
        assertTrue(g.play(player1, 0, 0));
        assertFalse(g.play(player1, 0, 0));
        assertFalse(g.play(player2, 0, 0));
        assertTrue(g.play(player2, 0, 1));
        assertFalse(g.play(player1, 10, 1));
        g.save();
    }

}
