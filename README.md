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

## 🚀 Getting Started 1

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

## � Local Development (Android Emulator)

To run the app on an Android emulator on Linux, follow these steps:

### 1. Configure Environment
Add these lines to your `~/.bashrc` or `~/.zshrc` to ensure the Android SDK is correctly mapped:
```bash
# Android SDK
export ANDROID_HOME=/home/deck/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools
```
Then, reload your shell configuration:
```bash
source ~/.bashrc
```

### 2. Start the Emulator
You can launch the emulator from **any directory**. Run the following command to start the virtual device in the background:
```bash
emulator -avd Medium_Phone_API_36.1 &
```

### 3. Launch the App
Once the emulator is started and visible, go to the project directory and run:
```bash
npm run android
```

## �📜 License

Created by UA83. All rights reserved.

## 🧪 Automated Testing

The project uses **Playwright** for comprehensive end-to-end testing (E2E). The test suite covers game flow, scoring, and player customization.

### Prerequisites for Testing
Ensure the web server is running in the background:
```bash
npx expo start --web --port 3000
```

### Running Tests

- **Headless Mode** (Standard):
  ```bash
  npx playwright test
  ```

- **Headed Mode** (Visible browser):
  ```bash
  npx playwright test --headed
  ```

- **UI Mode** (Interactive Dashboard):
  ```bash
  npx playwright test --ui
  ```

- **Slow Motion Mode**:
  ```bash
  SLOWMO=500 npx playwright test --headed
  ```

The test framework follows a **Component Object Model (COM)** pattern, ensuring high maintainability and stable locators via `testID` props.
