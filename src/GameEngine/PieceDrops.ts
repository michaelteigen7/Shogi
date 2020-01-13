import Action from "../Logic/Action";
import { ActionDef } from "../Definitions";

// Check if there is a pawn in the same file as to be dropped
function twoPawnsFilter(dropArr : number[], board : object) : number[] {
  const pawnInFile = {};
  // iterate over each column and determine whether it already has a pawn
  for (let y = 0; y < 9; y++) {
    for (let x = 0; x < 9; x++) {
      if (board.getPieceType(board.getPiece([x, y])) === 1) {
        pawnInFile[y] = true;
        break;
      }
    }
  }
  // Determine the file each pawn may be dropped in and filter it out
  // if there is a pawn in that file
  return dropArr.filter(index => !pawnInFile[parseInt(index / 8, 10)])
}

export default function getDrops(board : object, dropIsBlack : boolean) : ActionDef[] {
  const dropColor = dropIsBlack ? 'black' : 'white';
  // Get a set of piece types from the piece stand
  // Only one piece of any type can be dropped per turn
  // All piece codes should be stripped down to piece types (e.g. 0x1 - 0x8)
  const pieceTypes = [...new Set(board.pieceStands[dropColor])];

  const pawnDropIndices = [];
  const drops : ActionDef[] = [];
  
  for (let pieceCode of pieceTypes) {
    for (let i = 0; i < board.board.length; i++) {
      // Check if a square is empty
      if (board.board[0] === 0) {
        // check if piece is a pawn
        if (pieceCode === 1) {
          pawnDropIndices.push(i);
        } else {
          // create an action if it's not
          drops.push(new Action([null, null], board.getCoordinates(i), false, 
            true, false, pieceCode, dropColor));
        }
      }
    }
  }
  // Check for two pawns in a file rule
  const pawnDrops = twoPawnsFilter(pawnDropIndices, board).map(index => {
    return new Action([null, null], board.getCoordinates(index), false, 
      true, false, 0x1, dropColor)
  });

  return drops.concat(pawnDrops);
}