# Tic-Tac-Toe Premium 👋

A modern, high-performance Tic-Tac-Toe game built with **React Native** and **Expo**. This app features a sleek UI, haptic feedback, and advanced game logic for a premium mobile experience.

## ✨ Features

- **Premium UI**: Modern design with soft shadows, glassmorphism elements, and themed color palettes.
- **Victory Overlay**: An animated "Victory" pop-up with trophy icons and celebrated announcements.
- **Intelligent Scoreboard**: Tracks Wins for Player X, Player O, and total Draws.
- **Smart Turn Logic**: The last winner automatically starts the next match. If a draw occurs, the starter alternates.
- **Auto-Reset**: The board automatically clears after a short delay (2 seconds) following a win or draw, keeping the game flow uninterrupted.
- **Haptic Feedback**: High-quality vibrations for moves and celebrations (can be toggled on/off).
- **Fully Responsive**: Optimized for all screen sizes, from small phones to large tablets.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Expo Go](https://expo.dev/go) app on your device (for testing)

### Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:UA83/tic-tac-toe-react-native.git
   cd tic-tac-toe-react-native
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npx expo start
   ```

## 📱 How to Play

- Tap any square in the 3x3 grid to make a move.
- The goal is to get three of your marks (X or O) in a horizontal, vertical, or diagonal row.
- Use the **Reset Game** button to clear the board without losing your score.
- Use the **Reset Score** button to wipe the scoreboard and start fresh.
- Toggle haptics using the icon in the top-right corner.

## 🛠 Tech Stack

- **React Native**: Core framework
- **Expo**: Development platform and SDK
- **Expo Router**: File-based routing
- **Expo Haptics**: Native vibration engine
- **React Native Animated**: smooth victory transitions

## 📜 License

Created by UA83. All rights reserved.
