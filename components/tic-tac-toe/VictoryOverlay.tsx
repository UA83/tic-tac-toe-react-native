import { LinearGradient } from 'expo-linear-gradient';
import { Handshake, Trophy } from 'lucide-react-native';
import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { GameResult, PlayerSymbol } from '../../constants/types';
import { ThemedText } from '../themed-text';

interface VictoryOverlayProps {
    winner: GameResult;
    playerNames: Record<PlayerSymbol, string>;
}

export const VictoryOverlay = ({ winner, playerNames }: VictoryOverlayProps) => {
    if (!winner) return null;

    const isDraw = winner === 'Draw';

    return (
        <Animated.View
            entering={FadeIn.duration(400)}
            exiting={FadeOut.duration(400)}
            style={styles.victoryOverlay}
        >
            <LinearGradient
                colors={isDraw
                    ? ['rgba(100, 116, 139, 0.9)', 'rgba(255, 255, 255, 0.95)']
                    : ['rgba(30, 144, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']
                }
                style={styles.victoryGradient}
            >
                <Animated.View entering={ZoomIn.delay(200).springify()}>
                    {isDraw
                        ? <Handshake size={120} color="#64748B" strokeWidth={1.5} />
                        : <Trophy size={120} color="#FFD700" strokeWidth={1.5} />
                    }
                </Animated.View>

                <ThemedText style={isDraw ? styles.drawTitle : styles.victoryTitle}>
                    {isDraw ? 'DRAW' : 'VICTORY'}
                </ThemedText>

                <ThemedText style={isDraw ? styles.drawSubtitle : styles.victorySubtitle}>
                    {isDraw ? 'EVENLY MATCHED' : `${playerNames[winner as PlayerSymbol]} DOMINATES`}
                </ThemedText>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    victoryOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    victoryGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    victoryTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: 8,
        marginTop: 20,
        lineHeight: 60,
        textAlign: 'center',
    },
    victorySubtitle: {
        fontSize: 16,
        color: '#FFD700',
        fontWeight: '700',
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
    drawTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: 8,
        marginTop: 20,
        lineHeight: 60,
        textAlign: 'center',
    },
    drawSubtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '700',
        letterSpacing: 4,
        textTransform: 'uppercase',
    },
});
