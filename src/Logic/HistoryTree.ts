import encodeBoard from "../GameEngine/EngineBoard";
import Board, { decodeBoard } from "./Game";

// Encode baord proper as a set of 81 substrings of length three
// Piecestands are stringified objects
function hashBoard(board : object) : string {
  // First, encode the board in the engine format
  const encodedBoard = encodeBoard(board);
  
  // Encode board
  let boardStr = "";
  for (let piece of encodedBoard.board) {
      if (piece !== 0) {
        const color = ((piece & 0xf00) !== 0x100) ? "0" : "1";
        const promoted = ((piece & 0xf0) === 0x10) ? "1" : "0";
        const pieceType = (piece & 0xf).toString();
        boardStr += color + promoted + pieceType;
      } else {
        boardStr += "000";
      }
  }
  // Verify board integrity: 81 * 3 = 243
  if (boardStr.length !== 243) {
    console.error(`Invalid board not saved to history:\n${boardStr}`);
    throw TypeError;
  }

  // Strings should be less memory-heavy than objects
  return boardStr + JSON.stringify(encodedBoard.pieceStands);
}

class Node {
  constructor(board: object, public parentKey : number) {
    this.board = hashBoard(board);
    this.childKeys = [];
  }
}

export default class HistoryTree {
  constructor(board) {
    this.tree = [];

    // Create a root node
    this.keyCount = 1;
    this.tree[this.keyCount] = new Node(board, 0);
    this.currentKey = this.keyCount;
  }

  existingBoard(board : string) {
    const childKeys = this.tree[this.currentKey].childKeys;
    for (let key of childKeys) {
      if (this.tree[key].board === board) return key;
    }
  }

  // Create a new encoded board and add it to the tree with a key of
  // the current key count. Add it's key to the parent's list of child keys.
  // Then set the current key to the new key.
  record_board(board : object) {
    // Check if board already exists in a child node
    const oldNodeKey = this.existingBoard(board);
    if (oldNodeKey) {
      this.currentKey = oldNodeKey;
      return;
    }

    const parentNodeKey : number = this.currentKey;
    const node = new Node(board, this.keyCount);
    this.keyCount++;
    this.tree[this.keyCount] = node;
    this.tree[parentNodeKey].childKeys.push(this.keyCount);
    this.currentKey = this.keyCount;
  }

  // return the board at the first child key
  next() {
    const nextNodeKey = this.tree[this.currentKey].childKeys[0];
    if (!nextNodeKey) {
      return false;
    } else {
      this.currentKey = nextNodeKey;
      return this.unhashBoard(this.tree[nextNodeKey].board);
    }
  }

  // return the board at the parent key
  previous() {
    const prevNodeKey = this.tree[this.currentKey].parentKey;
    if (!prevNodeKey) {
      return false;
    } else {
      this.currentKey = prevNodeKey;
      return this.unhashBoard(this.tree[prevNodeKey].board);
    }
  }

  unhashBoard(hashedBoard) {
    const encodedBoard = [];
    const boardStr = hashedBoard.substring(0, 243).split("");
    let i = 0;
    for (let j = 0; j < 81; j++) {
      let pieceStr = "";
      for (let k = 0; k < 3; k++) {
        pieceStr += boardStr[i];
        i++;
      }
      encodedBoard.push(parseInt(pieceStr, 16));
    }

    const pieceStands = JSON.parse(hashedBoard.substring(243));
    return new Board(...decodeBoard(encodedBoard, pieceStands));
  }
}