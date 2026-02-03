import React, { useCallback, useState } from 'react';
import { INITIAL_COLORS, INITIAL_PLAYER_NAMES } from '../constants/GameConstants';
import { TicTacToeEngine } from '../constants/GameEngine';
import { GameResult, PlayerSymbol, SquareValue } from '../constants/types';

interface UseTicTacToeReturn {
    board: SquareValue[];
    xIsNext: boolean;
    scores: { X: number; O: number; Draws: number };
    winner: GameResult;
    winLine: number[] | null;
    lastMoveIndex: number | null;
    playerNames: Record<PlayerSymbol, string>;
    playerColors: Record<PlayerSymbol, string>;
    showWinnerOverlay: boolean;
    showDrawOverlay: boolean;
    toastMessage: string | null;
    setPlayerNames: React.Dispatch<React.SetStateAction<Record<PlayerSymbol, string>>>;
    setPlayerColors: React.Dispatch<React.SetStateAction<Record<PlayerSymbol, string>>>;
    setShowWinnerOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    setShowDrawOverlay: React.Dispatch<React.SetStateAction<boolean>>;
    setToastMessage: React.Dispatch<React.SetStateAction<string | null>>;
    makeMove: (index: number) => void;
    resetGame: () => void;
    resetScoreboard: () => void;
}

export const useTicTacToe = (): UseTicTacToeReturn => {
    const [board, setBoard] = useState<SquareValue[]>(Array(9).fill(null));
    const [xIsNext, setXIsNext] = useState(true);
    const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
    const [lastWinner, setLastWinner] = useState<PlayerSymbol | null>(null);
    const [lastMoveIndex, setLastMoveIndex] = useState<number | null>(null);
    const [playerNames, setPlayerNames] = useState(INITIAL_PLAYER_NAMES);
    const [playerColors, setPlayerColors] = useState(INITIAL_COLORS);
    const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);
    const [showDrawOverlay, setShowDrawOverlay] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const winInfo = TicTacToeEngine.calculateWinner(board);
    const winner = winInfo ? winInfo.winner : null;
    const winLine = winInfo ? winInfo.line : null;

    const makeMove = (index: number) => {
        // Undo logic: if clicking the same square that was just marked
        if (index === lastMoveIndex && board[index]) {
            const newBoard = [...board];
            const clearedPlayer = newBoard[index] as PlayerSymbol;
            newBoard[index] = null;
            setBoard(newBoard);
            setXIsNext(clearedPlayer === 'X'); // Revert turn
            setLastMoveIndex(null);

            // If the cleared move was a winning/drawing move, decrement scores
            // Use the board *before* clearing to check if it was a win
            const winInfoBeforeUndo = TicTacToeEngine.calculateWinner(board);
            if (winInfoBeforeUndo) {
                const updatedScores = { ...scores };
                if (winInfoBeforeUndo.winner === clearedPlayer) {
                    updatedScores[clearedPlayer] = Math.max(0, updatedScores[clearedPlayer] - 1);
                    setScores(updatedScores);
                    setShowWinnerOverlay(false);
                } else if (winInfoBeforeUndo.winner === 'Draw') {
                    updatedScores.Draws = Math.max(0, updatedScores.Draws - 1);
                    setScores(updatedScores);
                    setShowDrawOverlay(false);
                }
            }
            return;
        }

        if (board[index] || winner) return;

        const newBoard = [...board];
        const currentPlayer = xIsNext ? 'X' : 'O';
        newBoard[index] = currentPlayer;
        setBoard(newBoard);
        setLastMoveIndex(index);

        const nextWinInfo = TicTacToeEngine.calculateWinner(newBoard);
        if (nextWinInfo) {
            if (nextWinInfo.winner === 'Draw') {
                setScores(s => ({ ...s, Draws: s.Draws + 1 }));
                setLastWinner(null);
            } else {
                const winPlayer = nextWinInfo.winner as PlayerSymbol;
                setScores(s => ({ ...s, [winPlayer]: s[winPlayer] + 1 }));
                setLastWinner(winPlayer);
            }
        }

        setXIsNext(!xIsNext);
    };

    const resetGame = useCallback(() => {
        setBoard(Array(9).fill(null));
        setLastMoveIndex(null);
        setShowWinnerOverlay(false);
        setShowDrawOverlay(false);
        if (lastWinner) {
            setXIsNext(lastWinner === 'X');
        } else {
            setXIsNext(prev => !prev);
        }
    }, [lastWinner]);

    const resetScoreboard = () => {
        setScores({ X: 0, O: 0, Draws: 0 });
        setPlayerNames(INITIAL_PLAYER_NAMES);
        setPlayerColors(INITIAL_COLORS);
        setLastWinner(null);
        resetGame();
    };

    return {
        board,
        xIsNext,
        scores,
        winner,
        winLine,
        lastMoveIndex,
        playerNames,
        playerColors,
        showWinnerOverlay,
        showDrawOverlay,
        toastMessage,
        setPlayerNames,
        setPlayerColors,
        setShowWinnerOverlay,
        setShowDrawOverlay,
        setToastMessage,
        makeMove,
        resetGame,
        resetScoreboard,
    };
};
