# Multiplayer Game Setup

## Installation & Setup

### Prerequisites
- Node.js installed (download from https://nodejs.org/)

### Steps

1. **Navigate to the project folder** in PowerShell:
   ```powershell
   cd "C:\Users\pc\OneDrive\Desktop\Hock"
   ```

2. **Install dependencies**:
   ```powershell
   npm install
   ```

3. **Start the server**:
   ```powershell
   npm start
   ```

   You should see: `Server running on http://localhost:3000`

4. **Open the game** in multiple browsers/tabs:
   - Open http://localhost:3000 in different browser windows or tabs
   - Each browser represents a different player

5. **Test multiplayer**:
   - Enter player names in each browser
   - All players will appear in the "Players currently playing" list
   - Once 3+ players join, the "Start Game" button activates
   - All players see each other's updates in real-time

## How It Works

- **Server** (`server.js`): Manages connected players and broadcasts updates
- **Client** (`script.js`): Connects to server via Socket.io and syncs player data
- **HTML** (`index.html`): Displays the game interface

When players join/leave or answer questions, the server broadcasts updates to all connected clients instantly.

## Troubleshooting

If the game still doesn't show players:
- Make sure the server is running (`npm start`)
- Check that all players are connecting to http://localhost:3000 (not file://)
- Check browser console for any errors (F12 → Console tab)
