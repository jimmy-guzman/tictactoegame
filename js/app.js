const boxes = document.querySelectorAll(".box");
const marks = document.querySelectorAll("[data-mark]");
const selectionScreen = document.querySelector(".selection-screen");
const game = document.querySelector(".game");
const statusScreen = document.querySelector(".status-screen");
const gameEndScreen = document.querySelector(".game-end-screen");
const playAgain = document.querySelector("[data-next]");

const boxesArr = Array.from(boxes);
let huPlayer = "X";
let aiPlayer = "O";
let origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let isPlayerTurn = false;
let computerScore = 0;
let playerScore = 0;

function playerTurn() {
  boxes.forEach(box =>
    box.addEventListener("click", function() {
      const box = boxesArr.indexOf(this);
      if (origBoard[box] !== huPlayer && isPlayerTurn) {
        this.children[0].textContent = markChosen;
        origBoard[box] = huPlayer;
        if (
          !checkIfWon(origBoard, huPlayer) &&
          availableSpots(origBoard).length !== 0
        ) {
          statusScreen.children[0].textContent = "The computer's turn";
          isPlayerTurn = false;
          setTimeout(computerTurn, 300);
        } else {
          gameEnd();
        }
      }
    })
  );
}

function computerTurn() {
  let bestBox = minimax(origBoard, aiPlayer).index;
  origBoard[bestBox] = aiPlayer;
  boxes[bestBox].children[0].textContent = aiPlayer;
  if (
    !checkIfWon(origBoard, aiPlayer) &&
    availableSpots(origBoard).length !== 0
  ) {
    statusScreen.children[0].textContent = "The player's turn";
    isPlayerTurn = true;
    playerTurn();
  } else {
    gameEnd();
  }
}

function updateScoreboard() {
  const player = document.querySelector(".player-one .score");
  const computer = document.querySelector(".player-two .score");
  player.textContent = playerScore;
  computer.textContent = computerScore;
}

function gameEnd() {
  gameEndScreen.style.display = "block";
  if (checkIfWon(origBoard, huPlayer)) {
    playerScore++;
    statusScreen.children[0].textContent = "You Won!";
  } else if (checkIfWon(origBoard, aiPlayer)) {
    computerScore++;
    statusScreen.children[0].textContent = "The computer won!";
  } else {
    statusScreen.children[0].textContent = "It's a draw!";
  }
  updateScoreboard();
}

function startGame() {
  markChosen = this.dataset.mark;
  selectionScreen.style.display = "none";
  game.style.display = "flex";
  statusScreen.style.display = "block";
  if (markChosen === "X") {
    statusScreen.children[0].textContent = "The player's turn";
    isPlayerTurn = true;
    playerTurn();
  } else {
    huPlayer = "O";
    aiPlayer = "X";
    statusScreen.children[0].textContent = "The computer's turn";
    computerTurn();
  }
}

function resetGame() {
    gameEndScreen.style.display = "none";
    game.style.display = "none";
    statusScreen.style.display = "none";
    boxes.forEach(box => (box.children[0].textContent = ""));
    selectionScreen.style.display = "block";
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function minimax(newBoard, player) {
  const availSpots = availableSpots(newBoard);

  if (checkIfWon(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkIfWon(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  const moves = [];

  availSpots.forEach((availSpot, index) => {
    //create an object for each and store the index of that spot that was stored as a number in the object's index key
    const move = {};
    move.index = newBoard[availSpot];

    // set the empty spot to the current player
    newBoard[availSpot] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player == aiPlayer) {
      let result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      let result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    //reset the spot to empty
    newBoard[availSpot] = move.index;

    // push the object to the array
    moves.push(move);
  });

  // if it is the computer's turn loop over the moves and choose the move with the highest score
  let bestMove;
  if (player === aiPlayer) {
    let bestScore = -10000;
    moves.forEach((move, index) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = index;
      }
    });
  } else {
    // else loop over the moves and choose the move with the lowest score
    let bestScore = 10000;
    moves.forEach((move, index) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = index;
      }
    });
  }

  // return the chosen move (object) from the array to the higher depth
  return moves[bestMove];
}

function availableSpots(board) {
  return board.filter(spot => spot != "O" && spot != "X");
}

function checkIfWon(board, player) {
  return (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  );
}

marks.forEach(mark => mark.addEventListener("click", startGame));
playAgain.addEventListener("click", resetGame);