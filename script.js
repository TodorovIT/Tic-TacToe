let currentPlayer = 'X';
let cells = document.querySelectorAll('.cell');
let gameStatus = document.getElementById('status');
let winnerElement = document.getElementById('winner');
let winner;
let botDifficulty = 'hard'; // По подразбиране ботът е на трудно ниво
let botPlayer = 'O';
let gameMode = 'single'; // По подразбиране играта е срещу бот

function handleClick(cellIndex) {
    let cell = cells[cellIndex];
    if (!cell.textContent && !winner) {
        cell.textContent = currentPlayer;
        checkWin();
        if (!winner) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            gameStatus.textContent = `Player ${currentPlayer}'s turn`;
            if (gameMode === 'single' && currentPlayer === botPlayer) {
                botPlay();
            }
        }
    }
}

function checkWin() {
    let winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    for (let pattern of winningPatterns) {
        let [a, b, c] = pattern;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            winner = cells[a].textContent;
            gameStatus.textContent = `Player ${winner} wins!`;
            winnerElement.textContent = `Player ${winner} wins!`; // показва победителя на екрана
            cells.forEach(cell => cell.removeEventListener('click', handleClick));
            return;
        }
    }
    if ([...cells].every(cell => cell.textContent)) {
        gameStatus.textContent = "It's a draw!";
        winnerElement.textContent = ''; // премахва текста за победителя
    }
}

function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.addEventListener('click', () => handleClick(cell.id));
    });
    currentPlayer = 'X';
    winner = null;
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    winnerElement.textContent = ''; // нулира победителя на екрана
    if (gameMode === 'single' && botPlayer === 'X') {
        botPlay();
    }
}

function botPlay() {
    let emptyCells = [...cells].filter(cell => !cell.textContent);
    let bestMove;
    if (botDifficulty === 'easy') {
        bestMove = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    } else if (botDifficulty === 'hard') {
        let bestScore = -Infinity;
        for (let cell of emptyCells) {
            cell.textContent = botPlayer;
            let score = minimax(cells, 0, false);
            cell.textContent = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = cell;
            }
        }
    }
    bestMove.textContent = botPlayer;
    checkWin();
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

function minimax(cells, depth, isMaximizing) {
    let result = checkResult();
    if (result !== null) {
        return result;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let cell of cells) {
            if (!cell.textContent) {
                cell.textContent = botPlayer;
                let score = minimax(cells, depth + 1, false);
                cell.textContent = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let cell of cells) {
            if (!cell.textContent) {
                cell.textContent = currentPlayer === 'X' ? 'O' : 'X';
                let score = minimax(cells, depth + 1, true);
                cell.textContent = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkResult() {
    let winningPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6] // diagonals
    ];
    for (let pattern of winningPatterns) {
        let [a, b, c] = pattern;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            if (cells[a].textContent === botPlayer) {
                return 1;
            } else {
                return -1;
            }
        }
    }
    if ([...cells].every(cell => cell.textContent)) {
        return 0;
    }
    return null;
}

// Променя играта между срещу бот и срещу приятел
function changeGameMode(mode) {
    gameMode = mode;
    resetGame();
}

// Променя трудността на бота
function changeBotDifficulty(difficulty) {
    botDifficulty = difficulty;
    resetGame();
}

// Стартира играта
resetGame();
