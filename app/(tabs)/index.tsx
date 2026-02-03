import { RotateCcw, Trash2 } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { Board } from '@/components/tic-tac-toe/Board';
import { ColorPickerModal } from '@/components/tic-tac-toe/ColorPickerModal';
import { Scoreboard } from '@/components/tic-tac-toe/Scoreboard';
import { VictoryOverlay } from '@/components/tic-tac-toe/VictoryOverlay';
import { GAME_CONSTANTS } from '@/constants/GameConstants';
import { PlayerSymbol } from '@/constants/types';
import { useTicTacToe } from '@/hooks/useTicTacToe';

export default function TicTacToeScreen() {
  const packageJson = require('../../package.json');
  const {
    board,
    xIsNext,
    scores,
    winner,
    winLine,
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
  } = useTicTacToe();

  const [activeColorPicker, setActiveColorPicker] = useState<PlayerSymbol | null>(null);

  const currentPlayer = xIsNext ? 'X' : 'O';
  const status = winner
    ? winner === 'Draw' ? "It's a Draw!" : `${playerNames[winner as PlayerSymbol]} Wins! (${winner})`
    : `${playerNames[currentPlayer]}'s Turn (${currentPlayer})`;

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  // Handle Win/Draw overlays and auto-reset
  useEffect(() => {
    if (winner) {
      const overlayTimer = setTimeout(() => {
        if (winner === 'Draw') setShowDrawOverlay(true);
        else setShowWinnerOverlay(true);
      }, GAME_CONSTANTS.OVERLAY_DELAY);

      const resetTimer = setTimeout(() => {
        resetGame();
      }, GAME_CONSTANTS.AUTO_RESET_DELAY);

      return () => {
        clearTimeout(overlayTimer);
        clearTimeout(resetTimer);
      };
    }
  }, [winner, resetGame, setShowDrawOverlay, setShowWinnerOverlay]);

  const onSave = (name: string, color: string) => {
    if (!activeColorPicker) return;

    const otherPlayer = activeColorPicker === 'X' ? 'O' : 'X';
    // Check if the color is taken by the OTHER player
    if (playerColors[otherPlayer] === color) {
      setToastMessage(`This color is already taken by ${playerNames[otherPlayer]}!`);
      return; // Stop here, keep modal open
    }

    if (name.trim()) {
      setPlayerNames(prev => ({ ...prev, [activeColorPicker!]: name.trim() }));
    }
    setPlayerColors(prev => ({ ...prev, [activeColorPicker!]: color }));
    setActiveColorPicker(null);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeInDown.duration(800).delay(200)}
        style={styles.content}
      >
        <View style={styles.header}>
          <ThemedText style={styles.title}>TIC TAC TOE</ThemedText>
        </View>

        <Scoreboard
          scores={scores}
          playerNames={playerNames}
          playerColors={playerColors}
          onPlayerPress={setActiveColorPicker}
        />

        <View style={styles.statusContainer} testID="game-status-container">
          <View style={[styles.indicator, { backgroundColor: xIsNext ? playerColors.X : playerColors.O }]} />
          <ThemedText style={styles.statusText} testID="game-status">{status}</ThemedText>
        </View>

        <Board
          board={board}
          onSquarePress={makeMove}
          winLine={winLine}
          playerColors={playerColors}
          winner={winner}
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.glassButton, styles.primaryButton]}
            onPress={resetGame}
            testID="new-round-btn"
          >
            <RotateCcw size={20} color="#FFF" />
            <ThemedText style={styles.primaryButtonText}>NEW ROUND</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.glassButton, styles.dangerButton]}
            onPress={resetScoreboard}
            testID="reset-score-btn"
          >
            <Trash2 size={20} color="#FFF" />
            <ThemedText style={styles.dangerButtonText}>RESET SCORE</ThemedText>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ThemedText style={styles.version} testID="app-version">UA83v{packageJson.version}</ThemedText>

      {/* Overlays */}
      {showWinnerOverlay && <VictoryOverlay winner={winner} playerNames={playerNames} />}
      {showDrawOverlay && <VictoryOverlay winner="Draw" playerNames={playerNames} />}

      {/* Modals */}
      <ColorPickerModal
        visible={activeColorPicker !== null}
        player={activeColorPicker}
        playerNames={playerNames}
        playerColors={playerColors}
        onClose={() => setActiveColorPicker(null)}
        onSave={onSave}
        toastMessage={toastMessage}
        onColorSelect={(color: string, name: string) => onSave(name, color)}
      />

      {/* Universal Toast */}
      {toastMessage && activeColorPicker === null && (
        <Animated.View
          entering={FadeInDown.duration(300)}
          exiting={FadeOut.duration(300)}
          style={styles.toast}
        >
          <ThemedText style={styles.toastText}>{toastMessage}</ThemedText>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 40 : 0,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 8,
    lineHeight: 52,
    paddingVertical: 10,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    width: GAME_CONSTANTS.GRID_SIZE,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 16,
    width: GAME_CONSTANTS.GRID_SIZE,
  },
  glassButton: {
    flex: 1,
    flexDirection: 'row',
    height: 56,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderWidth: 1,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#1E90FF',
    borderColor: '#1E90FF',
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
  },
  dangerButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 1.2,
  },
  version: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
    letterSpacing: 1,
  },
  toast: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    elevation: 8,
    zIndex: 2000,
  },
  toastText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
