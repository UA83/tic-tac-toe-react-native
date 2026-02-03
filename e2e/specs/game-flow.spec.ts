import { expect, test } from '../fixtures/game-fixture';

test.describe('Tic Tac Toe Game Flow', () => {

    test('should alternate turns correctly', async ({ gamePage }) => {
        await expect(gamePage.getStatusLocator()).toContainText("Player X's Turn");

        await gamePage.board.clickSquare(0);
        await expect(gamePage.getStatusLocator()).toContainText("Player O's Turn");

        await gamePage.board.clickSquare(1);
        await expect(gamePage.getStatusLocator()).toContainText("Player X's Turn");
    });

    test('should not allow clicking an occupied square (non-undo)', async ({ gamePage }) => {
        await gamePage.board.clickSquare(0); // X marks 0
        await gamePage.board.clickSquare(1); // O marks 1
        await expect(gamePage.getStatusLocator()).toContainText("Player X's Turn");

        // Click square 0 (held by X). It should NOT undo because O marked 1 last.
        await gamePage.board.clickSquare(0);
        await expect(gamePage.getStatusLocator()).toContainText("Player X's Turn");
    });

    test('should detect a horizontal win for X', async ({ gamePage }) => {
        // X: 0, 1, 2 (Top row)
        // O: 3, 4 (Middle row)
        await gamePage.board.clickSquare(0); await gamePage.page.waitForTimeout(400); // X
        await gamePage.board.clickSquare(3); await gamePage.page.waitForTimeout(400); // O
        await gamePage.board.clickSquare(1); await gamePage.page.waitForTimeout(400); // X
        await gamePage.board.clickSquare(4); await gamePage.page.waitForTimeout(400); // O
        await gamePage.board.clickSquare(2);

        // Status updates to winner message (includes the symbol now)
        await expect(gamePage.getStatusLocator()).toContainText('Player X Wins!', { timeout: 10000 });
        await expect(gamePage.getStatusLocator()).toContainText('(X)', { timeout: 10000 });
        await expect(gamePage.victoryOverlay.getTitleLocator()).toHaveText('VICTORY', { timeout: 10000 });
    });

    test('should detect a draw', async ({ gamePage }) => {
        const moves = [0, 1, 2, 5, 3, 6, 4, 8, 7];
        for (const move of moves) {
            await gamePage.board.clickSquare(move);
            await gamePage.page.waitForTimeout(300);
        }

        await expect(gamePage.getStatusLocator()).toHaveText("It's a Draw!", { timeout: 10000 });
        await expect(gamePage.victoryOverlay.getTitleLocator()).toHaveText('DRAW', { timeout: 10000 });
    });

    test('should auto-reset the board after a win', async ({ gamePage }) => {
        await gamePage.board.clickSquare(0); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(3); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(1); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(4); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(2);

        await expect(gamePage.victoryOverlay.getTitleLocator()).toBeVisible();

        // Wait for auto-reset (constant is 2s now)
        await expect(gamePage.victoryOverlay.getTitleLocator()).not.toBeVisible({ timeout: 10000 });
        await expect(gamePage.getStatusLocator()).toContainText('Turn');
    });
});
