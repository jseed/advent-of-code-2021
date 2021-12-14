const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

// Parse input to [ template, { pair: element, ... } ]
const readInput = () => {
    const data = fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
        .toString()
        .split('\n\n');

    data[1] = data[1].split('\n')
                     .map((str) => str.split(' -> '))
                     .reduce((acc, [pair, element]) => {
                         acc[pair] = element;
                         return acc;
                     }, {})

    return data
}

// Count the elements after N pair insertions on the given template
const countNInsertions = (template, rules, n) => {
    // Memoize - key is pair + number of insertions (NN10)
    const mem = {};

    const counts = template.split('').reduce((counts, e) => {
        if (!counts[e]) counts[e] = 0;
        counts[e]++;
        return counts;
    }, {});

    const combineCounts = (a, b) => Object.entries(b).forEach(([key, val]) => {
        if (!a[key]) a[key] = 0;
        a[key]+= val;
    });

    // Recursively counts elements in result of N pair insertions on the given pair
    const countInsertions = (pair, n) => {
        if (mem[pair + n]) return mem[pair + n];

        const insertion = rules[pair];
        
        // Terminate when max iterations are reached or there is no valid insertion
        if (!insertion) return {};
        if (n === 0) return {};

        // Recursively count elements
        const count = {[insertion]: 1};
        combineCounts(count, countInsertions(pair[0] + insertion, n - 1));
        combineCounts(count, countInsertions(insertion + pair[1], n - 1));

        mem[pair + n] = {...count};

        return count;
    }

    // Count the inserted elements for each distinct pair in the template
    for(let i = 0; i < template.length - 1; i++) {
        let count = countInsertions(template.slice(i, i + 2), n);

        combineCounts(counts, count);
    }

    return counts;
}

const solve = (template, rules, iterations) => {
    const counts = countNInsertions(template, rules, iterations);
    const vals = Object.values(counts);
    return Math.max(...vals) - Math.min(...vals);
}

let [template, rules] = readInput();

console.log('min/max diff after 10 iterations:', solve(template, rules, 10));
console.log('min/max diff after 40 iterations:', solve(template, rules, 40));


