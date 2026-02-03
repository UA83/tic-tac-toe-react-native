import { Locator, Page } from '@playwright/test';

export class VictoryOverlayComponent {
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getTitleLocator(): Locator {
        return this.page.getByTestId('victory-title');
    }

    getSubtitleLocator(): Locator {
        return this.page.getByTestId('victory-subtitle');
    }

    async isVisible(): Promise<boolean> {
        return await this.getTitleLocator().isVisible();
    }

    async getVictoryTitle(): Promise<string> {
        return await this.getTitleLocator().innerText();
    }

    async getVictorySubtitle(): Promise<string> {
        return await this.getSubtitleLocator().innerText();
    }
}
