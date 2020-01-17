import getOffsets from "../Logic/MoveOffsets";
import Action from "../Logic/Action";
import { ActionDef } from "../Definitions";

function inBounds(movePos : [number, number]) : boolean {
  return (
      movePos[0] >= 0 && movePos[0] <= 8 &&
      movePos[1] >= 0 && movePos[1] <= 8
    )
}

function moveCanPromote(pieceCode : number, currPos : [number, number], 
movePos : [number, number], pieceIsBlack : boolean) : boolean {
  const alreadyPromoted = pieceCode => (pieceCode & 0xf0) === 0x10;
  const goldOrKing = pieceCode => {
    const pieceType = pieceCode & 0xf;
    return (pieceType === 0x5) || (pieceType === 0x8);
  }
  const promoZone = pos => pieceIsBlack ? pos[0] <= 2 : pos[0] >= 6;

  if (alreadyPromoted(pieceCode || goldOrKing(pieceCode))) return false;
  else return promoZone(currPos) || promoZone(movePos);
}

// Get possible actions, given move coordinates
function moveFilter(board : object, movePos: [number, number], 
currPos : [number, number]) : ActionDef | boolean {
  console.log("Entered moveFilter function")
  console.log(`Checking position ${movePos} for a good move`)
  if (!inBounds(movePos)) return false;
  console.log("Move is in bounds")


  const cappedPiece = board.getPiece(movePos);
  const piece = board.getPiece(currPos)
  const isPieceBlack = board.pieceIsBlack(piece);
  const action = new Action({
        currPos: currPos, 
        movePos: movePos, 
        capture: !(cappedPiece === 0), 
        drop: false, 
        promote: moveCanPromote(cappedPiece, currPos, movePos, isPieceBlack),
        actorIsPlayer: false
    });
  
  console.log("Created an action for the move:")
  console.log(action)
  if (!action.capture) return action;
  else {
    // Friendly fire check
    return isPieceBlack !== board.pieceIsBlack(cappedPiece) ?
      action : false;
  }
}

const getMoves = (indices, position, board) => {
  console.log("Entered getMoves function for non-ranged pieces")
  console.log(`Got indices ${indices} for piece at ${position}`)
  const actions = [];
  // Array.filter doesn't allow for implicit truthiness check
  const pieceIsBlack = board.pieceIsBlack(board.getPiece(position));
  console.log(`Piece is black?: ${pieceIsBlack}`)
  console.log("Entering getOffsets loop")
  for (let moveCoord of getOffsets(position, indices, pieceIsBlack)) {
    console.log(`Checking coordinate ${moveCoord}`)
    const action = moveFilter(board, moveCoord, position);
    console.log("Got action")
    console.log(action)
    if (action) actions.push(action);
  }
  console.log("Got actions:")
  console.log(actions)
  return actions;
}

function getRangedMoves(offsetLambdas, currPos : [number, number], 
board : object) : ActionDef[] {
  // Loop over the directives in each lamda function and create actions
  const actions = [];
  for (let lambda of offsetLambdas) {
    let position = [...currPos];
    let action = moveFilter(board, lambda(position), currPos);
    while (action) {
      actions.push(action);
      if (action.capture) break;
      action = moveFilter(board, lambda([...action.movePos]), currPos);
    }
  }
  return actions;
  }

// Pass position and board uniformly to avoid branching and reduce compexity
// Moves for promoted and unpromoted pieces are given in lambda functions
const moveFunctions = {
  // Non-ranged moves
  0x1: (position, board) => getMoves([1], position, board),
  0x3: (position, board) => getMoves([8,9], position, board),
  0x4: (position, board) => getMoves([0, 1, 2, 6, 4], position, board),
  0x5: (position, board) => getMoves([0, 1, 2, 3, 5, 7], position, board),
  0x8: (position, board) => getMoves([0, 1, 2, 3, 4, 5, 6, 7], position, board),
  
  // Ranged moves
  0x2: (position, board) => {
    const isPieceBlack = board.pieceIsBlack(board.getPiece(position));
    const lambdas = isPieceBlack ? [currPos => [currPos[0] - 1, currPos[1]]] :
      [currPos => [currPos[0] + 1, currPos[1]]];
    return getRangedMoves(lambdas, position, board);
  },
  0x6: (position, board) => {
    const lambdas = [
      currPos => [currPos[0] - 1, currPos[1] - 1],
      currPos => [currPos[0] + 1, currPos[1] + 1],
      currPos => [currPos[0] - 1, currPos[1] - 1],
      currPos => [currPos[0] - 1, currPos[1] - 1]
    ];
    return getRangedMoves(lambdas, position, board);
  },
  0x7: (position, board) => {
    const lambdas = [
      currPos => [currPos[0] - 1, currPos[1]],
      currPos => [currPos[0] + 1, currPos[1]],
      currPos => [currPos[0], currPos[1] - 1],
      currPos => [currPos[0], currPos[1] + 1]
    ];
    return getRangedMoves(lambdas, position, board);
  },

  // Promoted, non-ranged moves
  0x11: (position, board) => getMoves([0, 1, 2, 3, 5, 7], position, board),
  0x12: (position, board) => getMoves([0, 1, 2, 3, 5, 7], position, board),
  0x13: (position, board) => getMoves([0, 1, 2, 3, 5, 7], position, board),
  0x14: (position, board) => getMoves([0, 1, 2, 3, 5, 7], position, board),

  // Bishop and Rook
  0x16: (position, board) => {
    const lambdas = [
      currPos => [currPos[0] - 1, currPos[1] - 1],
      currPos => [currPos[0] + 1, currPos[1] + 1],
      currPos => [currPos[0] - 1, currPos[1] - 1],
      currPos => [currPos[0] - 1, currPos[1] - 1]
    ];
    const unpromoteActions = getRangedMoves(lambdas, position, board);
    const promoteActions = getMoves([1, 3, 5, 7], position, board);
    return unpromoteActions.concat(promoteActions);
  },
  0x17: (position, board) => {
    const lambdas = [
      currPos => [currPos[0] - 1, currPos[1]],
      currPos => [currPos[0] + 1, currPos[1]],
      currPos => [currPos[0], currPos[1] - 1],
      currPos => [currPos[0], currPos[1] + 1]
    ];
    const unpromoteActions = getRangedMoves(lambdas, position, board);
    const promoteActions = getMoves([0, 2, 4, 6], position, board);
    return unpromoteActions.concat(promoteActions);
  }
};

export default function getPossibleMoves(pieceCode: number, 
currPos : [number, number], board : object) : ActionDef[] {
  console.log(`Getting possible moves for piece code ${pieceCode.toString(16)}`)
  // pop off color code to map to a function
  const code = pieceCode & 0xff;
  console.log(`code key: ${code}`)
  return moveFunctions[code](currPos, board);
}
