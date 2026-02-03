import { Page } from '@playwright/test';

export class ColorPickerModalComponent {
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async isVisible(): Promise<boolean> {
        return await this.page.getByTestId('player-name-input').isVisible();
    }

    async editPlayerName(newName: string) {
        const input = this.page.getByTestId('player-name-input');
        await input.clear();
        await input.fill(newName);
        await input.press('Enter');
    }

    async selectColor(colorHex: string) {
        // Hex colors in testID need to be handled carefully if they contain #
        // But we just use the hex string in the testID
        await this.page.getByTestId(`color-option-${colorHex}`).click();
    }

    async getToastMessage(): Promise<string | null> {
        const toast = this.page.locator('[data-testid="color-picker-toast"]');
        if (await toast.isVisible()) {
            return await toast.innerText();
        }
        return null;
    }
}
