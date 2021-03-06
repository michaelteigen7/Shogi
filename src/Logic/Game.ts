import { Pawn, Knight, Silver, Gold, King } from "./Pieces";
import { Bishop, Rook, Lance } from "./RangedPieces";
import {ActionDef, GameBoardDef} from "../Definitions";

const emptySquare = " ";
const constructorsFromString = {
  'Pawn' : Pawn,
  'Lance' : Lance,
  'Knight' : Knight,
  'Silver' : Silver,
  'Gold' : Gold,
  'Bishop' : Bishop,
  'Rook' : Rook,
  'King' : King
}

const pieceStandList = () => ({
  Pawn: [],
  Knight: [],
  Lance: [],
  Silver: [],
  Gold: [],
  Bishop: [],
  Rook: []
});

const emptyPieceStands = () => ({
  black: pieceStandList(),
  white: pieceStandList()
});

export function decodeBoard(engineBoard : number[], enginePieceStands: object) {
  const gameBoard = [];
  const pieceStands = emptyPieceStands();

  const constructorsFromInt = {
      0x1 : Pawn,
      0x2 : Lance,
      0x3 : Knight,
      0x4 : Silver,
      0x5 : Gold,
      0x6 : Bishop,
      0x7 : Rook,
      0x8 : King
    };

  const createPiece = (isBlack : boolean, isPromoted : boolean, 
    type : number | string) => {
    return typeof type === 'number' ?
      new constructorsFromInt[type](isBlack, isPromoted) :
      new constructorsFromString[type](isBlack, isPromoted);
  };

  // Build board
  let k = 0;
  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 9; j++) {
      const pieceCode = engineBoard[k];
      let piece;
      if (pieceCode === 0) {
        piece = emptySquare;
      }
      else {
        piece = createPiece(
          (pieceCode & 0xf00) !== 0x100, 
          (pieceCode & 0xf0) === 0x10, 
          pieceCode & 0xf
        );
      }
      row.push(piece);
      k++;
    }
    gameBoard.push(row);
  }

  // Build piece stands
  for (let color in enginePieceStands) {
    for (let pieceType in enginePieceStands[color]) {
      for (let pieces in enginePieceStands[color][pieceType]) {
        for (let i = 0; i < pieces; i++) {
          const piece = createPiece(color === 'black', false, pieceType);
          pieceStands[color][pieceType].push(piece);
        }
      }
    }
  }
  
  return [gameBoard, pieceStands];
}

const startBoard = decodeBoard([
    0x102, 0x103, 0x104, 0x105, 0x108, 0x105, 0x104, 0x103, 0x102,
    0x0, 0x107, 0x0, 0x0, 0x0, 0x0, 0x0, 0x106, 0x0,
    0x101, 0x101, 0x101, 0x101, 0x101, 0x101, 0x101, 0x101, 0x101,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0,
    0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1, 0x1,
    0x0, 0x6, 0x0, 0x0, 0x0, 0x0, 0x0, 0x7, 0x0,
    0x2, 0x3, 0x4, 0x5, 0x8, 0x5, 0x4, 0x3, 0x2
  ])[0];

export default class Board implements GameBoardDef {
  constructor(board : Array<Array<object>>, pieceStands = emptyPieceStands()) {
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
  }

  // For getting allowed piece drops
  getEmptySquareLocations() : Array<[number, number]> {
    const emptySquareLocations = [];
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (this.board[i][j] === emptySquare) {
          emptySquareLocations.push([i, j]);
        }
      }
    }
    return emptySquareLocations;
  }

  // Create a new board object that retains old references to pieces
  shallowCopy() {
    return new Board(this.board, this.pieceStands);
  }

  // Get a completely new, identical board object with new pieces
  copy(preservePieceTypes : boolean = false) {
    // copy board proper
    const newBoard = this.board.map(row => {
      return row.map(cell => {
        return (
          cell === emptySquare ? 
          emptySquare : cell.copy(preservePieceTypes)
        );
      })
    });
    
    // copy piece stands
    const stands = emptyPieceStands();
    for (let color in this.pieceStands) {
      for (let pieceType in this.pieceStands[color]) {
        stands[color][pieceType] = 
          this.pieceStands[color][pieceType].map(piece => piece.copy(preservePieceTypes));
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
  
  // ACTIONS
  // Each action should deepcopy the baord, mutate that copy
  // and return new board
  move_piece(action : ActionDef) {
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
      
      // Update piece properties post-capture
      capturedPiece.isBlack = !capturedPiece.isBlack;
      capturedPiece.position = [null, null];
      capturedPiece.isPromoted = false;

      // Place the piece on the capturing player's stand
      const color = capturedPiece.getColor();
      const type = capturedPiece.getPieceType();
      const pieceStands = newBoard.pieceStands;
      pieceStands[color][type].push(capturedPiece);
    }

    // Move piece to new position and update the piece's position property
    newBoard.board[iCurrent][jCurrent] = emptySquare;
    newBoard.board[iMove][jMove] = piece;
    piece.position = [iMove, jMove];

    return newBoard;
  };

  promote_piece(lastMove : ActionDef) {
    const i = lastMove.movePos[0];
    const j = lastMove.movePos[1];

    const newBoard = this.copy();
    newBoard.board[i][j].isPromoted = true;

    return newBoard;
  };

  drop_piece(action : ActionDef) { 
  // Get target square board coordinates
  const i = action.movePos[0];
  const j = action.movePos[1];
  const newBoard = this.copy();
  
  // The array of the player's piecestand for a particular kind of piece
  const pieceType = newBoard.pieceStands[action.pieceColor][action.pieceType];

  // Place the piece on the new board
  newBoard.board[i][j] = pieceType[0];
  // Update piece position
  newBoard.board[i][j].position = [i, j];
  // Remove a piece of the selected piece type off the piecestand
  pieceType.shift();
  
  return newBoard;
};
}

function unhashBoard(hashedBoard : string) {
  // First 81 triplets are board pieces
  const boardStr = hashedBoard.substring(0, 243).split("");

  const board = [];
  let k = 0;
  for (let i = 0; i < 81; i++) {
    let pieceStr : string = "";
    for (let j = 0; j < 3; i++) {
      pieceStr = boardStr[k];
    }
    const pieceCode = parseInt(pieceStr, 16);
    board.push(pieceCode);
  }

  // The rest are on piece stands
  const pieceStands = JSON.parse(hashedBoard.substring(243));
  return new Board([...decodeBoard(board, pieceStands)])
}

function parseJSON(JSONboard) {
  const parsePiece = piece => {
    const constructor = constructorsFromString[piece.pieceType];
    const newPiece = new constructor(piece.isBlack, piece.isPromoted);
    Object.assign(newPiece, piece);
    return newPiece;
  }

  for (let row in JSONboard.board) {
    for (let piece in JSONboard.board[row]) {
      if (JSONboard.board[row][piece] !== emptySquare) {
        JSONboard.board[row][piece] = parsePiece(JSONboard.board[row][piece]);
      }
    }
  }

  for (let color in JSONboard.pieceStands) {
    for (let pieceType in JSONboard.pieceStands[color]) {
      for (let piece in JSONboard.pieceStands[color][pieceType]) {
        JSONboard.pieceStands[color][pieceType][piece] = 
          parsePiece(JSONboard.pieceStands[color][pieceType][piece]);
      }
    }
  }
}

export { emptySquare, startBoard, unhashBoard, parseJSON };
