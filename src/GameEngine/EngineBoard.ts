import { Pawn, Silver, Gold, King } from "../Logic/Pieces";
import { Bishop, Rook, Lance, Knight } from "../Logic/RangedPieces";
import { emptySquare } from "../Logic/Game";
import PieceValues from "./PieceValues";

// Create pieces, which can be used as models
const pieceRefs = {
  'Pawn': new Pawn(),
  'Lance': new Lance(),
  'Knight': new Knight(),
  'Silver': new Silver(),
  'Gold': new Gold(),
  'Bishop': new Bishop(),
  'Rook': new Rook(),
  'King': new King()
}

// Less computationally intense to represent pieces as integers
const pieceCodes = {
  'Pawn': 0x1,
  'Lance': 0x2,
  'Knight': 0x3,
  'Silver': 0x4,
  'Gold': 0x5,
  'Bishop': 0x6,
  'Rook': 0x7,
  'King': 0x8
};

const whitePieceCode = 0x100
const promotedPieceCode = 0x10

class EngineBoard {
  constructor(board : number[], pieceStands : object) {
    this.board = board
    this.pieceStands = pieceStands;
  }

  // Baord is a single array, but the x-coordfinate can be multiplied
  // by 8 to represent an 8x8 array
  getPiece(position) {
    return this.board[(9 * position[0]) + position[1]];
  }

  getPieceType(pieceCode) {
    return pieceCode & 0xf;
  }

  pieceIsBlack(pieceCode) {
    return (pieceCode & 0xf00) !== 0x100;
  }

  pieceIsPromoted(pieceCode) {
    return (pieceCode & 0xf0) !== 0x10;
  }

  // Iterate over the board and sum piece values
  getScore(engineIsBlack) {
    let engineScore = 0;
    for (let piece of this.board) {
        if (piece === 0) continue;
        const pieceIsBlack = this.pieceIsBlack(piece);
        // Map the piece to a value
        piece &= 0xff;
        const pieceValue = PieceValues.getPieceValue(piece);
        // Change the score by the piece value and ownership
        engineScore = engineIsBlack === pieceIsBlack ?
          engineScore + pieceValue :
          engineScore - pieceValue;
      }
    return engineScore;
  }

  set_piece(position, pieceCode) {
    this.board[(9 * position[0]) + position[1]] = pieceCode;
  }

  move_piece(action) {
    const currPos = action.currPos;
    let pieceCode = this.getPiece(currPos);

    // Handle piece capture
    if (action.capture) {
      const capturedPiece = this.getPiece(action.movePos);
      const pieceColor = this.pieceIsBlack(capturedPiece) ?
        'black' : 'white';
      this.pieceStands[pieceColor].push(this.getPieceType(capturedPiece));
    }

    // Handle promotion option
    if (action.promote) {
      pieceCode |= 0x10;
    }

    // Clear the space
    this.set_piece(currPos, 0);

    // Move the moving piece
    this.set_piece(action.movePos, pieceCode);
  }

  drop_piece(action) {
    const pieceType = pieceCodes[action.pieceType];
    // Encode the color
    const pieceCode = action.pieceColor === 'black' ? 
      pieceType : pieceType + 0x100;
    // Drop the piece
    this.set_piece(action.movePos, pieceCode);

    const remove = (array, element) => {
      const index = array.indexOf(element);
      if (index < 0) throw TypeError;
      array.splice(index, 1);
    }
    // Remove the piece from the piecestand
    remove(this.pieceStands[action.pieceColor], pieceType);
  }

  print() {
    for (let i = 0; i < 9; i++) {
      const rank = []
      for (let j = 0; j < 9; j++) {
        rank.push(this.getPiece([i, j]).toString(16));
      }
      console.log(rank);
    }
  }
}

// Tranform the front-end object-filled board into an array of integers
// and keep track of the positions of engine's pieces.
// Board is a single array so that deep-copying isn't an issue.
export default function encodeBoard(board, engineIsBlack) {
  const encodedBoard = [];
  const pieceStands = {
    black: [],
    white: []
  }

  // Set up board
  console.log(board.board);
  for (let row of board.board) {
    for (let piece of row) {
      if (piece === emptySquare) {
        encodedBoard.push(0x0);
        continue;
      }
      // Encode piece type
      let pieceCode = pieceCodes[piece.getPieceType()];

      // Encode piece color
      const pieceColor = piece.isBlack;
      pieceCode = pieceColor ? pieceCode : pieceCode + whitePieceCode;
      
      // Encode piece promotion status
      pieceCode = piece.isPromoted ? pieceCode + promotedPieceCode : pieceCode;
      
      encodedBoard.push(pieceCode);
    }
  }

  // Set up piecestands
  for (let color in board.pieceStands) {
    for (let pieceType in board.pieceStands[color]) {
      for (let piece of board.pieceStands[color][pieceType]) {
        // Encode piece type
        let pieceCode = pieceCodes[pieceType];

        const pieceIsBlack = piece.isBlack;
        const pieceColor = pieceIsBlack ? 'black' : 'white';
        pieceCode = pieceIsBlack ? pieceCode : pieceCode + whitePieceCode;
        pieceCode = piece.isPromoted ? pieceCode + promotedPieceCode : pieceCode;
        
        pieceStands[pieceColor].push(pieceCode);
      }
    }
  }
  
  return new EngineBoard(encodedBoard, pieceStands);
}