import { Locator, Page } from '@playwright/test';

export abstract class BasePage {
    public readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(path: string = '/') {
        await this.page.goto(path);
    }

    protected getByTestId(testId: string): Locator {
        return this.page.getByTestId(testId);
    }
}
