import Piece from "./Pieces";
import {getBlackOffsets} from "./MoveOffsets";
import {emptySquare} from "./Game";
// This set of pieces will all overwrite the possibleMoves method
// and loop over board squares in specific directions

class Lance extends Piece {
  constructor(isBlack) {
    super("香", "仝", isBlack);
    this.isRanged = true;
  }

  // Go up (black) or down (white) until you hit a piece or edge
  possibleMoves(board) {
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

// I include the Knight piece here because its class overwrites the
// possible moves method, but I do not give it the ranged property,
// because it doesn't require the board to be passed its class
class Knight extends Piece {
  constructor(isBlack) {
    super("桂", "今", isBlack);
  }

  possibleMoves() {
    // Move Offsets only captures squares one space away
    const i = this.position[0];
    const j = this.position[1];
    if (this.isBlack) {
      return [
        [i-2, j-1],
        [i-2, j+1]
      ];
    } else {
        return [
          [i+2, j-1],
          [i+2, j+1]
        ];
    }
  }
}

class Bishop extends Piece {
  constructor(isBlack) {
    super("角", "馬", isBlack);
    this.isRanged = true;
  }

  // Check each diagonal direction, and go until you hit
  // the edge of the board or a piece
  possibleMoves(board) {
    const moves = [];
    let i, j;
    const loop = (breakCondition, iterator) => {
      while (breakCondition(i, j)) {
        moves.push([i, j]);
        try {
          if (board[i][j] !== emptySquare) break;
        }
        catch (TypeError) {
          if (board.baord[i][j] !== emptySquare) break;
        }
        iterator();
      }
    }

    // up right
    i = this.position[0] - 1;
    j = this.position[1] + 1;
    loop((i, j) => i >= 0 && j <= 8, () => {
      i--; j++;
    });

    // up left
    i = this.position[0] - 1;
    j = this.position[1] - 1;
    loop((i, j) => i >=0 && j >= 0, () => {
      i--; j--;
    });

    // down left
    i = this.position[0] + 1;
    j = this.position[1] - 1;
    loop((i, j) => i <= 8 && j >= 0, () => {
      i++; j--;
    });

    // down right
    i = this.position[0] + 1;
    j = this.position[1] + 1;
    loop((i, j) => i <= 8 && j <= 8, () => {
      i++; j++;
    });

    return moves;
  }

  promotedPossibleMoves(board) {
    return (
      this.possibleMoves(board)
      .concat(getBlackOffsets(this.position, [1,3,5,7]))
    );
  }
}

class Rook extends Piece {
  constructor(isBlack) {
    super("飛", "竜", isBlack);
    this.isRanged = true;
  }

    possibleMoves(board) {
    const moves = [];
    let i, j;
    const loop = (breakCondition, iterator) => {
      while (breakCondition()) {
        moves.push([i, j]);
        try {
          if (!(board[i][j] === emptySquare)) break;
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
    loop(i => i > -1, () => {
      i--;
    });

    // down
    i = this.position[0] + 1;
    j = this.position[1];
    loop(i => i < 9, () => {
      i++;
    });

    // left
    i = this.position[0];
    j = this.position[1] - 1;
    loop(j => j > -1, () => {
      j--;
    });

    // right
    i = this.position[0];
    j = this.position[1] + 1;
    loop(j => j < 9, () => {
      j--;
    });
  
    return moves;
  }

  promotedPossibleMoves(board) {
    return (
      this.possibleMoves(board)
      .concat(getBlackOffsets(this.position, [0,2,4,6]))
    );
  }
}

export {Lance, Knight, Bishop, Rook}