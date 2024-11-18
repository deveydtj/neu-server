class Player {
  constructor(id, x, y, size, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  move(direction) {
    const { x, y } = direction;
    this.x += x * this.speed;
    this.y += y * this.speed;
  }
}

module.exports = Player;