const fs = require('fs');
const INPUT_FILE = 'input';

const readInput = () => {
    return fs.readFileSync(`${__dirname}/${INPUT_FILE}`)
        .toString()
        .split(',')
        .map(n => parseInt(n));
}

// Could just take median -.-
const getCheapestFixed = (positions) => {
    positions = positions.sort((a, b) => a - b);

    let leftCosts = Array.from({ length: positions.length }).fill(0);

    for(let i = 1; i < positions.length; i++) {
        leftCosts[i] = leftCosts[i-1];
        leftCosts[i] += ((positions[i] - positions[i-1]) * i);
    }

    let rightCosts = Array.from({ length: positions.length }).fill(0);

    for(let i = positions.length - 2; i >= 0; i--) {
        rightCosts[i] = rightCosts[i+1];
        rightCosts[i] += ((positions[i+1] - positions[i]) * (positions.length - 1 - i));
    }

    let minCost = Number.MAX_SAFE_INTEGER;

    for(let i = 0; i < positions.length; i++) {
        minCost = Math.min(leftCosts[i] + rightCosts[i], minCost);
    }

    return minCost;
}

const getCheapest = (positions) => {
    const avg = positions.reduce((acc, p) => p + acc) / positions.length;
    const avgs = [Math.floor(avg), Math.ceil(avg)];

    const costs = avgs.map((avg) => positions.reduce((acc, p) => {
        const moves = Math.abs(avg - p);
        const fuelCost = (moves ** 2 + moves) / 2;
        return acc + fuelCost;
    }, 0))

    return Math.min(...costs);

}
const positions = readInput();

console.log('Cheapest alignment (fixed fuel cost):', getCheapestFixed(positions));
console.log('Cheapest alignment:', getCheapest(positions));