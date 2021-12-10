const fs = require('fs');
const INPUT_FILE = 'input';

const readInput = () => {
    return fs.readFileSync(`${__dirname}/${INPUT_FILE}`)
        .toString()
        .split('\n')
        .map((line) => line.split(' | ').map((part) => part.split(' ')));
}

const countUnique = (input) => {
    return input.reduce((acc, line) => {
        return acc + line[1].reduce((count, signals) => {
            if (signals.length === 2 || signals.length === 3 || signals.length === 7 || signals.length === 4) {
                return count + 1;
            }
            return count;
        }, 0)
    }, 0);
}

const toBin = (pattern) => { 
    const bits = Array.from({ length: 7 }).fill(0);
    for(let i = 0; i < pattern.length; i++) {
        bits[pattern.charCodeAt(i) - 'a'.charCodeAt(0)] = 1;
    }
    const result = parseInt(bits.join(''), 2);
    return result;
}

const countBits = (num) => {
    return num.toString(2).replace(/0/g,'').length;
}

const getPatternMap = (patterns) => {

    const patternMap = {};

    const digitMap = {};
    
    const setDigitPattern = (digit, pattern) => {
        patternMap[pattern] = digit;
        digitMap[`${digit}`] = pattern;
    }
    
    const getDigit = (pattern) => patternMap[pattern];
    const getPattern = (digit) => digitMap[`${digit}`];
    const checkOverlap = (obj, target) => (obj & target) === obj;
    
    
    const bitCountMap = patterns.reduce((acc, p) => {
        const count = countBits(p);
    
        if (!acc[count]) {
            acc[count] = []; 
        }
        acc[count].push(p);
    
        return acc;
    }, {});
    
    setDigitPattern(1, bitCountMap['2'][0]);
    setDigitPattern(7, bitCountMap['3'][0]);
    setDigitPattern(4, bitCountMap['4'][0]);
    setDigitPattern(8, bitCountMap['7'][0]);
    
    let fiveLetter = bitCountMap[5];
    let sixLetter = bitCountMap[6];
    
    
    // Six letter that 1 doesnt overlap is 6
    setDigitPattern(6, sixLetter.find((pattern) => !checkOverlap(getPattern(1), pattern)));
    sixLetter = sixLetter.filter((pattern) =>  patternMap[pattern] === undefined)
    
    // 5 letter that overlaps 6 is 5
    setDigitPattern(5, fiveLetter.find((pattern) => checkOverlap(pattern, getPattern(6))));
    fiveLetter = fiveLetter.filter((pattern) => patternMap[pattern] === undefined)
    
    // 5 letter that 7 overlaps is 3
    setDigitPattern(3, fiveLetter.find((pattern) => checkOverlap(getPattern(7), pattern)));
    fiveLetter = fiveLetter.filter((pattern) =>  patternMap[pattern] === undefined)
    
    // Leftover 5 is 2
    setDigitPattern(2, fiveLetter[0]);
    
    // 6 letter that 4 overlaps is 9
    setDigitPattern(9, sixLetter.find((pattern) => checkOverlap(getPattern(4), pattern)));
    sixLetter = sixLetter.filter((pattern) => patternMap[pattern] === undefined)
    
    // Leftover is 0
    setDigitPattern(0, sixLetter[0]);

    return patternMap;
}


const getDisplayValue = ([patterns, outputs]) => {
    patterns = patterns.map((p) => toBin(p));
    outputs = outputs.map((o) => toBin(o));

    const patternMap = getPatternMap(patterns);
    return outputs.reduce((acc, o) => acc * 10 + patternMap[o], 0);
}

const displays = readInput();

console.log('Unique values:', countUnique(displays));
console.log('Sum of display values', displays.reduce((acc, display) => acc + getDisplayValue(display), 0));

