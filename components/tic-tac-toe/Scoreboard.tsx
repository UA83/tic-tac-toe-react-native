import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GAME_CONSTANTS } from '../../constants/GameConstants';
import { PlayerSymbol } from '../../constants/types';
import { ThemedText } from '../themed-text';

interface ScoreboardProps {
    scores: { X: number; O: number; Draws: number };
    playerNames: Record<PlayerSymbol, string>;
    playerColors: Record<PlayerSymbol, string>;
    onPlayerPress: (player: PlayerSymbol) => void;
}

export const Scoreboard = ({ scores, playerNames, playerColors, onPlayerPress }: ScoreboardProps) => {
    return (
        <View style={styles.glassScoreboard}>
            <TouchableOpacity style={styles.scoreBox} onPress={() => onPlayerPress('X')}>
                <ThemedText style={[styles.scoreLabel, { color: playerColors.X }]}>{playerNames.X}</ThemedText>
                <ThemedText style={styles.scoreNumber}>{scores.X}</ThemedText>
            </TouchableOpacity>

            <View style={styles.scoreDivider} />

            <View style={styles.scoreBox}>
                <ThemedText style={styles.scoreLabel}>DRAWS</ThemedText>
                <ThemedText style={styles.scoreNumber}>{scores.Draws}</ThemedText>
            </View>

            <View style={styles.scoreDivider} />

            <TouchableOpacity style={styles.scoreBox} onPress={() => onPlayerPress('O')}>
                <ThemedText style={[styles.scoreLabel, { color: playerColors.O }]}>{playerNames.O}</ThemedText>
                <ThemedText style={styles.scoreNumber}>{scores.O}</ThemedText>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    glassScoreboard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        padding: 10,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        width: GAME_CONSTANTS.GRID_SIZE,
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    scoreBox: {
        alignItems: 'center',
        flex: 1,
    },
    scoreLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 1,
        marginBottom: 4,
    },
    scoreNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0F172A',
    },
    scoreDivider: {
        width: 1,
        height: '60%',
        backgroundColor: '#E2E8F0',
        alignSelf: 'center',
    },
});
