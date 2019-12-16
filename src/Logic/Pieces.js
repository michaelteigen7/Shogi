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
    this.isOnBoard = true;
    this.isRanged = false;
    this.possibleMoveIndices = [];
  }

  toString() {
    return !this.isPromoted ? this.strRep : this.promoStrRep;
  }

  getPieceType() {
    return this.constructor.name;
  }

  // To get possible moves. Will be overwritten in inheiritance
  /*
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
    console.log(`Checking if ${move} is in bounds...`);
    console.log(
      `${move} is in bounds: ${conditions.every(condition => condition)}`
    );

    return conditions.every(condition => condition);
  }

  friendlyPieceCheck(board, move) {
    const moveSqr = board[move[0]][move[1]];

    console.log(`Checking friendly piece collision for ${move}...`);
    console.log("Piece at move:");
    console.log(moveSqr);
    console.log(`Move is empty square: ${moveSqr === emptySquare}`);
    // The next condition will still log as true if the square is empty.
    // This dones't affect the logic
    console.log(`Move is enemy piece: ${moveSqr.isBlack !== this.isBlack}`);
    console.log(
      `Friendly fire: ${!(
        moveSqr === emptySquare || moveSqr.isBlack !== this.isBlack
      )}`
    );

    return moveSqr === emptySquare || moveSqr.isBlack !== this.isBlack;
  }

  promotedPossibleMoves() {
    return this.isBlack
      ? getBlackOffsets(this.position, goldIndices)
      : getWhiteOffsets(this.position, goldIndices);
  }

  moveCanPromote(move) {
    return !this.isPromoted && (this.isBlack ? move[0] < 3 : move[0] > 5);
  }

  // Need to implement dropping options
  getPossibleActions(board) {
    // Get moves solely based on piece movement rules
    console.log("Checking if piece is on piece stand");
    if (this.position[0] === null) {
      console.log("Piece is on piece stand. Returning empty action array.");
      return [];
    }
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
    console.log("Getting moves...");
    console.log(`Got possible moves: ${totalMoves}`);

    // Create actions from move arrays
    const actions = [];
    totalMoves.forEach(move => {
      console.log("\n");
      console.log(`Checking move ${move}`);
      // Filter out of bounds moves
      if (this.isMoveInBounds(move) && this.friendlyPieceCheck(board, move)) {
        console.log("Checking if move is a capture move...");
        const captureMove = board[move[0]][move[1]] !== emptySquare;
        console.log(`Move is a capture move: ${captureMove}`);

        // Include regular move
        const action = new Action(this.position, move, captureMove);

        // Include promotion option?
        console.log("Checking for promotion option...");
        if (this.moveCanPromote(move)) {
          console.log(`${move} is a promotion move. Setting promote option`);
          action.promote = true;
        }
        console.log(`Adding ${move} to good moves`);
        actions.push(action);
      } else console.log("Move not added to list");
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
