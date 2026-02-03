import { expect, test } from '../fixtures/game-fixture';

test.describe('Tic Tac Toe Move Undo', () => {

    test('should allow undoing the very last move', async ({ gamePage }) => {
        // 1. Player X marks square 0
        await gamePage.board.clickSquare(0);
        await expect(gamePage.board.getSquareLocator(0).getByTestId('square-icon-X')).toBeVisible();
        await expect(gamePage.getStatusLocator()).toContainText("Player O's Turn");

        // 2. Player X clicks square 0 again to undo
        await gamePage.board.clickSquare(0);
        await expect(gamePage.board.getSquareLocator(0).getByTestId('square-icon-X')).not.toBeVisible();
        await expect(gamePage.getStatusLocator()).toContainText("Player X's Turn");
    });

    test('should not allow undoing a move that is not the last one', async ({ gamePage }) => {
        // 1. Player X marks square 0
        await gamePage.board.clickSquare(0);
        await expect(gamePage.board.getSquareLocator(0).getByTestId('square-icon-X')).toBeVisible();

        // 2. Player O marks square 1
        await gamePage.board.clickSquare(1);
        await expect(gamePage.board.getSquareLocator(1).getByTestId('square-icon-O')).toBeVisible();

        // 3. Player X tries to click square 0 (his move, but not the last one)
        // Nothing should happen (it should stay X)
        await gamePage.board.clickSquare(0);
        await expect(gamePage.board.getSquareLocator(0).getByTestId('square-icon-X')).toBeVisible();
        await expect(gamePage.getStatusLocator()).toContainText("Player X's Turn");
    });

    test('should allow undoing back and forth', async ({ gamePage }) => {
        await gamePage.board.clickSquare(0); // X marks 0
        await expect(gamePage.board.getSquareLocator(0).getByTestId('square-icon-X')).toBeVisible();

        await gamePage.board.clickSquare(0); // X undos 0
        await expect(gamePage.board.getSquareLocator(0).getByTestId('square-icon-X')).not.toBeVisible();

        await gamePage.board.clickSquare(1); // X marks 1
        await expect(gamePage.board.getSquareLocator(1).getByTestId('square-icon-X')).toBeVisible();

        await gamePage.board.clickSquare(1); // X undos 1
        await expect(gamePage.board.getSquareLocator(1).getByTestId('square-icon-X')).not.toBeVisible();

        await gamePage.board.clickSquare(2); // X marks 2
        await expect(gamePage.board.getSquareLocator(2).getByTestId('square-icon-X')).toBeVisible();
    });
});
