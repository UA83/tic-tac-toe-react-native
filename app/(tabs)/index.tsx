import { LinearGradient } from 'expo-linear-gradient';
import { Circle, RotateCcw, Trash2, Trophy, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Platform, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeOut,
  ZoomIn,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring
} from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';

const { width } = Dimensions.get('window');
const GRID_SIZE = Math.min(width * 0.9, 400);
const BOARD_PADDING = 16;
const SQUARE_GAP = 12;
const USABLE_WIDTH = GRID_SIZE - (BOARD_PADDING * 2) - 2; // Subtract board borders
const SQUARE_SIZE = Math.floor((USABLE_WIDTH - (SQUARE_GAP * 2)) / 3);



export default function TicTacToeScreen() {
  const packageJson = require('../../package.json');
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [, setStarter] = useState<'X' | 'O'>('X');

  const boardScale = useSharedValue(1);

  const calculateWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (squares.every(square => square !== null)) {
      return { winner: 'Draw', line: null };
    }
    return null;
  };

  const winInfo = calculateWinner(board);
  const winner = winInfo?.winner;
  const winLine = winInfo?.line;

  const status = winner
    ? winner === 'Draw' ? "It's a Draw!" : `${winner} Wins!`
    : `${xIsNext ? 'X' : 'O'}'s Turn`;

  const handlePress = (index: number) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    const currentPlayer = xIsNext ? 'X' : 'O';
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    const nextWinInfo = calculateWinner(newBoard);
    if (nextWinInfo) {
      if (nextWinInfo.winner === 'Draw') {
        setScores(s => ({ ...s, Draws: s.Draws + 1 }));
        setLastWinner(null);
      } else {
        const winPlayer = nextWinInfo.winner;
        setScores(s => ({ ...s, [winPlayer as 'X' | 'O']: s[winPlayer as 'X' | 'O'] + 1 }));
        setLastWinner(winPlayer);
      }
      // Victory/Draw shake
      boardScale.value = withSequence(
        withSpring(1.05),
        withSpring(1)
      );
    }

    setXIsNext(!xIsNext);
  };

  const resetGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    if (lastWinner) {
      setXIsNext(lastWinner === 'X');
      setStarter(lastWinner as 'X' | 'O');
    } else {
      setStarter(prev => {
        const nextS = prev === 'X' ? 'O' : 'X';
        setXIsNext(nextS === 'X');
        return nextS;
      });
    }
  }, [lastWinner]);

  useEffect(() => {
    if (winner) {
      const timer = setTimeout(() => {
        resetGame();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [winner, resetGame]);

  const resetScoreboard = () => {
    setScores({ X: 0, O: 0, Draws: 0 });
    setLastWinner(null);
    setStarter('X');
    resetGame();
  };

  const boardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boardScale.value }]
  }));

  const renderSquare = (index: number) => {
    const isWinSquare = winLine?.includes(index);
    const value = board[index];

    return (
      <Pressable
        key={index}
        onPress={() => handlePress(index)}
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
              color={isWinSquare ? '#FFFFFF' : '#FF474D'}
              strokeWidth={3}
            />
          </Animated.View>
        )}
        {value === 'O' && (
          <Animated.View entering={ZoomIn.springify()}>
            <Circle
              size={SQUARE_SIZE * 0.55}
              color={isWinSquare ? '#FFFFFF' : '#1E90FF'}
              strokeWidth={3}
            />
          </Animated.View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#E0F2FE', '#F8FAFC']}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative ambient glows */}
      <View style={[styles.glow, { top: -100, left: -50, backgroundColor: '#1E90FF15' }]} />
      <View style={[styles.glow, { bottom: -100, right: -50, backgroundColor: '#FF880008' }]} />

      <Animated.View
        entering={FadeInDown.duration(800).delay(200)}
        style={styles.content}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>TIC TAC TOE</ThemedText>
          <ThemedText style={styles.subtitle}>NEXT GEN 2026</ThemedText>
        </View>

        <View style={styles.glassScoreboard}>
          <View style={styles.scoreBox}>
            <ThemedText style={[styles.scoreLabel, { color: '#FF474D' }]}>PLAYER X</ThemedText>
            <ThemedText style={styles.scoreNumber}>{scores.X}</ThemedText>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreBox}>
            <ThemedText style={styles.scoreLabel}>DRAWS</ThemedText>
            <ThemedText style={styles.scoreNumber}>{scores.Draws}</ThemedText>
          </View>
          <View style={styles.scoreDivider} />
          <View style={styles.scoreBox}>
            <ThemedText style={[styles.scoreLabel, { color: '#1E90FF' }]}>PLAYER O</ThemedText>
            <ThemedText style={styles.scoreNumber}>{scores.O}</ThemedText>
          </View>
        </View>

        <View style={styles.statusContainer}>
          <View style={[styles.indicator, { backgroundColor: xIsNext ? '#FF474D' : '#1E90FF' }]} />
          <ThemedText style={styles.statusText}>{status}</ThemedText>
        </View>

        <Animated.View style={[styles.boardContainer, boardAnimatedStyle]}>
          <View style={[styles.board, { width: GRID_SIZE, height: GRID_SIZE, padding: BOARD_PADDING }]}>
            <View style={[styles.grid, { gap: SQUARE_GAP }]}>
              {Array(9).fill(null).map((_, i) => renderSquare(i))}
            </View>
          </View>
        </Animated.View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.glassButton, styles.primaryButton]} onPress={resetGame}>
            <RotateCcw size={20} color="#FFF" />
            <ThemedText style={styles.primaryButtonText}>NEW ROUND</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.glassButton, styles.dangerButton]} onPress={resetScoreboard}>
            <Trash2 size={20} color="#FFF" />
            <ThemedText style={styles.dangerButtonText}>RESET ALL</ThemedText>
          </TouchableOpacity>
        </View>
        <ThemedText style={styles.version}>NODE_v{packageJson.version}_PROT_2026</ThemedText>
      </Animated.View>

      {winner && winner !== 'Draw' && (
        <Animated.View
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
          style={styles.victoryOverlay}
        >
          <LinearGradient
            colors={['rgba(30, 144, 255, 0.9)', 'rgba(255, 255, 255, 0.95)']}
            style={styles.victoryGradient}
          >
            <Animated.View entering={ZoomIn.delay(200).springify()}>
              <Trophy size={120} color="#FFD700" strokeWidth={1.5} />
            </Animated.View>
            <ThemedText style={styles.victoryTitle}>VICTORY</ThemedText>
            <ThemedText style={styles.victorySubtitle}>PLAYER {winner} DOMINATES</ThemedText>
          </LinearGradient>
        </Animated.View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 8,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-black' }),
  },
  subtitle: {
    fontSize: 12,
    color: '#1E90FF',
    letterSpacing: 4,
    fontWeight: '600',
    marginTop: -4,
  },
  glassScoreboard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', // Solid opaque white for Android/Web consistency
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Solid light border
    width: GRID_SIZE,
    justifyContent: 'space-between',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
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
    backgroundColor: '#E2E8F0', // Visible divider
    alignSelf: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(30, 144, 255, 0.1)',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
    shadowColor: '#FFF',
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  boardContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
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
  square: {
    backgroundColor: '#FFFFFF', // Solid white so they all look the same
    borderRadius: 15,          // Rounded corners for the "Next Gen" look
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,                 // Ensure fixed dimensions
    height: 80,
    borderWidth: 1,
    borderColor: '#E0E0E0',    // Suble but visible border
    elevation: 4,              // Better shadow for Android
    shadowColor: '#000',       // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  winSquare: {
    backgroundColor: '#1E90FF',
    borderColor: '#38BDF8',
    elevation: 10,
    shadowColor: '#1E90FF',
    shadowRadius: 20,
    shadowOpacity: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 16,
    width: GRID_SIZE,
  },
  glassButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Brighter opacity
    height: 56,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(30, 144, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
    shadowColor: '#1E90FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1.2,
  },
  dangerButton: {
    backgroundColor: '#FF474D',
    borderColor: '#FF474D',
    shadowColor: '#FF474D',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 1.2,
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1.2,
  },
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
    color: '#0F172A', // High contrast color
    letterSpacing: 8,
    marginTop: 20,
    lineHeight: 60,
    paddingVertical: 10,
    textAlign: 'center',
  },
  victorySubtitle: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: '700',
    letterSpacing: 4,
    textTransform: 'uppercase',
  },
  version: {
    marginTop: 30,
    marginBottom: 20,
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
    letterSpacing: 1,
  },
});
