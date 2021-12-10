const fs = require('fs');

class Board {

    constructor(inputs) {
        this.board = inputs.split('\n').map(line => line.trim().split(/  ?/g).map(n => ({ marked: false, number: parseInt(n)})));
    }

    markNumber(number) {
        this.board.forEach((row) => row.forEach((cell) => {
            if (cell.number === number) {
                cell.marked = true;
            }
        }));
    }

    // checkWin depends on square board
    checkWin() {
        for(let y = 0; y < this.board.length; y++) {
            let allXMarked = true;
            let allYMarked = true;
            for(let x = 0; x < this.board[y].length; x++) {
                if (!this.board[y][x].marked) {
                    allXMarked = false;
                }

                if (!this.board[x][y].marked) {
                    allYMarked = false;
                }
            }
            if (allYMarked || allXMarked) return true;
        }

        return false;
    }

    getUnmarkedSum() {
        return this.board.reduce((sum, row) => sum + row.reduce((sum, cell) => sum + (cell.marked ? 0 : cell.number), 0), 0);
    }
}


let [numbers, ...boards] = fs.readFileSync('./input').toString().split('\n\n');
numbers = numbers.split(',').map(n => parseInt(n));
boards = boards.map((line) => new Board(line));

let scores = [];

for(let i = 0; i < numbers.length; i++) {
    boards.forEach((board) => board.markNumber(numbers[i]));
    const [winners, losers] = boards.reduce((acc, board) => {
        acc[board.checkWin() ? 0 : 1].push(board);
        return acc;
    }, [[], []]);
    
    boards = losers;

    winners.forEach((board) => {
        scores.push(board.getUnmarkedSum() * numbers[i]);
    })
}

console.log('First winner had score:', scores[0]);
console.log('Last winner had score:', scores[scores.length - 1]);