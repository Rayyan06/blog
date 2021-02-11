
const BG_COLOR = '#231f20';
const SNAKE_COLOR = "#c2c2c2";
const FOOD_COLOR = '#e66916';

const socket = io('http://mrkwebsite.pythonanywhere.com/games/game/1');

socket.on('init', handleInit);


const gameState = {
    player: {
        pos: {
            x: 3,
            y: 10,
        },
        vel: {
            x: 1,
            y: 0,
        },
        snake: [
            {x: 1, y: 3},
            {x: 2, y: 3},
            {x: 3, y: 3}
        ]
    },
    food: {
        x: 7,
        y: 5,
    },
    gridSize: 15,
}

function setup() {
    createCanvas(windowWidth, windowHeight);




}


function drawGame(state) {
    background(BG_COLOR);

    const food = state.food;
    const gridSize = state.gridSize;

    const size = width/gridSize;

    fill(FOOD_COLOR);
    rect(food.x * size, food.y*size, size, size);

    paintPlayer(state.player, size, SNAKE_COLOR);

}

function paintPlayer(playerState, size, color) {
    const snake = playerState.snake;
    fill(color);

    for (let cell of snake) {
        rect(cell.x * size, cell.y * size, size, size);
    }
}
function draw() {
  drawGame(gameState);
}

function handleInit(msg) {
    console.log(msg);
    window.alert(msg);

}
