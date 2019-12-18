import Action from "./Action";
import { getBlackOffsets, getWhiteOffsets } from "./MoveOffsets";
import { emptySquare } from "./Game";

const goldIndices = [0, 1, 2, 3, 5, 7];

class Piece {
  constructor(strRep, promoStrRep, isBlack) {
    this.position = [null, null];
    this.strRep = strRep;
    this.promoStrRep = promoStrRep;
    this.isPromoted = false;
    this.isBlack = isBlack;
    this.isRanged = false;
    this.possibleMoveIndices = [];
  }

  copy() {
    const newPiece = new this.constructor(this.isBlack);
    newPiece.position = [this.position[0], this.position[1]];
    newPiece.isPromoted = this.isPromoted;
    newPiece.isRanged = this.isRanged;

    // This array value need not be deep-copied as it is final
    newPiece.possibleMoveIndices = this.possibleMoveIndices;
    return newPiece;
  }

  toString() {
    return !this.isPromoted ? this.strRep : this.promoStrRep;
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

  isMoveInBounds(move) {
    const conditions = [move[0] >= 0, move[0] <= 8, move[1] >= 0, move[1] <= 8];

    return conditions.every(condition => condition);
  }

  friendlyPieceCheck(board, move) {
    const moveSqr = board[move[0]][move[1]];
    return moveSqr === emptySquare || moveSqr.isBlack !== this.isBlack;
  }

  promotedPossibleMoves() {
    return this.isBlack
      ? getBlackOffsets(this.position, goldIndices)
      : getWhiteOffsets(this.position, goldIndices);
  }

  moveCanPromote(move) {
    if (this.isPromoted) return false;
    if (this.isBlack) {
      return ((this.position[0] !== null && this.position[0] < 3) || move[0] < 3);
    }
    else {
      return ((this.position[0] !== null && this.position[0] > 5) || move[0] > 5);
    }
    // return !this.isPromoted && (
    //   this.isBlack ? move[0] < 3 : move[0] > 5);
  }

  getPossibleActions(board) {
    // Get dropping options
    if (this.position[0] === null) {
      const emptySquares = board.getEmptySquareLocations();
      return emptySquares.map(cell => {
        const currPos = [null, null];
        const dropPos = cell;
        const capture = false;
        const drop = true;
        return new Action(currPos, dropPos, capture, drop);
      });
    }
    // Get moves solely based on piece movement rules
    let totalMoves = null;
    if (this.isPromoted) {
      totalMoves = this.isRanged
        ? this.promotedPossibleMoves(board)
        : this.promotedPossibleMoves();
    } else {
      totalMoves = this.isRanged
        ? this.possibleMoves(board)
        : this.possibleMoves();
    }
    // Create actions from move arrays
    const actions = [];
    totalMoves.forEach(move => {
      // Filter out of bounds moves
      if (this.isMoveInBounds(move) && this.friendlyPieceCheck(board, move)) {
        const captureMove = board[move[0]][move[1]] !== emptySquare;

        // Include regular move
        const action = new Action(this.position, move, captureMove);

        // Include promotion option?
        if (this.moveCanPromote(move)) {
          action.promote = true;
        }
        actions.push(action);
      }
    });
    return actions;
  }
}

class Pawn extends Piece {
  constructor(isBlack) {
    super("歩", "と", isBlack);
    this.possibleMoveIndices = [1];
  }
}

class Silver extends Piece {
  constructor(isBlack) {
    super("銀", "全", isBlack);
    this.possibleMoveIndices = [0, 1, 2, 6, 4];
  }
}

class Gold extends Piece {
  constructor(isBlack) {
    super("金", "", isBlack);
    this.possibleMoveIndices = goldIndices;
  }

  toString() {
    return this.strRep;
  }
}

class King extends Piece {
  constructor(isBlack) {
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
export { Pawn, Silver, Gold, King };
