import { Pawn, Silver, Gold, King } from "../Logic/Pieces";
import { Bishop, Rook, Lance, Knight } from "../Logic/RangedPieces";
import { emptySquare } from "../Logic/Game";

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

// Tranform the front-end object-filled board into an array of integers
// and keep track of the positions of engine's pieces
function encodeBoard(board, engineIsBlack) {
  const emptyPieceStands = () => ({
    0x1: 0,
    0x2: 0,
    0x3: 0,
    0x4: 0,
    0x5: 0,
    0x6: 0,
    0x7: 0,
    0x8: 0
  })

  const encodedBoard = [];
  const pieceStands = {
    black: emptyPieceStands(),
    white: emptyPieceStands()
  };
  const enginePiecePositions = [];

  // Set up board
  for (let row of board.board) {
    const rank = [];
    for (let piece of row) {
      if (piece === emptySquare) continue;
      // Encode piece type
      let pieceCode = pieceCodes[piece.getPieceType()];

      // Encode piece color
      const pieceColor = piece.isBlack;
      pieceCode = pieceColor ? pieceCode : pieceCode + whitePieceCode;
      if (pieceColor === engineIsBlack) {
        enginePiecePositions.push(piece.position)
      }
      
      // Encode piece promotion status
      pieceCode = piece.isPromoted ? pieceCode + promotedPieceCode : pieceCode;
      
      rank.push(pieceCode);
    }
    encodedBoard.push(rank);
  }

  // Set up piecestands
  for (let color in board.pieceStands) {
    for (let pieceType in board.pieceStands[color]) {
      for (let piece of board.pieceStands[color][pieceType]) {
        // Encode piece type
        let pieceCode = pieceCodes[pieceType];

        pieceCode = piece.isBlack ? pieceCode : pieceCode + whitePieceCode;
        pieceCode = piece.isPromoted ? pieceCode + promotedPieceCode : pieceCode;
        
        pieceStands[color][pieceCodes[pieceType]]++;
      }
    }
  }

  return [encodedBoard, pieceStands, enginePiecePositions]
}

class EngineBoard {
  constructor(board, pieceStands, enginePiecePositions) {
    this.board = board
    this.pieceStands = pieceStands;
    this.enginePiecePositions = enginePiecePositions;
  }
}

export { encodeBoard, EngineBoard }