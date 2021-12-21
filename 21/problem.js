const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => {
    return fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
        .toString()
        .split('\n')
        .map((line) => parseInt(line.split(': ').pop()));
}

// game = [pos1, score1, pos2, score2, turn]
const doRoll = (game, amount) => {
    let pIndex = game[4] < 3 ? 0 : 2;

    game[pIndex] += amount;
    game[pIndex] %= 10;

    // Score every third turn
    if (game[4] === 2 || game[4] === 5) {
        game[pIndex + 1] += game[pIndex] + 1;
    }

    game[4]++;
    game[4] %= 6;

    return game;
}

const partOne = (positions) => {
    let die = 1;
    let game = [positions[0] - 1, 0, positions[1] - 1, 0, 0];

    while(game[1] < 1000 && game[3] < 1000) {
        doRoll(game, die++);
    }

    return (game[1] < 1000 ? game[1] : game[3]) * (die - 1);
}

const partTwo = (positions) => {    
    let mem = {};

    const play = (game) => {
        const hash = game.join(','); 
        if (mem[hash]) return mem[hash];

        if (game[1] >= 21) return [1, 0];
        if (game[3] >= 21) return [0, 1];

        let results = [0, 0];
        for(let i = 1; i <= 3; i++) {
            let res = play(doRoll([...game], i));
            results[0] += res[0];
            results[1] += res[1];
        }
        mem[hash] = results;
        return results;
    }

    let results = play([positions[0] - 1, 0, positions[1] - 1, 0, 0]);

    return Math.max(...results);
}

const positions = readInput();

console.log('Part one:', partOne(positions));
console.log('Part two:', partTwo(positions));