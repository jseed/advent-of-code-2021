const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => {
    let [points, folds] = fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
        .toString()
        .split('\n\n')
        .map((section) => section.split('\n'));

        
    points = points.map((str) => str.split(',').map((n) => parseInt(n))).map(([x, y]) => ({x,y}));

    folds = folds.map((str) => {
        const parts = str.split(' ').pop().split('=')
        parts[1] = parseInt(parts[1]);
        return parts;
    });
    return [points, folds];
}

const countPoints = (points) => {
    return new Set(points.map(({x,y})=>`${x},${y}`)).size
}

const foldPoints = (points, [axis, crease]) => {
    return points.map(({x, y}) => {
        let p = {x, y};
        if (p[axis] > crease) {
            p[axis] = crease - (p[axis] - crease);
        }
        return p;
    });
}

const getPaper = (points) => {
    const width = Math.max(...points.map(({x, y}) => x)) + 1;
    const height = Math.max(...points.map(({x, y}) => y)) + 1;

    const paper = Array.from({ length: height }).map(() => Array.from({ length: width }).fill('.'));
    points.forEach(({x, y}) => paper[y][x] = '#');
    
    return paper;
}

let [points, folds] = readInput();

console.log('Points after first fold:', countPoints(foldPoints(points, folds[0])));

folds.forEach((fold) => {
    points = foldPoints(points, fold);
})

console.log('Final paper:',)
console.log(getPaper(points).map((line) => line.join('')).join('\n'));