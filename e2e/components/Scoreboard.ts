import { Locator, Page } from '@playwright/test';

export class ScoreboardComponent {
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    getXScoreLocator(): Locator {
        return this.page.getByTestId('player-x-score');
    }

    getOScoreLocator(): Locator {
        return this.page.getByTestId('player-o-score');
    }

    getDrawsLocator(): Locator {
        return this.page.getByTestId('draws-count');
    }

    async getPlayerXScore(): Promise<string> {
        return await this.getXScoreLocator().innerText();
    }

    async getPlayerOScore(): Promise<string> {
        return await this.getOScoreLocator().innerText();
    }

    async getDrawsCount(): Promise<string> {
        return await this.getDrawsLocator().innerText();
    }

    getPlayerXNameLocator(): Locator {
        return this.page.getByTestId('player-x-name');
    }

    async getPlayerXName(): Promise<string> {
        return await this.getPlayerXNameLocator().innerText();
    }

    async getPlayerOName(): Promise<string> {
        return await this.page.getByTestId('player-o-name').innerText();
    }

    async clickPlayerX() {
        await this.page.getByTestId('player-x-btn').click();
    }

    async clickPlayerO() {
        await this.page.getByTestId('player-o-btn').click();
    }
}
