import { expect, test } from '../fixtures/game-fixture';

test.describe('Tic Tac Toe Smoke Test', () => {
    test('should load the game with initial state', async ({ gamePage }) => {
        // Verify title/status (with auto-wait)
        await expect(gamePage.getStatusLocator()).toContainText('Turn', { timeout: 10000 });

        // Verify scoreboard is visible
        const playerXNameLocator = gamePage.scoreboard.getPlayerXNameLocator();
        await expect(playerXNameLocator).toHaveText('Player X');

        // Verify board is visible
        const firstSquare = gamePage.page.getByTestId('square-0');
        await expect(firstSquare).toBeVisible();
    });

    test('should allow customising player name', async ({ gamePage }) => {
        await gamePage.scoreboard.clickPlayerX();
        expect(await gamePage.colorPicker.isVisible()).toBe(true);

        const newName = 'Antigravity';
        await gamePage.colorPicker.editPlayerName(newName);

        // Modal closes and name updates
        expect(await gamePage.colorPicker.isVisible()).toBe(false);
        await expect(gamePage.scoreboard.getPlayerXNameLocator()).toHaveText(newName);
    });
});
