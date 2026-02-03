import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { COLOR_PALETTE } from '../../constants/GameConstants';
import { PlayerSymbol } from '../../constants/types';
import { ThemedText } from '../themed-text';

interface ColorPickerModalProps {
    visible: boolean;
    player: PlayerSymbol | null;
    playerNames: Record<PlayerSymbol, string>;
    playerColors: Record<PlayerSymbol, string>;
    onClose: () => void;
    onSave: (name: string, color: string) => void;
    toastMessage: string | null;
    onColorSelect: (name: string, color: string) => void;
}

export const ColorPickerModal = ({
    visible,
    player,
    playerNames,
    playerColors,
    onClose,
    onSave,
    toastMessage,
    onColorSelect,
}: ColorPickerModalProps) => {
    const [tempName, setTempName] = useState('');

    useEffect(() => {
        if (visible && player) {
            setTempName(playerNames[player]);
        }
    }, [visible, player, playerNames]);

    if (!player) return null;

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.modalOverlay} onPress={onClose}>
                <Pressable style={styles.colorPickerContainer} onPress={(e) => e.stopPropagation()}>
                    <ThemedText style={styles.colorPickerTitle} testID="color-picker-title">
                        Customize {playerNames[player]} ({player})
                    </ThemedText>

                    <View style={styles.nameInputContainer}>
                        <ThemedText style={styles.inputLabel}>Player Name:</ThemedText>
                        <TextInput
                            testID="player-name-input"
                            style={styles.nameInput}
                            value={tempName}
                            onChangeText={setTempName}
                            onFocus={() => {
                                if (tempName === 'Player X' || tempName === 'Player O') {
                                    setTempName('');
                                }
                            }}
                            placeholder={playerNames[player]}
                            placeholderTextColor="#94A3B8"
                            maxLength={15}
                            onSubmitEditing={() => onSave(tempName, playerColors[player])}
                        />
                    </View>

                    <ThemedText style={styles.inputLabel}>Choose Color:</ThemedText>
                    <View style={styles.colorGrid} testID="color-grid">
                        {COLOR_PALETTE.map((color) => {
                            const otherPlayer = player === 'X' ? 'O' : 'X';
                            const isColorTaken = playerColors[otherPlayer] === color;
                            const isSelected = playerColors[player] === color;

                            return (
                                <TouchableOpacity
                                    key={color}
                                    testID={`color-option-idx-${COLOR_PALETTE.indexOf(color)}`}
                                    style={[
                                        styles.colorOption,
                                        { backgroundColor: color },
                                        isSelected && styles.selectedColor,
                                        isColorTaken && styles.disabledColor,
                                    ]}
                                    onPress={() => onColorSelect(tempName, color)}
                                >
                                    {isSelected && <View style={styles.checkmark} />}
                                    {isColorTaken && <View style={styles.disabledOverlay} />}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Pressable>

                {toastMessage && (
                    <Animated.View
                        entering={FadeInDown.duration(300)}
                        exiting={FadeOut.duration(300)}
                        style={[styles.toast, { bottom: 50 }]}
                        testID="color-picker-toast"
                    >
                        <ThemedText style={styles.toastText}>{toastMessage}</ThemedText>
                    </Animated.View>
                )}
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorPickerContainer: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        width: '85%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    colorPickerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
        marginBottom: 20,
    },
    nameInputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 8,
    },
    nameInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#0F172A',
        fontWeight: '500',
        marginBottom: 10,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 12,
    },
    colorOption: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: 'transparent',
    },
    selectedColor: {
        borderColor: '#0F172A',
        borderWidth: 4,
    },
    checkmark: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
        borderColor: '#0F172A',
    },
    disabledColor: {
        opacity: 0.4,
    },
    disabledOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 30,
    },
    toast: {
        position: 'absolute',
        alignSelf: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        shadowColor: '#361e1eff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
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
