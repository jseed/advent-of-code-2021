const fs = require('fs');
const path = require('path');
const INPUT_FILE = 'input';

const readInput = () => {
    return fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
        .toString()
        .split('\n')
        .map((line) => line.split('').map((n) => parseInt(n)));
}




const getValue = (heightMap, x, y) => {
    if (y < 0 || y >= heightMap.length || x < 0 || x >= heightMap[y].length) {
        return 9;
    }

    return heightMap[y][x];
}

const getAdjacentPoints = (x, y) => {
    return [
        {x: x+1, y},
        {x: x-1, y},
        {x, y: y+1},
        {x, y: y-1},
    ];
}

const getLowPoints = (heightMap) => {
    const lowPoints = [];
    for(let y = 0; y < heightMap.length; y++) {
        for(let x = 0; x < heightMap[y].length; x++) {
            const adjacent = getAdjacentPoints(x, y);

            if (adjacent.every((point) => heightMap[y][x] < getValue(heightMap, point.x, point.y))) {
                lowPoints.push({x, y});
            }
        }
    }

    return lowPoints;
}

const getBasinSize = (heightMap, x, y) => {
    const value = getValue(heightMap, x, y);
    if (value === 9) return 0;
    heightMap[y][x] = 9;

    const adjacentPoints = getAdjacentPoints(x, y);
    

    let size = 0;

    for(let point of adjacentPoints) {
        const pointValue = getValue(heightMap, point.x, point.y);
        if (pointValue > value) {
            size += getBasinSize(heightMap, point.x, point.y);
        }
    }

    return size + 1;
}

const heightMap = readInput();

const lowPoints = getLowPoints(heightMap);
const riskLevel = lowPoints.reduce((acc, {x, y}) => acc + heightMap[y][x] + 1, 0);

console.log('Risk Level:', riskLevel);

const basinSizes = lowPoints.map(({x, y}) => getBasinSize(heightMap, x, y));
const product = basinSizes.sort((a,b)=>a-b).slice(basinSizes.length - 3).reduce((acc, v) => acc*v, 1);

console.log('Product of 3 largest:', product);