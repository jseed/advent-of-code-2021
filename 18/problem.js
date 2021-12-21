const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
    .toString()
    .split('\n')
    .map((l) => l.split('').map((t) => isNaN(parseInt(t)) ? t : parseInt(t)));



const explode = (tokens, explodeIndex) => {
    let lastNumIndex = -1;
    let nextNumIndex = -1;
    for(let i = 0; i < explodeIndex; i++) {
        if (!isNaN(tokens[i])) {
            lastNumIndex = i;
        }
    }
    for(let i = explodeIndex + 5; i < tokens.length; i++) {
        if (!isNaN(tokens[i])) {
            nextNumIndex = i;
            break;
        }
    }

    if (lastNumIndex !== -1) {
        tokens[lastNumIndex] += tokens[explodeIndex + 1];
    }

    if (nextNumIndex !== -1) {
        tokens[nextNumIndex] += tokens[explodeIndex + 3];
    }

    tokens.splice(explodeIndex, 5, 0);
}

const split = (tokens, splitIndex) => {
    let pair = ['[',  Math.floor(tokens[splitIndex] / 2), ',', Math.ceil(tokens[splitIndex] / 2), ']'];
    tokens.splice(splitIndex, 1, ...pair);
}

const doReduction = (tokens) => {
    let depth = 0;
    let splitIndex = -1;
    let explodeIndex = -1;

    for(let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (token === '[') {
            depth++
            if (depth === 5) {
                explodeIndex = i;
                break;
           
            }
        } else if (token === ']') {
            depth--;
        } else if (token === ',') {
            continue;
        } else {
            if (token >= 10 && splitIndex === -1) {
                splitIndex = i;
            }
        }

    }

    if (explodeIndex !== -1) {
        explode(tokens, explodeIndex);
        return true;
    }
    if (splitIndex !== -1) {
        split(tokens, splitIndex);
        return true;
    }

    return false;
}

const addNumbers = (a, b) => ['[', ...a, ',', ...b, ']'];

const sumNumbers = (numbers) => {
    let head = numbers.shift();
    while(numbers.length) {
        head = addNumbers(head, numbers.shift());
        while(doReduction(head));
    }

    return head;
}

const calculateMagnitude = (tokens) => {
    while(tokens.length > 1) {
        let closing = tokens.indexOf(']');
        let opening = tokens.slice(0, closing).lastIndexOf('[');
        tokens.splice(opening, 5, 3 * tokens[opening + 1] + 2 * tokens[closing - 1]);
    }
    return tokens[0];
}


const part1 = () => {
    const numbers = readInput();
    const result = sumNumbers(numbers);
    const magnitude = calculateMagnitude(result);
    console.log('Magnitude:', magnitude);
}

const part2 = () => {
    const numbers = readInput();

    let maxMagnitude = Number.MIN_SAFE_INTEGER;

    for(let i = 0; i < numbers.length; i++) {
        for(let j = 0; j < numbers.length; j++) {
            if (i === j) continue;
            let a = [...numbers[i]];
            let b = [...numbers[j]];
            const magnitude = calculateMagnitude(sumNumbers([a, b]));
            maxMagnitude = Math.max(maxMagnitude, magnitude);
        }
    }
    console.log('Max magnitude:', maxMagnitude);
}

part1();
part2();


