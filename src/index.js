const express = require('express');
const WebSocket = require('ws');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// REST API setup
app.use(express.json());

// Placeholder for API routes
app.get('/', (req, res) => res.send('Neu Server is running!'));

// WebSocket setup
const wss = new WebSocket.Server({ noServer: true });

// Store connected clients
const clients = new Map();

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Assign a unique ID for the client
  const clientId = Date.now(); // Use a timestamp for simplicity
  clients.set(clientId, ws);

  console.log(`Client connected: ${clientId}`);

  // Send a welcome message to the client
  ws.send(JSON.stringify({ type: 'welcome', clientId }));

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message); // Parse the incoming message
      console.log(`Message from client ${clientId}:`, data);

      // Handle specific message types
      switch (data.type) {
        case 'player-move':
          broadcast(JSON.stringify({ type: 'player-update', clientId, x: data.x, y: data.y }), clientId);
          break;
        case 'chat':
          broadcast(JSON.stringify({ type: 'chat', clientId, message: data.message }), clientId);
          break;
        default:
          console.log(`Unknown message type: ${data.type}`);
      }
    } catch (err) {
      console.error(`Error handling message from client ${clientId}:`, err);
    }
  });

  // Handle client disconnection
  ws.on('close', () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(clientId);
  });
});

// Function to broadcast messages to all clients except the sender
function broadcast(message, senderId) {
  clients.forEach((client, id) => {
    if (id !== senderId && client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Start the server
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Upgrade HTTP to WebSocket
server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});