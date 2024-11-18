const Player = require('../models/Player'); // Import Player class

class WebSocketService {
  constructor(server) {
    this.wss = new WebSocket.Server({ noServer: true });
    this.clients = new Map(); // Store connected clients
    this.players = new Map(); // Track player states
    this.init(server);
  }

  handleConnection(ws) {
    const clientId = Date.now(); // Generate unique ID
    const newPlayer = new Player(clientId, 100, 100, 20, 5, 'blue'); // Default player properties
    this.clients.set(clientId, ws);
    this.players.set(clientId, newPlayer);

    console.log(`Player connected: ${clientId}`);
    ws.send(JSON.stringify({ type: 'welcome', clientId }));

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        this.handleMessage(clientId, data);
      } catch (err) {
        console.error(`Error parsing message from client ${clientId}:`, err);
      }
    });

    ws.on('close', () => {
      console.log(`Player disconnected: ${clientId}`);
      this.clients.delete(clientId);
      this.players.delete(clientId);
    });
  }

  handleMessage(clientId, data) {
    const player = this.players.get(clientId);
    if (!player) return;

    switch (data.type) {
      case 'player-move':
        player.move(data.x, data.y); // Move the player
        this.broadcast({ type: 'player-update', clientId, x: player.x, y: player.y }, clientId);
        break;

      case 'toggle-morph':
        player.toggleMorph(); // Toggle morph state
        this.broadcast({ type: 'morph-update', clientId, morphed: player.morphed }, clientId);
        break;

      default:
        console.warn(`Unknown message type from client ${clientId}:`, data.type);
    }
  }

  broadcast(message, excludeClientId = null) {
    const msgString = JSON.stringify(message);
    this.clients.forEach((client, id) => {
      if (id !== excludeClientId && client.readyState === WebSocket.OPEN) {
        client.send(msgString);
      }
    });
  }

  broadcastGameState() {
    const gameState = {
      players: Array.from(this.players.values()).map(player => ({
        id: player.id,
        x: player.x,
        y: player.y,
        size: player.size,
        color: player.color,
        morphed: player.morphed,
      })),
    };
    this.broadcast({ type: 'game-state', data: gameState });
  }
}

module.exports = WebSocketService;