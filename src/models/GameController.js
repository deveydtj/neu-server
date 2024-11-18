const Player = require('../models/Player');

const players = {}; // Store connected players

function addPlayer(id, x, y, size, speed) {
  players[id] = new Player(id, x, y, size, speed);
}

function updatePlayer(id, direction) {
  if (players[id]) {
    players[id].move(direction);
  }
}

function getGameState() {
  return { players };
}

module.exports = { addPlayer, updatePlayer, getGameState };