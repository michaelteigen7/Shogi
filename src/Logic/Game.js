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
    // this.board is the 9x9 grid. Order of the pieces is crucial
    this.board = board;
    // Piece stands are arrays for each piece type for each player.
    // Order of the pieces within each piecetype is irrelevant
    // As all the pieces within a common array should be identical
    this.pieceStands = pieceStands;

    // Assign each piece its position relative to the board
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        const piece = this.board[i][j];
        if (piece !== emptySquare) {
          piece.position = [i, j];
        }
      }
    }

    // Add method to get empty squares to the board array itself
    this.board.getEmptySquareLocations = () => {
      const emptyLocations = [];
      for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
          if(this.board[i][j] === emptySquare) {
            emptyLocations.push([i, j])
          }
        }
      }
      return emptyLocations;
    }
  }

  // Create a new board object that retains old references to pieces
  shallowCopy() {
    return new Board(this.board, this.pieceStands);
  }

  // Get a completely new, identical baord object with new pieces
  copy() {
    // copy board proper
    const newBoard = this.board.map(row => {
      return row.map(cell => {
        return (
          cell === emptySquare ? 
          emptySquare : cell.copy()
        );
      })
    });
    
    // copy piece stands
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
  
  getBlackPieces(black = true) {
    const retArr = []
    this.board.forEach(row => {
      row.forEach(cell => {
        if(cell !== emptySquare && cell.isBlack === black) {
          retArr.push(cell);
        }
      })
    })    
    return retArr;
  }

  getBlackDrops(black = true) {
    const color = black ? 'black' : 'white';
    const pieceStand = this.pieceStands[color];
    const dropActions = [];
    for (let pieceType in pieceStand) {
      for (let piece in pieceStand[pieceType]) {
        dropActions.concat(piece.getPossibleActions(this.board));
      }
    }
  }

  // Supply the engine with a list of possible actions
  getEngineActionChoices(engineIsBlack) {
    const enginePieces = this.getBlackPieces(engineIsBlack);

    const possibleMoves = [];
    enginePieces.forEach(piece => {
      piece.getPossibleActions(this.board).forEach(action => {
        possibleMoves.push(action);
      })
    })

    return possibleMoves.concat(this.getBlackDrops(this.board));
  }

  // ACTIONS
  // Each action should deepcopy the baord, mutate that copy
  // and return new board

  move_piece(action) {
    // Get references
    const iCurrent = action.currPos[0];
    const jCurrent = action.currPos[1];
    const iMove = action.movePos[0];
    const jMove = action.movePos[1];

    // Need to deep-copy old board for state update
    const newBoard = this.copy();
    const piece = newBoard.board[iCurrent][jCurrent];

    // Handle captured piece
    if (action.capture) {
      const capturedPiece = newBoard.board[iMove][jMove];
      const color = capturedPiece.isBlack ? "white" : "black";

      capturedPiece.position = [null, null]; // Piece doesn't have a board position
      capturedPiece.isPromoted = false;
      capturedPiece.isBlack = !capturedPiece.isBlack; // Flip piece ownership

      const pieceStands = newBoard.pieceStands;
      pieceStands[color][capturedPiece.getPieceType()].push(capturedPiece);
    }

    // Move piece to new position and update the piece's position property
    newBoard.board[iCurrent][jCurrent] = emptySquare;
    newBoard.board[iMove][jMove] = piece;
    piece.position = [iMove, jMove];

    return newBoard;
  };

    promote_piece(lastMove) {
    const i = lastMove.movePos[0];
    const j = lastMove.movePos[1];

    const newBoard = this.copy();
    newBoard.board[i][j].isPromoted = true;

    return newBoard;
  };

    drop_piece(action) { 
    // Get target square board coordinates
    const i = action.movePos[0];
    const j = action.movePos[1];
    const newBoard = this.copy();
    
    // The array of the player's piecestand for a particular kind of piece
    const pieceType = newBoard.pieceStands[action.pieceColor][action.pieceType];

    // Place the piece on the new board
    newBoard.board[i][j] = pieceType[0];
    
    // Remove a piece of the selected piece type off the piecestand
    pieceType.shift();
    
    return newBoard;
  };
}

export default Board;
