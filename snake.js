// Get the canvas element and its context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Define the size of each box in the grid
const box = 20;
const canvasSize = 400;

// Initialize the snake with one segment
let snake = [{ x: box * 5, y: box * 5 }];

// Set the initial direction of the snake
let direction = 'RIGHT';

// Generate the initial position of the food
let food = {
    x: Math.floor(Math.random() * (canvasSize / box)) * box,
    y: Math.floor(Math.random() * (canvasSize / box)) * box
};

// Define the obstacles
let obstacles = [
    { x: box * 10, y: box * 10 },
    { x: box * 15, y: box * 15 },
    { x: box * 20, y: box * 20 }
];

// Initialize the score
let score = 0;

// Listen for keydown events to change the direction of the snake
document.addEventListener('keydown', changeDirection);

// Function to change the direction of the snake based on key pressed
function changeDirection(event) {
    if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
    if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
    if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
    if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
}

// Function to draw the game elements on the canvas
function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    // Draw the snake
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? 'green' : 'green';
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw the food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, box, box);

    // Draw the obstacles
    ctx.fillStyle = 'gray';
    for (let i = 0; i < obstacles.length; i++) {
        ctx.fillRect(obstacles[i].x, obstacles[i].y, box, box);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(obstacles[i].x, obstacles[i].y, box, box);
    }

    // Draw the score
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);

    // Get the current head position of the snake
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Update the head position based on the direction
    if (direction === 'LEFT') snakeX -= box;
    if (direction === 'UP') snakeY -= box;
    if (direction === 'RIGHT') snakeX += box;
    if (direction === 'DOWN') snakeY += box;

    // Wrap the snake position around if it goes through the wall
    if (snakeX < 0) snakeX = canvasSize - box;
    if (snakeY < 0) snakeY = canvasSize - box;
    if (snakeX >= canvasSize) snakeX = 0;
    if (snakeY >= canvasSize) snakeY = 0;

    // Check if the snake has eaten the food
    if (snakeX === food.x && snakeY === food.y) {
        // Generate new food position
        food = {
            x: Math.floor(Math.random() * (canvasSize / box)) * box,
            y: Math.floor(Math.random() * (canvasSize / box)) * box
        };
        // Increment the score
        score++;
    } else {
        // Remove the last segment of the snake
        snake.pop();
    }

    // Create a new head for the snake
    let newHead = { x: snakeX, y: snakeY };

    // Check for collisions with the snake itself or obstacles
    if (collision(newHead, snake) || collision(newHead, obstacles)) {
        // End the game if a collision is detected
        clearInterval(game);
    }

    // Add the new head to the snake
    snake.unshift(newHead);
}

// Function to check for collisions with the snake itself or obstacles
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }
    return false;
}

// Function to restart the game
function restartGame() {
    // Reset the snake
    snake = [{ x: box * 5, y: box * 5 }];
    // Reset the direction
    direction = 'RIGHT';
    // Reset the food position
    food = {
        x: Math.floor(Math.random() * (canvasSize / box)) * box,
        y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
    // Reset the score
    score = 0;
    // Update the score display
    document.getElementById('score').innerText = 'Score: ' + score;
    // Restart the game loop
    clearInterval(game);
    game = setInterval(draw, 100);
}

// Add event listener to the restart button
document.getElementById('restartButton').addEventListener('click', restartGame);

// Set the game loop to run the draw function every 100 milliseconds
let game = setInterval(draw, 100);