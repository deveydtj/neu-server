const express = require('express');
const http = require('http');
const WebSocketService = require('./WebSocketService'); // Import the WebSocketService
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// REST API setup
app.use(express.json());
app.get('/', (req, res) => res.send('Neu Server is running!'));

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocketService
const webSocketService = new WebSocketService(server);

// Periodically broadcast game state
setInterval(() => {
  const gameState = {
    players: [], // Add logic to populate with actual player states
    projectiles: [], // Add logic to populate with projectile states
  };
  webSocketService.broadcastGameState(gameState);
}, 1000 / 30); // Broadcast at 30 FPS

// Start the server
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));