const assert = require('assert');
const fs = require('fs');


const move = (pos, direction, amount) => {
    switch(direction) {
        case 'up':
            return {...pos, z: pos.z - amount };
        case 'down':
            return { ...pos, z: pos.z + amount };
        case 'forward':
            return { ...pos, x: pos.x + amount };
        default:
            return { ...pos }
    }
}

const solve = (commands)  => commands.reduce((pos, [dir, amount]) => move(pos, dir, amount), {x: 0, z: 0});

// TESTS
let pos = {x: 0, z: 0}

pos = move(pos, 'up', 1);
assert.equal(pos.x, 0);
assert.equal(pos.z, -1);

pos = move(pos, 'down', 1);
assert.equal(pos.x, 0);
assert.equal(pos.z, 0);

pos = move(pos, 'forward', 2);
assert.equal(pos.x, 2);
assert.equal(pos.z, 0)

pos = move(move(pos, 'down', 1), 'forward', 1)
assert.equal(pos.x, 3);
assert.equal(pos.z, 1);

const commands = fs.readFileSync('./input').toString().split('\n').map(line => line.split(' ')).map((parts) => [parts[0], parseInt(parts[1])]);

const position = solve(commands);
console.log(`Position: ${JSON.stringify(position)}, Value: ${position.x * position.z}`);

