const fs = require('fs');
const assert = require('assert');

const countBit = (nums, i) => nums.reduce((acc, num) => acc + (num[i] === '1' ? 1 : 0), 0);

const countBits = (nums) => {
    let counts = Array.from({length: nums[0].length}).fill(0);

    for(let i = 0; i < nums.length; i++) {
        for(let j = 0; j < nums[i].length; j++) {
            if (nums[i][j] === '1') {
                counts[j]++;
            }
        }
    }

    return counts;
}

const gammaRating = (nums) => {
    const counts = countBits(nums);

    for(let i = 0; i < counts.length; i++) {
        if (counts[i] > nums.length / 2) {
            counts[i] = '1';
        } else {
            counts[i] = '0';
        }
    }

    return counts.join('');
}


const epsilonRating = (nums) => {
    const counts = countBits(nums);

    for(let i = 0; i < counts.length; i++) {
        if (counts[i] > nums.length / 2) {
            counts[i] = '0';
        } else {
            counts[i] = '1';
        }
    }

    return counts.join('');
}

const oxygenGeneratorRating = (nums) => {
    for(let i = 0; nums.length > 1 && i < nums[0].length; i++) {
        const count = countBit(nums, i);

        let keptBit = count >= nums.length / 2 ? '1' : '0';

        nums = nums.filter((num) => num[i] === keptBit);
    }
    return nums[0];
}

const co2ScrubberRating = (nums) => {
    for(let i = 0; nums.length > 1 && i < nums[0].length; i++) {
        const count = countBit(nums, i);

        let keptBit = count < nums.length / 2 ? '1' : '0';

        nums = nums.filter((num) => num[i] === keptBit);
    }
    return nums[0];
}

// TESTS
const bitlist = ['10', '00', '01', '01'];
assert.equal(countBit(bitlist, 0), 1);
assert.equal(countBit(bitlist, 1), 2);
assert.deepEqual(countBits(bitlist), [1, 2]);

const inputs = fs.readFileSync('./input').toString().split('\n');

const gammaRate = gammaRating(inputs);
const epsilonRate = epsilonRating(inputs);

const geProduct = parseInt(gammaRate, 2) * parseInt(epsilonRate, 2);

console.log(`gammaRate [${gammaRate}] * epsilonRate [${epsilonRate}] = `, geProduct)

const oxygenGenerationRate= oxygenGeneratorRating(inputs);
const co2ScrubbingRate = co2ScrubberRating(inputs)

const ocProduct = parseInt(oxygenGenerationRate, 2) * parseInt(co2ScrubbingRate, 2);
console.log(`oxygenGenerationRate [${oxygenGenerationRate}] * co2ScrubbingRate [${co2ScrubbingRate}] = ${ocProduct}`);


