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

    test('should reset scoreboard entirely (including names and colors)', async ({ gamePage }) => {
        const customName = 'Player 1';

        // 1. Change name
        await gamePage.scoreboard.clickPlayerX();
        await gamePage.colorPicker.editPlayerName(customName);
        await expect(gamePage.scoreboard.getPlayerXNameLocator()).toHaveText(customName);

        // 2. Win a game
        await gamePage.board.clickSquare(0); // X
        await gamePage.board.clickSquare(3); // O
        await gamePage.board.clickSquare(1); // X
        await gamePage.board.clickSquare(4); // O
        await gamePage.board.clickSquare(2); // X

        await expect(gamePage.scoreboard.getXScoreLocator()).toHaveText('1');

        // 3. Wait for victory banner to finish auto-reset
        // This ensures the game is in a stable state before clicking Reset Score
        await expect(gamePage.victoryOverlay.getTitleLocator()).toBeVisible();
        await expect(gamePage.victoryOverlay.getTitleLocator()).not.toBeVisible({ timeout: 10000 });

        // 4. Reset Scoreboard
        await gamePage.clickResetScore();

        // 5. Verify everything is reset
        await expect(gamePage.scoreboard.getXScoreLocator()).toHaveText('0');
        await expect(gamePage.scoreboard.getDrawsLocator()).toHaveText('0');
        await expect(gamePage.scoreboard.getPlayerXNameLocator()).toHaveText('Player X');
    });
});
