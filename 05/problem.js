const fs = require('fs');
const INPUT_PATH = './input';

/**
 * returns
 * [
 *  [
 *   [x1, y1], 
 *   [x2,y2]
 *  ],
 * ...
 * ]
 */
const readInput = () => {
    const parseLine = line => line.split(' -> ').map(str => str.split(',').map(n => parseInt(n)));

    return fs.readFileSync(INPUT_PATH)
        .toString()
        .split('\n')
        .map(parseLine);
}

// Execute callback for each point along the line x1,y1 -> x2,y2
const forEachPoint = ([[x1, y1], [x2, y2]], callback) => {
    callback(x1, y1);

    while(x1 !== x2 || y1 !== y2) {
        if (x1 < x2) x1++;
        if (x1 > x2) x1--;
        if (y1 < y2) y1++;
        if (y1 > y2) y1--;

        callback(x1, y1);  
    }
}

const countOverlaps = (lines) => {
    const points = lines.reduce((points, line) => {
        forEachPoint(line, (x, y) => {
            const hash = `${x},${y}`;

            if (!points[hash]) points[hash] = 0;
            points[hash]++;
        });
        
        return points;  
    }, {});

    return Object.values(points).filter(count => count > 1).length;
}

let input = readInput();

hvLines = input.filter(([[x1,y1],[x2, y2]]) => x1 === x2 || y1 === y2);

console.log('Horizontal/Vertical overlaps:', countOverlaps(hvLines));
console.log('Total Overlaps:', countOverlaps(input));