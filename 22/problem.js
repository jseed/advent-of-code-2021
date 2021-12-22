const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
    .toString()
    .split('\n')
    .map((line) => {
        let [command, ranges] = line.split(' ');

        let [[x1, x2], [y1, y2], [z1, z2]] = ranges.split(',').map((range) => range.match(/^[xyz]=(-?\d+)\.\.(-?\d+)$/).slice(1, 3).map((n) => parseInt(n)));
        return [command === 'on' ? 1 : -1, {min: {x: x1, y: y1, z: z1}, max: {x: x2, y: y2, z: z2}}];
    })

const subtract = (a, b) => ({ x: a.x - b.x, y: a.y - b.y, z: a.z - b.z });

const volume = ({min, max}) => {
    let {x, y, z} = subtract(max, min);
    return (x+1) * (y+1) * (z + 1);
}

const collides = (a, b) => 
    (a.min.x <= b.max.x && a.max.x >= b.min.x) &&
    (a.min.y <= b.max.y && a.max.y >= b.min.y) &&
    (a.min.z <= b.max.z && a.max.z >= b.min.z);

const overlap = (a, b) => ({
    min: {x: Math.max(a.min.x, b.min.x), y: Math.max(a.min.y, b.min.y), z: Math.max(a.min.z, b.min.z)},
    max: {x: Math.min(a.max.x, b.max.x), y: Math.min(a.max.y, b.max.y), z: Math.min(a.max.z, b.max.z)},
});


const solve = (steps) => {
    let cubes = [];

    for(let [cmdA, cubeA] of steps) {

        for (let [cmdB, cubeB] of [...cubes]) {

            if (collides(cubeA, cubeB)) {
                // Invert the operation for the intersecting cube
                // this handles both off commands and multiple intersections
                cubes.push([cmdB * -1, overlap(cubeA, cubeB)]);
            }
        }

        if (cmdA === 1) {
            cubes.push([cmdA, cubeA]);
        }
    }

    return cubes.reduce((totalVolume, [cmd, cube]) => totalVolume + cmd * volume(cube), 0);
}

const partOne = () => {
    let steps = readInput();

    steps = steps.filter(([_, {min, max}]) => !((min.x > 50 || max.x < -50) || (min.y > 50 || max.y < -50) || (min.z > 50 || max.z < -50)));
    steps = steps.map(([cmd, {min, max}]) => {
        min.x = Math.max(-50, min.x);
        min.y = Math.max(-50, min.y);
        min.z = Math.max(-50, min.z);
        max.x = Math.min(50, max.x);
        max.y = Math.min(50, max.y);
        max.z = Math.min(50, max.z);
        return [cmd, {min, max}];
    });
    return solve(steps);
}

const partTwo = () => solve(readInput());

console.log('Part One:', partOne());
console.log('Part Two:', partTwo());