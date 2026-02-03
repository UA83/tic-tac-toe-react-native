export type PlayerSymbol = 'X' | 'O';
export type SquareValue = PlayerSymbol | null;
export type GameResult = PlayerSymbol | 'Draw' | null;

export interface Player {
    name: string;
    color: string;
    symbol: PlayerSymbol;
}

export interface GameState {
    board: SquareValue[];
    xIsNext: boolean;
    winner: GameResult;
    winLine: number[] | null;
    scores: {
        X: number;
        O: number;
        Draws: number;
    };
    playerNames: Record<PlayerSymbol, string>;
    playerColors: Record<PlayerSymbol, string>;
    lastWinner: PlayerSymbol | null;
}
