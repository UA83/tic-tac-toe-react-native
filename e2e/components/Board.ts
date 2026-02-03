import { Locator, Page } from '@playwright/test';

export class BoardComponent {
    public readonly page: Page;
    private readonly squares: Locator;

    constructor(page: Page) {
        this.page = page;
        this.squares = page.locator('[data-testid^="square-"]');
    }

    async clickSquare(index: number) {
        await this.page.getByTestId(`square-${index}`).click();
    }

    async getSquareValue(index: number): Promise<string> {
        return await this.page.getByTestId(`square-${index}`).innerText();
    }

    async isSquareEnabled(index: number): Promise<boolean> {
        return await this.page.getByTestId(`square-${index}`).isEnabled();
    }
}
