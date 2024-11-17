// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC8vFm8EATpY3VDgR_SzMS5MeGdKHpSx7o",
    authDomain: "tic-tac-toe-49328.firebaseapp.com",
    databaseURL: "https://tic-tac-toe-49328-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tic-tac-toe-49328",
    storageBucket: "tic-tac-toe-49328.firebasestorage.app",
    messagingSenderId: "404455408732",
    appId: "1:404455408732:web:7ce264e96ab440f9291299",
    measurementId: "G-EMMMD3ZYX1"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();
  
  const X_CLASS = 'x';
  const O_CLASS = 'o';
  const cellElements = document.querySelectorAll('[data-cell]');
  const winningMessageTextElement = document.querySelector('[data-winning-message-text]');
  const winningMessageElement = document.getElementById('winningMessage');
  const restartButton = document.getElementById('restartButton');
  const createGameButton = document.getElementById('createGameButton');
  const joinGameButton = document.getElementById('joinGameButton');
  const gameCodeInput = document.getElementById('gameCodeInput');
  const menu = document.getElementById('menu');
  const gameBoard = document.getElementById('gameBoard');
  
  let gameId;
  let playerSymbol;
  let gameRef;
  
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
  
  // Event Listeners
  createGameButton.addEventListener('click', createGame);
  joinGameButton.addEventListener('click', joinGame);
  restartButton.addEventListener('click', () => {
    location.reload(); // Reload the page to go back to menu
  });
  
  function createGame() {
    gameId = Math.random().toString(36).substr(2, 6);
    gameRef = database.ref('games/' + gameId);
    gameRef.set({
      board: Array(9).fill(''),
      currentTurn: 'x',
      players: 1,
      gameOver: false,
    });
    playerSymbol = 'x';
    startGame();
    alert('Game code: ' + gameId);
  }
  
  function joinGame() {
    gameId = gameCodeInput.value.trim();
    if (!gameId) {
      alert('Please enter a game code.');
      return;
    }
    gameRef = database.ref('games/' + gameId);
    gameRef.once('value').then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.players < 2) {
          gameRef.update({ players: 2 });
          playerSymbol = 'o';
          startGame();
        } else {
          alert('Game is full.');
        }
      } else {
        alert('Game not found.');
      }
    });
  }
  
  function startGame() {
    menu.classList.add('hide');
    gameBoard.classList.remove('hide');
    cellElements.forEach(cell => {
      cell.innerText = '';
      cell.classList.remove(X_CLASS);
      cell.classList.remove(O_CLASS);
      cell.removeEventListener('click', handleClick);
      cell.addEventListener('click', handleClick);
    });
    winningMessageElement.classList.add('hide');
  
    gameRef.on('value', snapshot => {
      const data = snapshot.val();
      if (!data) return;
      updateBoard(data.board);
      if (data.gameOver) {
        endGame(data.winner === 'draw', data.winner);
      }
    });
  }
  
  function handleClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');
    gameRef.once('value').then(snapshot => {
      const data = snapshot.val();
      if (data.gameOver) return;
      if (data.currentTurn !== playerSymbol) return;
      if (data.board[index] !== '') return;
  
      data.board[index] = playerSymbol;
      data.currentTurn = playerSymbol === 'x' ? 'o' : 'x';
  
      const winner = checkWin(data.board);
      if (winner) {
        data.gameOver = true;
        data.winner = winner;
      } else if (isDraw(data.board)) {
        data.gameOver = true;
        data.winner = 'draw';
      }
  
      gameRef.set(data);
    });
  }
  
  function updateBoard(board) {
    board.forEach((symbol, index) => {
      const cell = cellElements[index];
      cell.innerText = symbol.toUpperCase();
      cell.classList.remove(X_CLASS, O_CLASS);
      if (symbol) {
        cell.classList.add(symbol);
      }
    });
  }
  
  function endGame(draw, winner) {
    if (draw) {
      winningMessageTextElement.innerText = "It's a Draw!";
    } else {
      winningMessageTextElement.innerText = `${winner.toUpperCase()} Wins!`;
    }
    winningMessageElement.classList.remove('hide');
  }
  
  function isDraw(board) {
    return board.every(cell => cell !== '');
  }
  
  function checkWin(board) {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        board[a] &&
        board[a] === board[b] &&
        board[a] === board[c]
      ) {
        return board[a];
      }
    }
    return null;
  }  