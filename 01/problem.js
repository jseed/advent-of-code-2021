const fs = require('fs');
const assert = require('assert');

const sumWindows = readings => {
  let sums = [];
  for(let i = 0; i < readings.length - 2; i++) {
    sums.push(readings[i] + readings[i+1] + readings[i+2]);
  } 
  return sums;
}

const solve = readings => {
  let count = 0;

  for(let i = 1; i < readings.length; i++) {
    if (readings[i] > readings[i-1]) count++;
  }

  return count;
}

// Tests
assert.equal(3, solve([1,2,3,2,1,5]));
assert.deepEqual([3, 4], sumWindows([1, 1, 1, 2]));

const readings = fs.readFileSync('input-1').toString().split('\n').map((d) => parseInt(d));

console.log(solve(readings));
console.log(solve(sumWindows(readings)));

