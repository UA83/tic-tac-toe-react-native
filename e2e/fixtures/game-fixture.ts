import { test as base } from '@playwright/test';
import { GamePage } from '../pages/GamePage';

type Fixtures = {
    gamePage: GamePage;
};

export const test = base.extend<Fixtures>({
    gamePage: async ({ page }, use) => {
        const gamePage = new GamePage(page);
        await gamePage.goto();
        // Force a hard reload to ensure React state is wiped clean between tests
        await page.reload();
        await page.waitForLoadState('networkidle');
        await use(gamePage);
    },
});

export { expect } from '@playwright/test';
