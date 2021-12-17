const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => {
    const [x1, x2, y1, y2] = fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
    .toString()
    .match(/target area: x=(-?[\d]+)\.\.(-?[\d]+), y=(-?[\d]+)\.\.(-?[\d]+)/)
    .slice(1)
    .map(n => +n);

    return [[x1, y1], [x2, y2]];
}


const step = (probe) => {
    probe.x += probe.vx;
    probe.y += probe.vy;
    if (probe.vx < 0) probe.vx++;
    if (probe.vx > 0) probe.vx--;
    probe.vy--;
}

const isWithinTarget = (probe, [[x1, y1], [x2, y2]]) => probe.x >= x1 && probe.x <= x2 && probe.y >= y1 && probe.y <= y2;
const isPastTarget = (probe, [[x1, y1], [x2, y2]]) => {
    if (x2 > 0 && probe.x > x2) return true;
    if (x1 < 0 && probe.x > x1) return true;
    if (probe.y < Math.min(0, y1)) return true;
}


const hitsTarget = (vx, vy, target) => {
    let probe = { x: 0, y: 0, vx, vy };
    let maxY = 0;
    while(!isPastTarget(probe, target)) {
        if (isWithinTarget(probe, target)) {
            return maxY;
        }

        step(probe);
        maxY = Math.max(maxY, probe.y);

    }

    return null;
}

const target = readInput();

let max = -Infinity;
let count = 0;

const maxX = Math.max(Math.abs(target[0][0]), Math.abs(target[1][0])) + 1;
const maxY = Math.max(Math.abs(target[0][1]), Math.abs(target[1][1])) + 1;

// Brute force 🤘
for(let y = -maxY; y <= maxY; y++) {
    for(let x = -maxX; x <= maxX; x++) {
        const maxVal = hitsTarget(x, y, target);
        if (maxVal !== null) {
            max = Math.max(max, maxVal);
            count++;
        }
    }
}

console.log(max); 
console.log(count);