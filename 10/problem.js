const fs = require('fs');
const path = require('path');
const INPUT_FILE = 'input';

const bracketMap = {
    '(': ')',
    '[': ']',
    '{': '}',
    '<': '>',
}

const errorScoreMap = {
    ')': 3,
    ']': 57,
    '}': 1197,
    '>': 25137,
};

const autoCompleteScoreMap = {
    ')': 1,
    ']': 2,
    '}': 3,
    '>': 4,
};


const readInput = () => {
    return fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
        .toString()
        .split('\n');
}

const getSyntaxErrorScore = (line) => {
    const stack = [];

    for(let i = 0; i < line.length; i++) {
        let bracket = line[i];

        if (bracket === '(' || bracket === '[' || bracket === '{' || bracket === '<') {
            stack.push(bracket);
        } else {
            const opening = stack.pop();

            if (bracketMap[opening] !== bracket) {
                return errorScoreMap[bracket];
            }
        }
    }

    return 0;
}

const getAutocompleteScore = (line) => {
    const stack = [];

    for(let i = 0; i < line.length; i++) {
        let bracket = line[i];

        if (bracket === '(' || bracket === '[' || bracket === '{' || bracket === '<') {
            stack.push(bracket);
        } else {
            const opening = stack.pop();

            if (bracketMap[opening] !== bracket) {
                return 0;
            }
        }
    }
    let score = 0;

    while(stack.length) {
        const bracket = stack.pop();
        const closing = bracketMap[bracket]; 

        score *= 5;
        score += autoCompleteScoreMap[closing];
    }
    return score;
}
const lines = readInput();

const syntaxErrorScore = lines.reduce((acc, line) => acc + getSyntaxErrorScore(line), 0);

console.log('Syntax error score:', syntaxErrorScore);

const autoCompleteScores = lines.map((line) => getAutocompleteScore(line)).filter((score) => score !== 0 );
autoCompleteScores.sort((a,b) => a - b);
const middleScore = autoCompleteScores[Math.floor(autoCompleteScores.length / 2)];
console.log('Autocomplete middle score:', middleScore);