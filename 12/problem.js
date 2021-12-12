const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'input';

const readInput = () => fs.readFileSync(path.resolve(__dirname, INPUT_FILE))
    .toString()
    .split('\n')
    .map((line) => line.split('-'));


const getConnectionGraph = (connections) => {
    return connections.reduce((acc, [a, b]) => {
        if (!acc[a]) acc[a] = [];
        acc[a].push(b);

        if (!acc[b]) acc[b] = [];
        acc[b].push(a);

        return acc;
    }, {});
}

const countDistinctPaths = (connectionGraph, allowExtraVisit) => {
    const countPaths = (path, extraVisit, visited) => {
        // End of path!
        if (path === 'end') return 1;
    
        const isSmallCave = path.toLowerCase() === path;
        const wasVisited = visited.indexOf(path) !== -1;

        if (wasVisited && isSmallCave) {
            // Dead end
            if (path === 'start' || !extraVisit) {
                return 0;
            }

            // Consume extra visit
            extraVisit = false;
        }
        
        visited.push(path);

        const completePaths = connectionGraph[path].reduce((acc, path) => acc + countPaths(path, extraVisit, visited), 0);

        visited.pop();

        return completePaths;
    }

    return countPaths('start', allowExtraVisit, []);
}

const connections = readInput();
const connectionGraph = getConnectionGraph(connections);

console.log('Paths that visit small caves at most once:', countDistinctPaths(connectionGraph, false));
console.log('Paths that visit one small cave at most twice:', countDistinctPaths(connectionGraph, true));
