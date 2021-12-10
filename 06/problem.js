const fs = require('fs');
const INPUT_FILE = 'input';


const readInput = () => {
    return fs.readFileSync(`${__dirname}/${INPUT_FILE}`)
        .toString()
        .split(',')
        .map(n => parseInt(n));
}

const processGeneration = (timers) => {
    let newTimers = Array.from({ length: 9 }).fill(0);

    // Process existing
    for(let j = newTimers.length - 1; j >= 0; j--) {
        const nextIndex = j + 1 === timers.length ? 0 : j + 1;
        newTimers[j] = timers[nextIndex]; 
    }

    // Spawn new generation 
    newTimers[6] += timers[0];

    return newTimers;
}

let timers = Array.from({ length: 9 }).fill(0);
let fishes = readInput();
fishes.forEach((f) => timers[f]++);

for(let i = 0; i < 80; i++) {
    timers = processGeneration(timers);
}

let count = timers.reduce((acc, n) => acc + n);

console.log('Fish after 80 days:', count);

for(let i = 80; i < 256; i++) {
    timers = processGeneration(timers);
}

count = timers.reduce((acc, n) => acc + n);

console.log('Fish after 256 days:', count);

