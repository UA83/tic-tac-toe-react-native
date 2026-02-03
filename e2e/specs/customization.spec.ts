import { expect, test } from '../fixtures/game-fixture';

test.describe('Tic Tac Toe Player Customisation', () => {

    test('should clear default player names on focus', async ({ gamePage }) => {
        await gamePage.scoreboard.clickPlayerX();
        const input = gamePage.page.getByTestId('player-name-input');

        await expect(input).toHaveValue('Player X', { timeout: 10000 });
        await input.click();
        await expect(input).toHaveValue('', { timeout: 10000 });
    });

    test('should persist custom name through wins', async ({ gamePage }) => {
        const customName = 'King Arthur';

        await gamePage.scoreboard.clickPlayerX();
        await gamePage.colorPicker.editPlayerName(customName);
        await expect(gamePage.scoreboard.getPlayerXNameLocator()).toHaveText(customName, { timeout: 10000 });

        // Win a game with delays
        await gamePage.board.clickSquare(0); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(3); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(1); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(4); await gamePage.page.waitForTimeout(400);
        await gamePage.board.clickSquare(2);

        // Victory subtitle contains name and "DOMINATES"
        await expect(gamePage.victoryOverlay.getSubtitleLocator()).toContainText('DOMINATES', { timeout: 10000 });
        await expect(gamePage.victoryOverlay.getSubtitleLocator()).toContainText(customName, { timeout: 10000 });
    });

    test('should not allow selecting a taken color', async ({ gamePage }) => {
        await gamePage.scoreboard.clickPlayerX();

        const input = gamePage.page.getByTestId('player-name-input');
        await expect(input).toBeVisible();

        // INITIAL_COLORS: X is Red (idx 0), O is Blue (idx 1)
        // Try to select Blue (idx 1) for player X
        await gamePage.page.click('[data-testid="color-option-idx-1"]');

        // Toast should appear
        const toast = gamePage.page.getByTestId('color-picker-toast');
        await expect(toast).toBeVisible({ timeout: 10000 });
        await expect(toast).toContainText('already taken');
    });

    test('should update modal title after name change', async ({ gamePage }) => {
        const newName = 'Champion';

        // 1. Open customization for Player X
        await gamePage.scoreboard.clickPlayerX();

        // 2. Change the name and save
        await gamePage.colorPicker.editPlayerName(newName);

        // 3. Confirm name changed on scoreboard (which also confirms modal closed)
        await expect(gamePage.scoreboard.getPlayerXNameLocator()).toHaveText(newName, { timeout: 10000 });

        // 4. Reopen customization for the same player
        await gamePage.scoreboard.clickPlayerX();

        // 5. Check if the title reflects the new name
        // The title format is "Customize {name} ({symbol})"
        await expect(gamePage.colorPicker.getTitleLocator()).toContainText(newName, { timeout: 10000 });
        await expect(gamePage.colorPicker.getTitleLocator()).toContainText('X', { timeout: 10000 });
    });
});
