const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const GRAVITY = 0.6;
const FLAP_STRENGTH = -12;
const SPAWN_RATE = 90; // frames
const OBSTACLE_WIDTH = 50;
const OBSTACLE_SPACING = 200;

// Game state variables
let birdY = canvas.height / 2;
let birdVelocity = 0;
let birdFlap = false;
let birdWidth = 30;
let birdHeight = 30;

let obstacles = [];
let frame = 0;
let score = 0;
let gameOver = false;

// Bird drawing
function drawBird() {
  ctx.fillStyle = '#FF0';
  ctx.fillRect(50, birdY, birdWidth, birdHeight);
}

// Handle bird physics
function updateBird() {
  if (birdFlap) {
    birdVelocity = FLAP_STRENGTH;
    birdFlap = false;
  }
  birdVelocity += GRAVITY;
  birdY += birdVelocity;

  if (birdY < 0) birdY = 0;
  if (birdY + birdHeight > canvas.height) {
    birdY = canvas.height - birdHeight;
    gameOver = true;
  }
}

// Generate obstacles
function generateObstacles() {
  if (frame % SPAWN_RATE === 0 && !gameOver) {
    let gapY = Math.random() * (canvas.height - 200);
    obstacles.push({ x: canvas.width, gapY: gapY });
  }
  obstacles.forEach((obstacle, index) => {
    obstacle.x -= 3;
    if (obstacle.x + OBSTACLE_WIDTH < 0) obstacles.splice(index, 1);
  });
}

// Draw obstacles
function drawObstacles() {
  ctx.fillStyle = '#228B22';
  obstacles.forEach(obstacle => {
    ctx.fillRect(obstacle.x, 0, OBSTACLE_WIDTH, obstacle.gapY);
    ctx.fillRect(obstacle.x, obstacle.gapY + 100, OBSTACLE_WIDTH, canvas.height - obstacle.gapY - 100);
  });
}

// Check collisions
function checkCollisions() {
  obstacles.forEach(obstacle => {
    if (50 + birdWidth > obstacle.x && 50 < obstacle.x + OBSTACLE_WIDTH) {
      if (birdY < obstacle.gapY || birdY + birdHeight > obstacle.gapY + 100) {
        gameOver = true;
      }
    }
  });
}

// Draw score
function drawScore() {
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  ctx.fillText('Score: ' + score, 10, 20);
}

// Update game state
function update() {
  if (gameOver) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
    ctx.fillStyle = '#FFF';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
    return;
  }

  frame++;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  updateBird();
  generateObstacles();
  drawBird();
  drawObstacles();
  drawScore();
  checkCollisions();

  if (frame % 100 === 0 && !gameOver) score++;
  requestAnimationFrame(update);
}

// Reset game
function resetGame() {
  birdY = canvas.height / 2;
  birdVelocity = 0;
  birdFlap = false;
  obstacles = [];
  frame = 0;
  score = 0;
  gameOver = false;
  update();
}

// Event listener for bird flap and game reset
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' || e.code === 'ArrowUp') {
    if (gameOver) {
      resetGame();
    } else {
      birdFlap = true;
    }
  }
});

// Start the game
update();
