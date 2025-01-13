const board = document.getElementById("sudoku-board");
const newGameButton = document.getElementById("new-game");
const solveButton = document.getElementById("solve");

// Generate Sudoku grid
function generateGrid() {
    board.innerHTML = "";
    for (let i = 0; i < 81; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        const input = document.createElement("input");
        input.type = "text";
        input.maxLength = 1;

        // Allow only numbers 1-9
        input.addEventListener("input", (e) => {
            if (!/^[1-9]$/.test(e.target.value)) {
                e.target.value = "";
            }
        });

        cell.appendChild(input);
        board.appendChild(cell);
    }
}

// Get current state of the board as 2D array
function getBoard() {
    const cells = board.querySelectorAll("input");
    const sudoku = [];
    let row = [];
    cells.forEach((cell, index) => {
        row.push(cell.value === "" ? 0 : parseInt(cell.value));
        if ((index + 1) % 9 === 0) {
            sudoku.push(row);
            row = [];
        }
    });
    return sudoku;
}

// Set the board with 2D array
function setBoard(sudoku) {
    const cells = board.querySelectorAll("input");
    cells.forEach((cell, index) => {
        const row = Math.floor(index / 9);
        const col = index % 9;
        cell.value = sudoku[row][col] === 0 ? "" : sudoku[row][col];
        cell.disabled = sudoku[row][col] !== 0; // Disable pre-filled cells
    });
}

// Check if number placement is valid
function isValid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + (i % 3);
        if (board[boxRow][boxCol] === num) return false;
    }
    return true;
}

// Solve Sudoku using backtracking
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Generate a full, valid Sudoku board
function generateCompleteBoard() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(0));
    solveSudoku(board);
    return board;
}

// Create a puzzle by removing cells (ensuring solvability)
function createPuzzle(board, difficulty = 40) {
    const puzzle = board.map((row) => [...row]);
    let cellsToRemove = difficulty;

    while (cellsToRemove > 0) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);

        // Only remove a cell if it’s not already empty
        if (puzzle[row][col] !== 0) {
            const temp = puzzle[row][col];
            puzzle[row][col] = 0;

            // Check if the board is still solvable after the removal
            const copyPuzzle = puzzle.map((row) => [...row]);
            if (solveSudoku(copyPuzzle)) {
                cellsToRemove--;
            } else {
                // Revert if removal causes unsolvability
                puzzle[row][col] = temp;
            }
        }
    }

    return puzzle;
}

// Event listeners
newGameButton.addEventListener("click", () => {
    const fullBoard = generateCompleteBoard();
    const puzzle = createPuzzle(fullBoard, 40);
    setBoard(puzzle);
});

solveButton.addEventListener("click", () => {
    const sudoku = getBoard();
    if (solveSudoku(sudoku)) {
        setBoard(sudoku);
        alert("Sudoku solved!");
    } else {
        alert("No solution exists!");
    }
});

// Initial grid
generateGrid();
