import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [scores, setScores] = useState({ X: 0, O: 0, Draws: 0 });
  const [lastWinner, setLastWinner] = useState<string | null>(null);
  const [, setStarter] = useState<'X' | 'O'>('X');
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const popAnim = React.useRef(new Animated.Value(0)).current;

  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

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

    if (Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
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

    if (Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [lastWinner, hapticsEnabled]);

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
      }, 3000);
      return () => {
        clearTimeout(timer);
        Animated.timing(popAnim, {
          toValue: 0,
          duration: 200,
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
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setHapticsEnabled(!hapticsEnabled)}
      >
        <MaterialCommunityIcons
          name={hapticsEnabled ? "vibrate" : "vibrate-off"}
          size={24}
          color={textColor}
          style={{ opacity: hapticsEnabled ? 1 : 0.4 }}
        />
      </TouchableOpacity>

      <View style={styles.header}>
        <ThemedText type="title" style={styles.title}>Tic Tac Toe</ThemedText>

        <View style={styles.scoreboard}>
          <View style={styles.scoreItem}>
            <ThemedText style={styles.scoreLabel}>Player X</ThemedText>
            <ThemedText style={styles.scoreValue}>{scores.X}</ThemedText>
          </View>
          <View style={styles.scoreSeparator} />
          <View style={styles.scoreItem}>
            <ThemedText style={styles.scoreLabel}>Draws</ThemedText>
            <ThemedText style={styles.scoreValue}>{scores.Draws}</ThemedText>
          </View>
          <View style={styles.scoreSeparator} />
          <View style={styles.scoreItem}>
            <ThemedText style={styles.scoreLabel}>Player O</ThemedText>
            <ThemedText style={styles.scoreValue}>{scores.O}</ThemedText>
          </View>
        </View>

        <ThemedText type="subtitle" style={[
          styles.statusText,
          winner && winner !== 'Draw' ? { color: tintColor } : null
        ]}>
          {status}
        </ThemedText>
      </View>

      <View style={[styles.board, { width: GRID_SIZE, height: GRID_SIZE, padding: BOARD_PADDING }]}>
        <View style={[styles.gridContainer, { gap: SQUARE_GAP }]}>
          {Array(9).fill(null).map((_, i) => renderSquare(i))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: tintColor }]}
          onPress={resetGame}
        >
          <ThemedText style={styles.buttonText}>Reset Game</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: tintColor }]}
          onPress={resetScoreboard}
        >
          <ThemedText style={styles.buttonText}>Reset Score</ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 20,
    letterSpacing: -1,
  },
  scoreboard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    borderRadius: 20,
    padding: 15,
    marginBottom: 25,
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
    letterSpacing: 1,
    opacity: 0.6,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreSeparator: {
    width: 1,
    height: '60%',
    backgroundColor: 'rgba(150, 150, 150, 0.2)',
  },
  statusText: {
    fontSize: 24,
    fontWeight: '600',
    opacity: 0.8,
  },
  board: {
    borderRadius: 24,
    backgroundColor: 'rgba(150, 150, 150, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
      }
    }),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  square: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
      }
    }),
  },
  winSquare: {
    backgroundColor: '#34C759',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 15,
    width: GRID_SIZE,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }
    }),
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  winCard: {
    backgroundColor: '#FFF',
    padding: 40,
    borderRadius: 30,
    alignItems: 'center',
    width: width * 0.8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
      },
      android: {
        elevation: 20,
      },
      web: {
        boxShadow: '0 15px 50px rgba(0,0,0,0.3)',
      }
    }),
  },
  trophyIcon: {
    marginBottom: 20,
  },
  winTitle: {
    fontSize: 40,
    fontWeight: '900',
    color: '#000',
    letterSpacing: 2,
    marginBottom: 10,
  },
  winMessage: {
    fontSize: 24,
    fontWeight: '600',
    color: 'rgba(0, 0, 0, 0.6)',
  },
});
