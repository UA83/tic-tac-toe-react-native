import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useState } from 'react';

import { Animated, Dimensions, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

const { width } = Dimensions.get('window');
const GRID_SIZE = Math.min(width * 0.9, 400);
const BOARD_PADDING = 12;
const SQUARE_GAP = 8;
const USABLE_WIDTH = GRID_SIZE - (BOARD_PADDING * 2);
const SQUARE_SIZE = (USABLE_WIDTH - (SQUARE_GAP * 2)) / 3;

export default function TicTacToeScreen() {
  const packageJson = require('../../package.json');
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [, setStarter] = useState<'X' | 'O'>('X');
  const popAnim = React.useRef(new Animated.Value(0)).current;

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  // Material 3 Color Tokens
  const surfaceVariant = useThemeColor({ light: '#E7E0EC', dark: '#49454F' }, 'background');
  const onSurface = useThemeColor({ light: '#1C1B1F', dark: '#E6E1E5' }, 'text');
  const primaryColor = tintColor; // Usually #6750A4
  const secondaryContainer = useThemeColor({ light: '#E8DEF8', dark: '#4A4458' }, 'background');
  const onSecondaryContainer = useThemeColor({ light: '#1D192B', dark: '#E8DEF8' }, 'text');

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
    }

    setXIsNext(!xIsNext);
  };

  const resetGame = React.useCallback(() => {
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

  React.useEffect(() => {
    if (winner) {
      if (winner !== 'Draw') {
        Animated.spring(popAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
      }

      const timer = setTimeout(() => {
        resetGame();
      }, 2000);
      return () => {
        clearTimeout(timer);
        Animated.timing(popAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }).start();
      };
    }
  }, [winner, resetGame, popAnim]);

  const resetScoreboard = () => {
    setScores({ X: 0, O: 0, Draws: 0 });
    setLastWinner(null);
    setStarter('X');
    resetGame();
  };

  const renderSquare = (index: number) => {
    const isWinSquare = winLine?.includes(index);

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.square,
          { width: SQUARE_SIZE, height: SQUARE_SIZE },
          isWinSquare && styles.winSquare
        ]}
        onPress={() => handlePress(index)}
        activeOpacity={0.7}
      >
        {board[index] === 'X' && (
          <MaterialCommunityIcons
            name="close"
            size={SQUARE_SIZE * 0.7}
            color={isWinSquare ? '#FFF' : '#FF474D'}
          />
        )}
        {board[index] === 'O' && (
          <MaterialCommunityIcons
            name="circle-outline"
            size={SQUARE_SIZE * 0.6}
            color={isWinSquare ? '#FFF' : '#4579FF'}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Link href="/modal" asChild>
        <TouchableOpacity
          style={styles.settingsButton}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="help-circle-outline"
            size={24}
            color={textColor}
          />
        </TouchableOpacity>
      </Link>

      <View style={[styles.header, { marginTop: Platform.OS === 'web' ? 20 : 40 }]}>
        <ThemedText style={styles.title}>Tic Tac Toe</ThemedText>

        <View style={[styles.scoreboard, { backgroundColor: surfaceVariant }]}>
          <View style={styles.scoreItem}>
            <ThemedText style={[styles.scoreLabel, { color: onSurface }]}>X</ThemedText>
            <ThemedText style={[styles.scoreValue, { color: onSurface }]}>{scores.X}</ThemedText>
          </View>
          <View style={styles.scoreSeparator} />
          <View style={styles.scoreItem}>
            <ThemedText style={[styles.scoreLabel, { color: onSurface }]}>Draws</ThemedText>
            <ThemedText style={[styles.scoreValue, { color: onSurface }]}>{scores.Draws}</ThemedText>
          </View>
          <View style={styles.scoreSeparator} />
          <View style={styles.scoreItem}>
            <ThemedText style={[styles.scoreLabel, { color: onSurface }]}>O</ThemedText>
            <ThemedText style={[styles.scoreValue, { color: onSurface }]}>{scores.O}</ThemedText>
          </View>
        </View>

        <View style={[styles.statusBadge, { backgroundColor: secondaryContainer }]}>
          <ThemedText style={[styles.statusText, { color: onSecondaryContainer }]}>
            {status}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.board, { width: GRID_SIZE, height: GRID_SIZE, padding: BOARD_PADDING }]}>
        <View style={[styles.gridContainer, { gap: SQUARE_GAP }]}>
          {Array(9).fill(null).map((_, i) => renderSquare(i))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: primaryColor }]}
          onPress={resetGame}
          activeOpacity={0.8}
        >
          <ThemedText style={styles.buttonText}>Reset Game</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: secondaryContainer }]}
          onPress={resetScoreboard}
          activeOpacity={0.8}
        >
          <ThemedText style={[styles.buttonText, { color: onSecondaryContainer }]}>Reset Score</ThemedText>
        </TouchableOpacity>
      </View>

      {winner && winner !== 'Draw' && (
        <View style={styles.overlayContainer} pointerEvents="none">
          <Animated.View
            style={[
              styles.winCard,
              {
                transform: [{ scale: popAnim }],
                opacity: popAnim,
              }
            ]}
          >
            <MaterialCommunityIcons
              name="trophy"
              size={100}
              color="#FFD700"
              style={styles.trophyIcon}
            />
            <ThemedText style={styles.winTitle}>VICTORY!</ThemedText>
            <ThemedText style={styles.winMessage}>Player {winner} wins</ThemedText>
          </Animated.View>
        </View>
      )}

      <ThemedText style={styles.versionText}>v{packageJson.version}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FDF7FF', // M3 Surface
  },
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'web' ? 20 : 60,
    right: 25,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 24,
    letterSpacing: -0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif-medium' }),
  },
  scoreboard: {
    flexDirection: 'row',
    borderRadius: 28,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    width: GRID_SIZE,
    justifyContent: 'space-between',
  },
  scoreItem: {
    alignItems: 'center',
    flex: 1,
  },
  scoreLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    opacity: 0.7,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 22,
    fontWeight: '700',
  },
  scoreSeparator: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 24,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  board: {
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.03)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignContent: 'center',
  },
  square: {
    backgroundColor: '#FAF9FB',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winSquare: {
    backgroundColor: '#6750A4',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 15,
    width: GRID_SIZE,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }
    }),
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  winCard: {
    backgroundColor: '#F7F2FA',
    padding: 32,
    borderRadius: 28,
    alignItems: 'center',
    width: width * 0.85,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0,0.3)',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
      }
    }),
  },
  trophyIcon: {
    marginBottom: 16,
  },
  winTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1C1B1F',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  winMessage: {
    fontSize: 18,
    fontWeight: '500',
    color: '#49454F',
  },
  versionText: {
    position: 'absolute',
    bottom: 10,
    fontSize: 12,
    opacity: 0.3,
    fontWeight: '600',
  },
});
