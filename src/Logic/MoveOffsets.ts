// returns lambdas for directions, starting with forwards
// and going clockwise. 8 and 9 are knight's moves
/*
-------
|8| |9|
|0|1|2|
|7| |3|
|6|5|4|
-------
*/

const moveOffsetsBlack = {
  // upwards
  0: position => [position[0]-1, position[1]-1],
  1: position => [position[0]-1, position[1]],
  2: position => [position[0]-1, position[1]+1],
  
  // sides
  3: position => [position[0], position[1]+1],
  7: position => [position[0], position[1]-1],
  
  //downwards
  4: position => [position[0]+1, position[1]+1],
  5: position => [position[0]+1, position[1]],
  6: position => [position[0]+1, position[1]-1],

  // Knight's moves
  8: position => [position[0]-2, position[1]-1],
  9: position => [position[0]-2, position[1]+1]
}

// Rotate indices 180 degrees
const moveOffsetsWhite = {
  // upwards
  4: position => [position[0]-1, position[1]-1],
  5: position => [position[0]-1, position[1]],
  6: position => [position[0]-1, position[1]+1],
  
  // sides
  7: position => [position[0], position[1]+1],
  3: position => [position[0], position[1]-1],
  
  //downwards
  0: position => [position[0]+1, position[1]+1],
  1: position => [position[0]+1, position[1]],
  2: position => [position[0]+1, position[1]-1],

  // Knight's moves
  8: position => [position[0]+2, position[1]-1],
  9: position => [position[0]+2, position[1]+1]
}

function getBlackOffsets(position : number[], movesArr : number[]) {
  return movesArr.map(moveIndex => {
      return moveOffsetsBlack[moveIndex](position)
    })
}

function getWhiteOffsets(position : number[], movesArr : number[]) {
  return movesArr.map(moveIndex => moveOffsetsWhite[moveIndex](position))
}

export default function getOffsets(position : number[], movesArr : number[],
  isPieceBlack : boolean) {
    return isPieceBlack ? getBlackOffsets(position, movesArr) : 
      getWhiteOffsets(position, movesArr)
}

export {getBlackOffsets, getWhiteOffsets};