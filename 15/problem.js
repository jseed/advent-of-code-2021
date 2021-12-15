const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => {
    return fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
        .toString()
        .split('\n')
        .map((line) => line.split('').map(n => +n));
}

const buildGraph = (matrix) => {
    let graph = {};
    for(let y = 0; y < matrix.length; y++) {
        for(let x = 0; x < matrix[y].length; x++) {
            const hash = `${x},${y}`;
            graph[hash] = [
                [x+1, y],
                [x-1, y],
                [x, y+1],
                [x, y-1],
            ].filter(([x, y]) => {
                return y >= 0 && y < matrix.length && x >= 0 && x < matrix[y].length;
            }).map(([x, y]) => ({
                key: `${x},${y}`,
                weight: matrix[y][x],
                point: [x, y],
            }));
        }
    }

    return graph;
}

const expandCavern = (cavern) => {
    const copy = Array.from({length: cavern.length * 5}).map(() => Array.from({ length: cavern[0].length * 5 }));

    for(let y = 0; y < 5; y++) {
        for(let x = 0; x < 5; x++) {
            for(let iy = 0; iy < cavern.length; iy++) {
                for(let ix = 0; ix < cavern[0].length; ix++) {
                    let val = (cavern[iy][ix] + y + x);
                    while(val > 9) val -= 9;
                    copy[(y * cavern.length) + iy][ix + (x * cavern.length)] = val
                }
            }
        }
    }

    return copy;
}


const lowestRiskLevel = (graph, start, end) => {
    let unexplored = new Set([start]);
    let explored = new Set();
    let distances = Object.keys(graph).reduce((acc, key) => {
        acc[key] = Infinity;
        return acc;
    }, {});
    distances[start] = 0;

    while(unexplored.size) {
        
        let next = null

        unexplored.forEach((key) => {
            if (!next || distances[next] > distances[key]) next = key;
        });

        current = next;

        if (current === end) break;

        graph[current].forEach((node) => {
            if (!explored.has(node.key)) {
                unexplored.add(node.key)
                distances[node.key] = Math.min(distances[node.key], node.weight + distances[current]);
            }
        });

       
        explored.add(current);
        unexplored.delete(current);
    }

    return distances[end];
}


const cavern = readInput();
const graph = buildGraph(cavern);

console.log('Small cave lowest risk level', lowestRiskLevel(graph, '0,0', `${cavern[0].length - 1},${cavern.length - 1}`));

const expandedCavern = expandCavern(cavern);
const expandedGraph = buildGraph(expandedCavern);

console.log('Lowest risk level', lowestRiskLevel(expandedGraph, '0,0', `${expandedCavern[0].length - 1},${expandedCavern.length - 1}`));
