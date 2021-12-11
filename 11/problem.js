const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
    .toString()
    .split('\n')
    .map((line) => line.split('').map((n) => parseInt(n)));


const inBounds = (grid, x, y) => y >= 0 && y < grid.length && x >= 0 && x < grid[y].length;

const getGridIterator = (grid) =>
    grid.reduce((gridCoords, row, y) => [...gridCoords, ...row.reduce((rowCoords, _, x) => [...rowCoords, {x, y}], [])], []);


const incrementEnergy = (grid) => getGridIterator(grid).forEach(({x, y}) => grid[y][x]++);

const getSurroudingIterator = (grid, xPos, yPos) => {
    let coords = [];

    for(let y = yPos - 1; y <= yPos + 1; y++) {
        for(let x = xPos - 1; x <= xPos + 1; x++) {
            if (!(x === xPos && y === yPos) && inBounds(grid, x, y)) {
                coords.push({x, y});
            }
        }
    }

    return coords;
}

const flashCoordinate = (grid, x, y) => {
    grid[y][x] = 0;

    getSurroudingIterator(grid, x, y).forEach(({x, y}) => {
        if (grid[y][x] !== 0) {
            grid[y][x]++;
        }
        if (grid[y][x] > 9) {
            flashCoordinate(grid, x, y);
        }
    });
}

const flashGrid = (grid) => {
    getGridIterator(grid).forEach(({x, y}) => {
        if(grid[y][x] > 9) {
            flashCoordinate(grid, x ,y);
        }
    });
}

const countFlashes = (grid) => getGridIterator(grid).reduce((acc, {x, y}) => acc + (grid[y][x] === 0 ? 1 : 0), 0);




let grid = readInput();
let flashCount = 0;

for(let i = 0; i < 100; i++) {
    incrementEnergy(grid);
    flashGrid(grid);
    flashCount += countFlashes(grid);
}

console.log('Total flashes after 100 steps:', flashCount);

grid = readInput();
let step = 0;
const numOctopus = grid.length * grid[0].length;
while(countFlashes(grid) !== numOctopus) {
    incrementEnergy(grid);
    flashGrid(grid);
    step++;
}

console.log('All octopuses first flash on step:', step);