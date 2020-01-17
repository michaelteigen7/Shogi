import Action from "./Action";
import { getBlackOffsets, getWhiteOffsets } from "./MoveOffsets";
import { emptySquare } from "./Game";
import { PieceDef, ActionsDef } from "../Definitions"

const goldIndices = [0, 1, 2, 3, 5, 7];

class Piece implements PieceDef {
  constructor(public strRep : string, public promoStrRep : string, 
    public isBlack : boolean, isPromoted = false) {
      this.position = [null, null];
      this.isPromoted = isPromoted;
      this.isRanged = false;
      this.possibleMoveIndices = [];
  }

  copy(preserveType : boolean) {
    const newPiece = new this.constructor(this.isBlack);
    newPiece.position = [this.position[0], this.position[1]];
    newPiece.isPromoted = this.isPromoted;
    newPiece.isRanged = this.isRanged;
    if (preserveType) newPiece.pieceType = newPiece.getPieceType();

    // This array value need not be deep-copied as it is final
    newPiece.possibleMoveIndices = this.possibleMoveIndices;
    return newPiece;
  }

  toString() {
    return !this.isPromoted ? this.strRep : this.promoStrRep;
  }

  getColor() {
    return this.isBlack ? 'black' : 'white';
  }

  getPieceType() {
    return this.constructor.name;
  }

  // To get possible moves. Will be overwritten in inheiritance
  /*
  indices around piece at blank position:
  -------
  |0|1|2|
  |7| |3|
  |6|5|4|
  -------
  */
  possibleMoves() {
    return this.isBlack
      ? getBlackOffsets(this.position, this.possibleMoveIndices)
      : getWhiteOffsets(this.position, this.possibleMoveIndices);
  }

  isMoveInBounds(move: number[]) {
    const conditions = [move[0] >= 0, move[0] <= 8, move[1] >= 0, move[1] <= 8];

    return conditions.every(condition => condition);
  }

  friendlyPieceCheck(board: Array<Array<number>>, move: number[]) {
    const moveSqr = board[move[0]][move[1]];
    return moveSqr === emptySquare || moveSqr.isBlack !== this.isBlack;
  }

  promotedPossibleMoves() {
    return this.isBlack
      ? getBlackOffsets(this.position, goldIndices)
      : getWhiteOffsets(this.position, goldIndices);
  }

  moveCanPromote(move: number[]) {
    if (this.isPromoted) return false;
    if (this.isBlack) {
      return ((this.position[0] !== null && this.position[0] < 3) || move[0] < 3);
    }
    else {
      return ((this.position[0] !== null && this.position[0] > 5) || move[0] > 5);
    }
  }

  getPossibleActions(board : object) : ActionsDef[] {
    // Get dropping options
    if (this.position[0] === null) {
      const emptySquares = board.getEmptySquareLocations();
      return emptySquares.map(cell => {
        return new Action({
          currPos: [null, null], 
          movePos: cell, 
          capture: false, 
          drop: true,
          actorIsPlayer: true
        });
      });
    }
    // Otherwsie, get moves solely based on piece movement rules
    // non-ranged pieces do not take the board argument, so it
    // will be ignored for those pieces
    const totalMoves = this.isPromoted ? 
      this.promotedPossibleMoves(board) : this.possibleMoves(board);
    // Create actions from move arrays
    return (
      totalMoves
      .filter(move => this.isMoveInBounds(move) && 
        this.friendlyPieceCheck(board, move))
      .map(move => new Action({
          currPos: this.position, 
          movePos: move, 
          capture: board[move[0]][move[1]] !== emptySquare, 
          drop: false,
          promote: this.moveCanPromote(move),
          actorIsPlayer: true
      }))
    )
  }
}

class Pawn extends Piece {
  constructor(isBlack : boolean, isPromoted = false) {
    super("歩", "と", isBlack, isPromoted);
    this.possibleMoveIndices = [1];
  }
}

class Knight extends Piece {
  constructor(isBlack: boolean, isPromoted = false) {
    super("桂", "今", isBlack, isPromoted);
    this.possibleMoveIndices = [8, 9];
  }
}

class Silver extends Piece {
  constructor(isBlack : boolean, isPromoted = false) {
    super("銀", "全", isBlack, isPromoted);
    this.possibleMoveIndices = [0, 1, 2, 6, 4];
  }
}

class Gold extends Piece {
  constructor(isBlack : boolean) {
    super("金", "", isBlack);
    this.possibleMoveIndices = goldIndices;
    delete this.isPromoted;
    delete this.promotedPossibleMoves;
  }

  toString() {
    return this.strRep;
  }
}

class King extends Piece {
  constructor(isBlack : boolean) {
    super("王", "", isBlack);
    this.whiteStrRep = "玉";
    this.possibleMoveIndices = [0, 1, 2, 3, 4, 5, 6, 7];
    delete this.isPromoted;
    delete this.promotedPossibleMoves;
  }

  toString() {
    return this.isBlack ? this.whiteStrRep : this.strRep;
  }

  possibleMoves() {
    return getBlackOffsets(this.position, this.possibleMoveIndices);
  }
}

export default Piece;
export { Pawn, Knight, Silver, Gold, King };
