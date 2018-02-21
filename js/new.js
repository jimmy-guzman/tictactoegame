// loop through available spots
for (let i = 0; i < availSpots.length; i++) {
  //create an object for each and store the index of that spot that was stored as a number in the object's index key
  const move = {};
  move.index = newBoard[availSpots[i]];

  // set the empty spot to the current player
  newBoard[availSpots[i]] = player;

  //if collect the score resulted from calling minimax on the opponent of the current player
  if (player == aiPlayer) {
    let result = minimax(newBoard, huPlayer);
    move.score = result.score;
  } else {
    let result = minimax(newBoard, aiPlayer);
    move.score = result.score;
  }

  //reset the spot to empty
  newBoard[availSpots[i]] = move.index;

  // push the object to the array
  moves.push(move);
}

// loop through available spots
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
