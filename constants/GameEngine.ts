import { GameResult, PlayerSymbol, SquareValue } from './types';

export class TicTacToeEngine {
    static readonly WINNING_LINES = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6],           // Diagonals
    ];

    static calculateWinner(squares: SquareValue[]): { winner: GameResult; line: number[] | null } | null {
        for (const line of this.WINNING_LINES) {
            const [a, b, c] = line;
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a] as GameResult, line };
            }
        }

        if (squares.every(square => square !== null)) {
            return { winner: 'Draw', line: null };
        }

        return null;
    }

    static getNextPlayer(xIsNext: boolean): PlayerSymbol {
        return xIsNext ? 'X' : 'O';
    }
}
