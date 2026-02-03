import { expect, test } from '../fixtures/game-fixture';

test.describe('Tic Tac Toe Scoring', () => {

    test('should increment score on win', async ({ gamePage }) => {
        await expect(gamePage.scoreboard.getXScoreLocator()).toHaveText('0');

        // Quick win for X
        await gamePage.board.clickSquare(0); // X
        await gamePage.board.clickSquare(3); // O
        await gamePage.board.clickSquare(1); // X
        await gamePage.board.clickSquare(4); // O
        await gamePage.board.clickSquare(2); // X

        await expect(gamePage.scoreboard.getXScoreLocator()).toHaveText('1');
    });

    test('should increment draws count', async ({ gamePage }) => {
        await expect(gamePage.scoreboard.getDrawsLocator()).toHaveText('0');

        // Force a draw
        const moves = [0, 1, 2, 5, 3, 6, 4, 8, 7];
        for (const move of moves) {
            await gamePage.board.clickSquare(move);
        }

        await expect(gamePage.scoreboard.getDrawsLocator()).toHaveText('1');
    });

    test('should reset scoreboard entirely', async ({ gamePage }) => {
        // Get a point first
        await gamePage.board.clickSquare(0);
        await gamePage.board.clickSquare(3);
        await gamePage.board.clickSquare(1);
        await gamePage.board.clickSquare(4);
        await gamePage.board.clickSquare(2);

        await expect(gamePage.scoreboard.getXScoreLocator()).toHaveText('1');

        await gamePage.clickResetScore();

        await expect(gamePage.scoreboard.getXScoreLocator()).toHaveText('0');
        await expect(gamePage.scoreboard.getDrawsLocator()).toHaveText('0');
    });
});
