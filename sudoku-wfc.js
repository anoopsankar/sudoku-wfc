const demoBoard = [
    [0,0,0,0,0,1,0,0,0],
    [0,0,4,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,9,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,3,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [7,0,0,0,0,0,0,0,0],
    [0,6,0,0,0,2,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    ];

let sudokuBoard = []
let candidates = []

window.onload = function() {
    sudokuBoard = generateSudokuBoard(9)
    init()

    document.getElementById('fill').onclick = fill
    document.getElementById('solve').onclick = solve
}

function init() {
    candidates = generateAllCandidates(sudokuBoard)
    drawBoard(sudokuBoard, candidates, "board")
}

function fill() {
    sudokuBoard = demoBoard
    init()
}


function solve() {
    let hasFailed = false
    // Eliminate candidates
    sudokuBoard.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell !== 0) {
                candidates[i][j] = []
                if (eliminateHorizontalAndVertical(i, j, cell)) {
                    hasFailed = true
                }

                if (eliminateLocalGroup(i, j, cell)) {
                    hasFailed = true
                }
            }
        });
    });

    if (hasFailed) {
        document.getElementById("error").style.visibility = 'visible'
    }

    drawBoard(sudokuBoard, candidates, "board");

    // Find the lowest entropy cell
    let lCell = findLowestEntropyCell();
    let guess = takeRandomElement(candidates[lCell[0]][lCell[1]])
    candidates[lCell[0]][lCell[1]] = []    
    sudokuBoard[lCell[0]][lCell[1]] = guess
}

function takeRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function eliminateHorizontalAndVertical(row, col, toRemove) {

    let hasFailed = false

    for (let j = 0; j < sudokuBoard.length; j++) {
        candidates[row][j] = removeElement(candidates[row][j], toRemove)
        hasFailed = hasFailed || isStuck(row, j)
    }

    for (let i = 0; i < sudokuBoard.length; i++) {
        candidates[i][col] = removeElement(candidates[i][col], toRemove)
        hasFailed = hasFailed || isStuck(i, col) 
    }

    return hasFailed
}

function isStuck(i, j) {
    return candidates[i][j].length == 0 && sudokuBoard[i][j] == 0 
}

function eliminateLocalGroup(row, col, toRemove) {
    let xMin = Math.floor(row / 3) * 3
    let xMax = xMin + 3

    let yMin = Math.floor(col / 3) * 3
    let yMax = yMin + 3

    let hasFailed = false

    for (let i = xMin; i < xMax; i++) {
        for (let j = yMin; j < yMax; j++) {
            candidates[i][j] = removeElement(candidates[i][j], toRemove)
            hasFailed = hasFailed || isStuck(i, j)
         }
    }

    return hasFailed
}

// Returns the cell indices for with the lowest entropy (lowest number of possible guesses)
function findLowestEntropyCell() {
    let minI, minJ
    let minElementsCount = 9

    candidates.forEach((arr2D, i) => {
        arr2D.forEach((arr3D, j) => {
            const elementsCount = arr3D.length;
            if (elementsCount != 0 && elementsCount < minElementsCount) {
                minI = i
                minJ = j
                minElementsCount = elementsCount;
            }
        })
    });

    return [minI, minJ];
}

function generateAllCandidates(board) {
    let numbersArray = Array.from({ length: 9 }, (_, index) => index + 1);

    for (let i = 0; i < board.length; i++) {
        candidates.push([])
        for (let j = 0; j < board.length; j++) {
            candidates[i].push(numbersArray)
        }
    }

    return candidates;
}

function removeElement(array, elementToRemove) {
    return array.filter(element => element !== elementToRemove)
}

function generateSudokuBoard(boardSize) {
    // Generate an empty Sudoku board
    let board = [];
    for (let i = 0; i < boardSize; i++) {
        board.push([]);
        for (let j = 0; j < boardSize; j++) {
            board[i].push(0);
        }
    }

    return board;
}

function drawBoard(board, guesses, elementId) {
    let table = "<table class='sudoku-board'>";
    for (let i = 0; i < board.length; i++) {
        if (i % 3 === 0 && i !== 0) {
            table += "<tr style='border-top: 3px solid #333;'>";
        } else {
            table += "<tr>";
        }
        for (let j = 0; j < board[i].length; j++) {
            let content = board[i][j] == 0 ? "<div class='choices'>" + guesses[i][j].join(' ') + "</div> " : board[i][j]
            if (j % 3 === 0 && j !== 0) {
                table += "<td style='border-left: 3px solid #333;'>" + content + "</td>";
            } else {
                table += "<td>" + content + "</td>";
            }
        }
        table += "</tr>";
        
    }
    table += "</table>";

    document.getElementById(elementId).innerHTML = table;
}

