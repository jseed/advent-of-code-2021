const assert = require('assert');
const fs = require('fs');


const move = (pos, direction, amount) => {
    switch(direction) {
        case 'up':
            return {...pos, aim: pos.aim - amount };
        case 'down':
            return { ...pos, aim: pos.aim + amount };
        case 'forward':
            return { ...pos, x: pos.x + amount, depth: pos.depth + pos.aim * amount };
        default:
            return { ...pos }
    }
}

const solve = (commands) => commands.reduce((pos, [dir, amount]) => move(pos, dir, amount), {x: 0, depth: 0, aim: 0});

// TESTS
let pos = {x: 0, depth: 0, aim: 0}

pos = move(pos, 'up', 1);
assert.equal(pos.x, 0);
assert.equal(pos.depth, 0);
assert.equal(pos.aim, -1);

pos = move(pos, 'down', 2);
assert.equal(pos.x, 0);
assert.equal(pos.aim, 1);
assert.equal(pos.depth, 0);

pos = move(pos, 'forward', 2);
assert.equal(pos.x, 2);
assert.equal(pos.depth, 2)
assert.equal(pos.aim, 1);

pos = move(move(pos, 'down', 1), 'forward', 1)
assert.equal(pos.x, 3);
assert.equal(pos.depth, 4);


const commands = fs.readFileSync('./input').toString().split('\n').map(line => line.split(' ')).map((parts) => [parts[0], parseInt(parts[1])]);

const position = solve(commands);
console.log(`Position: ${JSON.stringify(position)}, Value: ${position.x * position.depth}`);