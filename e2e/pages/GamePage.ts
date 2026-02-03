import { Locator, Page } from '@playwright/test';
import { BoardComponent } from '../components/Board';
import { ColorPickerModalComponent } from '../components/ColorPicker';
import { ScoreboardComponent } from '../components/Scoreboard';
import { VictoryOverlayComponent } from '../components/VictoryOverlay';
import { BasePage } from './BasePage';

export class GamePage extends BasePage {
    public readonly board: BoardComponent;
    public readonly scoreboard: ScoreboardComponent;
    public readonly colorPicker: ColorPickerModalComponent;
    public readonly victoryOverlay: VictoryOverlayComponent;

    constructor(page: Page) {
        super(page);
        this.board = new BoardComponent(page);
        this.scoreboard = new ScoreboardComponent(page);
        this.colorPicker = new ColorPickerModalComponent(page);
        this.victoryOverlay = new VictoryOverlayComponent(page);
    }

    getStatusLocator(): Locator {
        return this.page.getByTestId('game-status');
    }

    async getStatusText(): Promise<string> {
        return await this.getStatusLocator().innerText();
    }

    async clickNewRound() {
        await this.page.getByTestId('new-round-btn').click();
    }

    async clickResetScore() {
        await this.page.getByTestId('reset-score-btn').click();
    }

    async getAppVersion(): Promise<string> {
        return await this.page.getByTestId('app-version').innerText();
    }
}
