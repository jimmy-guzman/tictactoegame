const boxes = document.querySelectorAll(".box");
const marks = document.querySelectorAll("[data-mark]");
const selectionScreen = document.querySelector(".selection-screen");
const game = document.querySelector(".game");
const statusScreen = document.querySelector(".status-screen");
const gameEndScreen = document.querySelector(".game-end-screen");
const nextButtons = document.querySelectorAll("[data-next]");

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
      var box = boxesArr.indexOf(this);
      if (origBoard[box] !== huPlayer && isPlayerTurn) {
        this.children[0].textContent = markChosen;
        origBoard[box] = huPlayer;
        if (
          !winning(origBoard, huPlayer) &&
          emptyIndexies(origBoard).length !== 0
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
  if (!winning(origBoard, aiPlayer) && emptyIndexies(origBoard).length !== 0) {
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
  if (winning(origBoard, huPlayer)) {
    playerScore++;
    statusScreen.children[0].textContent = "You Won!";
  } else if (winning(origBoard, aiPlayer)) {
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
     setTimeout(computerTurn, 300);
  }
}

function resetGame() {
  if (this.dataset.next === "no") {
    gameEndScreen.style.display = "none";
  } else {
    gameEndScreen.style.display = "none";
    game.style.display = "none";
    statusScreen.style.display = "none";
    boxes.forEach(box => (box.children[0].textContent = ""));
    selectionScreen.style.display = "block";
    origBoard = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  }
}

// var fc = 0;
// the main minimax function
function minimax(newBoard, player) {
  //keep track of function calls;
  // fc++;
  //available spots
  var availSpots = emptyIndexies(newBoard);
  // checks for the terminal states such as win, lose, and tie and returning a value accordingly
  if (winning(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (winning(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  // an array to collect all the objects
  var moves = [];

  // loop through available spots
  for (var i = 0; i < availSpots.length; i++) {
    //create an object for each and store the index of that spot that was stored as a number in the object's index key
    var move = {};
    move.index = newBoard[availSpots[i]];

    // set the empty spot to the current player
    newBoard[availSpots[i]] = player;

    //if collect the score resulted from calling minimax on the opponent of the current player
    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    //reset the spot to empty
    newBoard[availSpots[i]] = move.index;

    // push the object to the array
    moves.push(move);
  }

  // if it is the computer's turn loop over the moves and choose the move with the highest score
  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    // else loop over the moves and choose the move with the lowest score
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  // return the chosen move (object) from the array to the higher depth

  return moves[bestMove];
}

// returns the available spots on the board
function emptyIndexies(board) {
  return board.filter(s => s != "O" && s != "X");
}

// winning combinations using the board indexies for instace the first win could be 3 xes in a row
function winning(board, player) {
  if (
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)
  ) {
    return true;
  } else {
    return false;
  }
}

marks.forEach(mark => mark.addEventListener("click", startGame));
nextButtons.forEach(button => button.addEventListener("click", resetGame));
