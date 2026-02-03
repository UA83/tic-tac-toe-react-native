import { Circle, X } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { GAME_CONSTANTS } from '../../constants/GameConstants';
import { SquareValue } from '../../constants/types';

interface SquareProps {
    value: SquareValue;
    onPress: () => void;
    isWinSquare: boolean;
    playerColors: { X: string; O: string };
    testID?: string;
}

const USABLE_WIDTH = GAME_CONSTANTS.GRID_SIZE - (GAME_CONSTANTS.BOARD_PADDING * 2) - 2;
const SQUARE_SIZE = Math.floor((USABLE_WIDTH - (GAME_CONSTANTS.SQUARE_GAP * 2)) / 3);

export const Square = React.memo(({ value, onPress, isWinSquare, playerColors, testID }: SquareProps) => {
    return (
        <Pressable
            testID={testID}
            onPress={onPress}
            style={({ pressed }) => [
                styles.square,
                {
                    width: SQUARE_SIZE,
                    height: SQUARE_SIZE,
                    opacity: pressed ? 0.8 : 1,
                    transform: [{ scale: pressed ? 0.95 : 1 }]
                },
                isWinSquare && styles.winSquare
            ]}
        >
            {value === 'X' && (
                <Animated.View entering={ZoomIn.springify()}>
                    <X
                        size={SQUARE_SIZE * 0.6}
                        color={isWinSquare ? '#FFFFFF' : playerColors.X}
                        strokeWidth={3}
                    />
                </Animated.View>
            )}
            {value === 'O' && (
                <Animated.View entering={ZoomIn.springify()}>
                    <Circle
                        size={SQUARE_SIZE * 0.55}
                        color={isWinSquare ? '#FFFFFF' : playerColors.O}
                        strokeWidth={3}
                    />
                </Animated.View>
            )}
        </Pressable>
    );
});

const styles = StyleSheet.create({
    square: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    winSquare: {
        backgroundColor: '#1E90FF',
        borderColor: '#38BDF8',
        elevation: 10,
        shadowColor: '#1E90FF',
        shadowRadius: 20,
        shadowOpacity: 0.5,
    },
});

Square.displayName = 'Square';
