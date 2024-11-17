const X_CLASS = 'x';
const O_CLASS = 'o';
const cellElements = document.querySelectorAll('[data-cell]');
const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
const winningMessageElement = document.getElementById('winningMessage');
const restartButton = document.getElementById('restartButton');
let oTurn;

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Rows
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6], // Columns
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8], // Diagonals
  [2, 4, 6]
];

startGame();

restartButton.addEventListener('click', startGame);

function startGame() {
  oTurn = false;
  cellElements.forEach(cell => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  winningMessageElement.classList.remove('show');
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = oTurn ? O_CLASS : X_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = "It's a Draw!";
  } else {
    winningMessageTextElement.innerText = `${oTurn ? "O's" : "X's"} Wins!`;
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  return [...cellElements].every(cell => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function swapTurns() {
  oTurn = !oTurn;
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => {
      return cellElements[index].classList.contains(currentClass);
    });
  });
}
