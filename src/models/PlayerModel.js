class Player {
  constructor(id, x, y, size, speed, color) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.size = size; // Radius of the player
    this.defaultSpeed = speed;
    this.morphSpeed = speed + 3; // Increased speed when morphed
    this.speed = speed;
    this.color = color;
    this.morphed = false;

    // Velocity for tracking movement
    this.velocityX = 0;
    this.velocityY = 0;
  }

  toggleMorph() {
    this.morphed = !this.morphed;
    this.speed = this.morphed ? this.morphSpeed : this.defaultSpeed;
  }

  move(newX, newY, obstacles = []) {
    const radius = this.size;

    // Restrict movement within playable bounds
    newX = Math.max(radius, Math.min(newX, 800 - radius)); // Example width: 800px
    newY = Math.max(radius, Math.min(newY, 600 - radius)); // Example height: 600px

    // Check for collisions with obstacles
    const horizontalCollision = obstacles.some(obstacle =>
      obstacle.collidesWith({ x: newX, y: this.y, size: radius })
    );

    const verticalCollision = obstacles.some(obstacle =>
      obstacle.collidesWith({ x: this.x, y: newY, size: radius })
    );

    if (!horizontalCollision) this.x = newX;
    if (!verticalCollision) this.y = newY;

    this.velocityX = newX - this.x;
    this.velocityY = newY - this.y;
  }
}

module.exports = Player;