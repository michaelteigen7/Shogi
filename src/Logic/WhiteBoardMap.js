const blackBoardMap = [
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
  [[],[],[],[],[],[],[],[],[]],
]

for (let i=0; i<9; i++) {
  for (let j=0; j<9; j++) {
    blackBoardMap[i][j] = [i,j];
  }
}

const whiteBoardMap = [];

for (let i=8; i>-1; i--) {
  const row = [];
  for (let j=8; j>-1; j--) {
    row.push(blackBoardMap[i][j])
  }
  whiteBoardMap.push(row);
}

export default function rotateMoves(moveArr) {
  return moveArr.map(move => whiteBoardMap[move[0]][move[1]])
}