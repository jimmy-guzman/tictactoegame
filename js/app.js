const boxes = document.querySelectorAll(".box");
const marks = document.querySelectorAll("[data-mark]");
const selectionScreen = document.querySelector(".selection-screen");
const game = document.querySelector(".game");
const statusScreen = document.querySelector(".status-screen");
const gameEndScreen = document.querySelector(".game-end-screen");
const nextButtons = document.querySelectorAll("[data-next]");

let markChosen = "X";
let turnCount = 0;
let isPlayerTurn = false;
let playerScore = 0;
let computerScore = 0;

const grid = [
  { num: 0, placed: false },
  { num: 1, placed: false },
  { num: 2, placed: false },
  { num: 3, placed: false },
  { num: 4, placed: false },
  { num: 5, placed: false },
  { num: 6, placed: false },
  { num: 7, placed: false },
  { num: 8, placed: false }
];
const winConds = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];
const boxesArr = Array.from(boxes);

function playerTurn() {
  let result = false;
  boxes.forEach(box =>
    box.addEventListener("click", function() {
      const box = boxesArr.indexOf(this);
      if (!grid[box].placed && isPlayerTurn) {
        this.children[0].textContent = markChosen;
        grid[box].placed = true;
        grid[box].who = "player";
        turnCount++;
        result = checkIfWon("player");
        if (!result) {
          statusScreen.children[0].textContent = "The computer's turn";
          setTimeout(computerTurn, 300);
        } else {
          isPlayerTurn = false;
        }
      }
    })
  );
}

function computerTurn() {
  let result = false;
  const box = randomBox();
  grid[box].placed = true;
  grid[box].who = "computer";
  markChosen === "X"
    ? (boxes[box].children[0].textContent = "O")
    : (boxes[box].children[0].textContent = "X");
  turnCount++;
  result = checkIfWon("computer");
  if (!result) {
    statusScreen.children[0].textContent = "The player's turn";
    isPlayerTurn = true;
    playerTurn();
  } else {
    isPlayerTurn = false;
  }
}

function computerAi() {
  let currentPlaced = grid
    .filter(box => box.who === "player")
    .map(el => el.num);
  winConds.forEach(cond => {
    if (cond.some(elem => currentPlaced.indexOf(elem) !== -1)) {
      console.log(cond);
    }
  });
}

function randomBox() {
  const rbox = Math.floor(Math.random() * 9);
  if (!grid.every(box => box.placed)) {
    if (grid[rbox].placed) return randomBox();
  }
  return rbox;
}

function checkIfWon(who) {
  let result = false;
  let currentPlaced = grid.filter(box => box.who === who).map(el => el.num);

  if (currentPlaced.length > 2) {
    winConds.forEach(cond => {
      if (cond.every(elem => currentPlaced.indexOf(elem) !== -1)) {
        result = true;
        gameEnd(who);
        return;
      } else if (turnCount === 9) {
        result = true;
        gameEnd("draw");
        return;
      }
    });
  }

  return result;
}

function updateScoreboard() {
  const player = document.querySelector(".player-one .score");
  const computer = document.querySelector(".player-two .score");
  player.textContent = playerScore;
  computer.textContent = computerScore;
}

function gameEnd(result) {
  gameEndScreen.style.display = "block";
  if (result !== "draw") {
    statusScreen.children[0].textContent = "The " + result + " won!";
    result === "player" ? playerScore++ : computerScore++;
    updateScoreboard();
  } else {
    statusScreen.children[0].textContent = "It's a draw!";
  }
}

function startGame() {
  turnCount = 0;
  markChosen = this.dataset.mark;
  selectionScreen.style.display = "none";
  game.style.display = "flex";
  statusScreen.style.display = "block";
  if (markChosen === "X") {
    console.log("start player");
    statusScreen.children[0].textContent = "The player's turn";
    isPlayerTurn = true;
    playerTurn();
  } else {
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
    grid.forEach(box => {
      box.placed = false;
      delete box.who;
    });
  }
}
marks.forEach(mark => mark.addEventListener("click", startGame));
nextButtons.forEach(button => button.addEventListener("click", resetGame));
