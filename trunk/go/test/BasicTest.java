import org.junit.*;
import java.util.*;
import play.test.*;
import models.*;

public class BasicTest extends UnitTest {

    Game mygame;
    char player1 = 'B';
    char player2 = 'W';

    @Before
    public void setup() {
        Fixtures.deleteDatabase();
        mygame = new Game(9).save();
    }

    @Test
    public void createSaveAndRetrieveGameAndBoard() {
        Game g = new Game(5).save();
        assertNotNull(g);
        assertEquals(g.board.size, 19);
        Game g2 = new Game(9).save();
        assertEquals(9, g2.board.size);
        assertEquals(3, Board.count());
        g.delete();
        assertEquals(2, Board.count());
    }

    @Test
    public void testLegalMoves() {
        Game g = new Game(9).save();
        assertTrue(g.play(player1, 0, 0));
        long i = g.id;
        Game hei = Game.findById(i);
        assertTrue(hei.board.positions.charAt(0) == player1);
        assertFalse(g.play(player1, 0, 0));
        assertFalse(g.play(player2, 0, 0));
        assertTrue(g.play(player2, 1, 0));
        assertTrue(hei.board.positions.charAt(1) == player2);
        assertFalse(g.play(player1, 10, 1));
        g.save();


    }

    @Test
    public void testEmptyBoardToString() {
        Game empty = new Game(9).save();
        Game newGame = new Game(9).save();

        //String e = empty.board.generateBoardAsString();

        newGame.board.theBoard = newGame.board.generateBoardFromString(null, 9);

        assertEquals(empty.board.theBoard, newGame.board.theBoard);

        Game test = new Game(54).save();
        Game test2 = new Game(19).save();
        test2.board.theBoard = newGame.board.generateBoardFromString(null, 19);

        assertEquals(test.board.theBoard, test2.board.theBoard);


    }
}
