import Piece from "./Pieces";
import { getBlackOffsets } from "./MoveOffsets";
import { emptySquare } from "./Game";
// This set of pieces will all overwrite the possibleMoves method
// and loop over board squares in specific directions
// Ranged pieces possibleMove getters need to consider several moves
// in certain directions and need to stop at friendly fire or a piece capture
// Knight is not a ranged piece because it does not need to consider
// whether pieces are in the way of its jump

class Lance extends Piece {
  constructor(isBlack : boolean, isPromoted = false) {
    super("香", "仝", isBlack, isPromoted);
    this.isRanged = true;
  }

  // Go up (black) or down (white) until you hit a piece or edge
  possibleMoves(board : Array<Array<object>>) {
    const moves = [];
    const j = this.position[1];
    if (this.isBlack) {
      for (let i = this.position[0]-1; i > -1; i--) {
        moves.push([i, j]);
        if (board[i][j] !== emptySquare) break;
      }
    }
    else {
      for (let i = this.position[0]+1; i < 9; i++) {
        moves.push([i, j]);
        if (board[i][j] !== emptySquare) break;
      }
    }
    return moves;
  }
}

class Bishop extends Piece {
  constructor(isBlack: boolean, isPromoted = false) {
    super("角", "馬", isBlack, isPromoted);
    this.isRanged = true;
  }

  // Check each diagonal direction, and go until you hit
  // the edge of the board or a piece
  possibleMoves(board : object) {
    const moves = [];
    let i, j;
    const loop = (breakCondition, iterator) => {
      while (breakCondition(i, j)) {
        moves.push([i, j]);
        try {
          if (board[i][j] !== emptySquare) break;
        }
        catch (TypeError) {
          if (board.board[i][j] !== emptySquare) break;
        }
        iterator();
      }
    }

    // up right
    i = this.position[0] - 1;
    j = this.position[1] + 1;
    loop(() => i >= 0 && j <= 8, () => {
      i--; j++;
    });

    // up left
    i = this.position[0] - 1;
    j = this.position[1] - 1;
    loop(() => i >=0 && j >= 0, () => {
      i--; j--;
    });

    // down left
    i = this.position[0] + 1;
    j = this.position[1] - 1;
    loop(() => i <= 8 && j >= 0, () => {
      i++; j--;
    });

    // down right
    i = this.position[0] + 1;
    j = this.position[1] + 1;
    loop(() => i <= 8 && j <= 8, () => {
      i++; j++;
    });

    return moves;
  }

  promotedPossibleMoves(board : Array<Array<object>>) {
    return (
      this.possibleMoves(board)
      .concat(getBlackOffsets(this.position, [1,3,5,7]))
    );
  }
}

class Rook extends Piece {
  constructor(isBlack, isPromoted = false) {
    super("飛", "竜", isBlack, isPromoted);
    this.isRanged = true;
  }

    possibleMoves(board) {
      const moves = [];
      let i, j;
      const loop = (breakCondition, iterator) => {
        while (breakCondition()) {
          moves.push([i, j]);
          try {
            if (!(board[i][j] === emptySquare)) {
              break;
            }
          }
          catch (e) {
            if (!(board.baord[i][j] === emptySquare)) break;
          }
          iterator();
        }
      }

      // up
      i = this.position[0] - 1;
      j = this.position[1];
      loop(() => i > -1, () => {
        i--;
      });

      // down
      i = this.position[0] + 1;
      j = this.position[1];
      loop(() => i < 9, () => {
        i++;
      });

      // left
      i = this.position[0];
      j = this.position[1] - 1;
      loop(() => j > -1, () => {
        j--;
      });

      // right
      i = this.position[0];
      j = this.position[1] + 1;
      loop(() => j < 9, () => {
        j--;
      });

      return moves;
    }

  promotedPossibleMoves(board : Array<Array<object>>) {
    return (
      this.possibleMoves(board)
      .concat(getBlackOffsets(this.position, [0,2,4,6]))
    );
  }
}

export {Lance, Bishop, Rook}