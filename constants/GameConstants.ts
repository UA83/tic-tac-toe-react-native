import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const GAME_CONSTANTS = {
    GRID_SIZE: Math.min(width * 0.9, 400),
    BOARD_PADDING: 16,
    SQUARE_GAP: 12,
    AUTO_RESET_DELAY: 2000,
    OVERLAY_DELAY: 500,
};

export const COLOR_PALETTE = [
    '#FF474D', // Red
    '#1E90FF', // Blue
    '#10B981', // Green
    '#F59E0B', // Orange
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#14B8A6', // Teal
    '#F97316', // Deep Orange
    '#6366F1', // Indigo
    '#EAB308', // Yellow
    '#06B6D4', // Cyan
    '#84CC16', // Lime
];

export const INITIAL_PLAYER_NAMES = {
    X: 'Player X',
    O: 'Player O',
};

export const INITIAL_COLORS = {
    X: '#FF474D',
    O: '#1E90FF',
};
