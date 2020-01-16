import { emptySquare } from "../Logic/Game";
import PieceValues from "./PieceValues";
import { ActionDef } from "../Definitions";
import getPossibleMoves from "./PieceMoves";
import getDrops from "./PieceDrops";

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

const whitePieceCode = 0x100;
const promotedPieceCode = 0x10;
const emptySquareCode = 0x0;

class EngineBoard {
  constructor(public board : number[], public pieceStands : object) {
  }

  // Board is a single array, but the x-coordfinate can be multiplied
  // by 8 to represent an 8x8 array
  getPiece(position : [number, number]) : number {
    return this.board[(9 * position[0]) + position[1]];
  }

  getPieceType(pieceCode : number) : number {
    return pieceCode & 0xf;
  }

  pieceIsBlack(pieceCode : number) : boolean {
    return (pieceCode & 0xf00) !== 0x100;
  }

  pieceIsPromoted(pieceCode : number) : boolean {
    return (pieceCode & 0xf0) === 0x10;
  }

  getCoordinates(index) : [number, number] {
    return [parseInt(index / 9, 10), index % 9];
  }

  // Iterate over the board and sum piece values
  getScore(engineIsBlack : boolean) : number {
    let engineScore = 0;

    const addPieceScore = (piece, pieceIsBlack) => {
      const pieceValue : number = PieceValues.getPieceValue(piece);
      // Change the score by the piece value and ownership
      engineScore = engineIsBlack === this.pieceIsBlack(piece) ?
        engineScore + pieceValue :
        engineScore - pieceValue;
    }

    // board
    for (let piece of this.board) {
      if (piece === 0) continue;
      // Map the piece to a value
      addPieceScore(piece, this.pieceIsBlack(piece));
    }

    // piece stands
    for (let piece of this.pieceStands['black']) {
      addPieceScore(piece, false);
    }
    for (let piece of this.pieceStands['white']) {
      addPieceScore(piece + 0x100, true);
    }

    return engineScore;
  }

  set_piece(position : [number, number], pieceCode : number) : void {
    this.board[(9 * position[0]) + position[1]] = pieceCode;
  }

  possibleActions(isBlacksTurn : boolean) : ActionDef[] {
    const colorCode = isBlacksTurn ? 0 : 0x100;
    let actions = [];
    for (let i = 0; i < this.board.length; i++) {
      const pieceCode = this.board[i];
      if (pieceCode !== emptySquare && ((pieceCode & 0xf00) === colorCode)) {
        actions = actions.concat(getPossibleMoves(pieceCode, this.getCoordinates(i), this));
      }
    }

    return actions.concat(getDrops(this, isBlacksTurn));
  }

  move_piece(action : ActionDef) : void {
    const newBoard = this.copy();
    const currPos = action.currPos;
    let pieceCode : number = newBoard.getPiece(currPos);

    // Handle piece capture
    if (action.capture) {
      const capturedPiece : number = newBoard.getPiece(action.movePos);
      // Set the piece on the opposite player's piece stand
      const newPieceColor = newBoard.pieceIsBlack(capturedPiece) ?
        'white' : 'black';
      newBoard.pieceStands[newPieceColor].push(newBoard.getPieceType(capturedPiece));
    }

    // Handle promotion option
    if (action.promote) {
      pieceCode |= 0x10;
    }

    // Clear the space
    newBoard.set_piece(currPos, 0);

    // Move the moving piece
    newBoard.set_piece(action.movePos, pieceCode);

    return newBoard;
  }

  drop_piece(action : ActionDef) : void {
    const newBoard = this.copy();
    // Action may come from player or from the engine
    // player piece types will be string encoded, 
    // while those from the engine will be integers
    let pieceType : number; 
    if (typeof action.pieceType === 'string') {
      pieceType = pieceCodes[action.pieceType];
    } else {
      pieceType = action.pieceType;
    }
    
    // Encode the color
    const pieceCode : number = action.pieceColor === 'black' ? 
      pieceType : pieceType + 0x100;
    // Drop the piece
    newBoard.set_piece(action.movePos, pieceCode);

    const remove = (array, element) => {
      const index = array.indexOf(element);
      if (index < 0) throw TypeError;
      array.splice(index, 1);
    }
    // Remove the piece from the piecestand
    remove(newBoard.pieceStands[action.pieceColor], pieceType);

    return newBoard;
  }

  print() : void {
    for (let i = 0; i < 9; i++) {
      const rank = []
      for (let j = 0; j < 9; j++) {
        rank.push(this.getPiece([i, j]).toString(16));
      }
      console.log(rank);
    }
  }

  copy() {
    return new EngineBoard(
      [...this.board], 
      {
        black: [...this.pieceStands.black], 
        white: [...this.pieceStands.white]
      }
    );
  }
}

// Tranform the front-end object-filled board into an array of integers
// and keep track of the positions of engine's pieces.
// Board is a single array so that deep-copying isn't an issue.
export default function encodeBoard(board : object, engineIsBlack : boolean) {
  const encodedBoard = [];
  const pieceStands = {
    black: [],
    white: []
  }

  // Set up board
  for (let row of board.board) {
    for (let piece of row) {
      if (piece === emptySquare) {
        encodedBoard.push(emptySquareCode);
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
        
        pieceStands[pieceColor].push(pieceCode);
      }
    }
  }
  
  return new EngineBoard(encodedBoard, pieceStands);
}