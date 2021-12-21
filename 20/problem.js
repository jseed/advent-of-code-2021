const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => {
    const parts = fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
        .toString()
        .split('\n\n');

    const algorithm = parts[0];
    const image = parts[1].split('\n').map((line) => line.split(''));

    return [algorithm, image];
}


const inBounds = (image, x, y) => y >= 0 && y < image.length && x >= 0 && x < image[y].length;

const getPixelIndex = (image, x, y, spaceState) => {
    let bin = '';
    for(let r = y - 1; r <= y + 1; r++) {
        for(let c = x - 1; c <= x + 1; c++) {
            let char = inBounds(image, c, r) ? image[r][c] : spaceState;
            bin += char === '#' ? 1 : 0
        }
    }

    return parseInt(bin, 2);
}


const cropImage = (image, spaceState) => {
    let minX = image[0].length;
    let maxX = 0;
    let minY = image.length - 1;
    let maxY = 0;

    for(let y = 0; y < image.length; y++) {
        for(let x = 0; x < image.length; x++) {
            if(image[y][x] === '#') {
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
            }
        }
    }

    let copy = Array.from({ length: (maxY - minY) + 1 + 2 })
        .map(() => Array.from({ length: (maxX - minX) + 1 + 2}).fill(spaceState));

    for(let y = 0; y < copy.length - 2; y++) {
        for(let x = 0; x < copy[y].length - 2; x++) {
            copy[y + 1][x + 1] = image[y + minY][x + minX];
        }
    }

    return copy;
} 

const processImage = (image, spaceState) => {
    image = cropImage(image, spaceState);
    let copy = Array.from({ length: image.length }).map(() => Array.from({ length: image[0].length }).fill('.'));
    
    for(let y = 0; y < image.length; y++) {
        for(let x = 0; x < image[y].length; x++) {
            copy[y][x] = algorithm[getPixelIndex(image, x, y, spaceState)];
        }
    }

    return copy;
}

let EMPTY_SPACE_INDEX = 0;
let LIT_SPACE_INDEX = parseInt('111111111', 2)

const processImageTimes = (image, times) => {
    let spaceState = '.'

    for(let i = 0; i < times; i++) {
        image = processImage(image, spaceState);

        // Infinite space value may change based on algorithm
        if (spaceState === '.') {
            spaceState = algorithm[EMPTY_SPACE_INDEX];
        } else if (spaceState === '#') {
            spaceState = algorithm[LIT_SPACE_INDEX];
        }
    }
    
    return image;
}

const countLitPixels = (image) => {
    let sum = 0;

    for(let y = 0; y < image.length; y++) {
        for(let x = 0; x < image[y].length; x++) {
            if (image[y][x] === '#') {
                sum++;
            }
        }
    }

    return sum;
}

let [algorithm, image] = readInput();

console.log('Lit after 2 enhancements:', countLitPixels(processImageTimes(image, 2)));
console.log('Lit after 50 enhancements:', countLitPixels(processImageTimes(image, 50)));
