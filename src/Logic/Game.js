import { Pawn, Silver, Gold, King } from "./Pieces";
import { Bishop, Rook, Lance, Knight } from "./RangedPieces";

const emptySquare = " ";
const startBoard = [
  [
    new Lance(false),
    new Knight(false),
    new Silver(false),
    new Gold(false),
    new King(false),
    new Gold(false),
    new Silver(false),
    new Knight(false),
    new Lance(false)
  ],
  [
    emptySquare,
    new Rook(false),
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    new Bishop(false),
    emptySquare
  ],
  [
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false),
    new Pawn(false)
  ],
  [
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare
  ],
  [
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare
  ],
  [
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare
  ],
  [
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true),
    new Pawn(true)
  ],
  [
    emptySquare,
    new Bishop(true),
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    emptySquare,
    new Rook(true),
    emptySquare
  ],
  [
    new Lance(true),
    new Knight(true),
    new Silver(true),
    new Gold(true),
    new King(true),
    new Gold(true),
    new Silver(true),
    new Knight(true),
    new Lance(true)
  ]
];

export { emptySquare, startBoard };


const pieceStandList = () => ({
  Pawn: [],
  Knight: [],
  Lance: [],
  Silver: [],
  Gold: [],
  Bishop: [],
  Rook: []
});

const emptyPieceStands = {
  black: pieceStandList(),
  white: pieceStandList()
};

class Board {
  constructor(board, pieceStands = emptyPieceStands) {
    this.board = board;
    this.pieceStands = pieceStands;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = this.board[i][j];
        if (piece !== emptySquare) {
          try {
            piece.position = [i, j];
          }
          catch (e) {
            console.log("Error in piece:");
            console.log(piece);
            console.log("Dumping board");
            console.log(this.board);
            throw TypeError;
          }
        }
      }
    }
  }

  getEmptySquares() {
    const emptySquares = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === emptySquare) {
          emptySquares.push([i, j]);
        }
      }
    }
    return emptySquares;
  }

  shallowCopy() {
    return new Board(this.board, this.pieceStands);
  }

  copy() {
    const newBoard = this.board.map(row => {
      return row.map(cell => {
        return (
          cell === emptySquare ? 
          emptySquare : cell.copy()
        );
      })
    });
    
    const stands = emptyPieceStands;
    for (let color in this.pieceStands) {
      for (let pieceType in this.pieceStands[color]) {
        stands[color][pieceType] = 
          this.pieceStands[color][pieceType].map(piece => piece.copy());
      }
    }
    const newBoardObj = new Board(newBoard, stands);
    return newBoardObj;
  }

  print() {
    for (let row of this.board) {
      console.log("| " + row.join(" | ") + " |");
    }
  }
}

export default Board;
