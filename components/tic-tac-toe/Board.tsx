import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';
import { GAME_CONSTANTS } from '../../constants/GameConstants';
import { GameResult, PlayerSymbol, SquareValue } from '../../constants/types';
import { Square } from './Square';

interface BoardProps {
    board: SquareValue[];
    onSquarePress: (index: number) => void;
    winLine: number[] | null;
    playerColors: Record<PlayerSymbol, string>;
    winner: GameResult;
}

export const Board = ({ board, onSquarePress, winLine, playerColors, winner }: BoardProps) => {
    const boardScale = useSharedValue(1);

    useEffect(() => {
        if (winner) {
            boardScale.value = withSequence(
                withSpring(1.05),
                withSpring(1)
            );
        }
    }, [winner, boardScale]);

    const boardAnimatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: boardScale.value }]
    }));

    return (
        <Animated.View style={[styles.boardContainer, boardAnimatedStyle]}>
            <View style={[styles.board, { width: GAME_CONSTANTS.GRID_SIZE, height: GAME_CONSTANTS.GRID_SIZE, padding: GAME_CONSTANTS.BOARD_PADDING }]}>
                <View style={[styles.grid, { gap: GAME_CONSTANTS.SQUARE_GAP }]}>
                    {board.map((value, i) => (
                        <Square
                            key={i}
                            value={value}
                            onPress={() => onSquarePress(i)}
                            isWinSquare={winLine?.includes(i) || false}
                            playerColors={playerColors}
                        />
                    ))}
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    boardContainer: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    board: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(30, 144, 255, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignContent: 'center',
    },
});
