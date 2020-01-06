import PieceValues from "./PieceValues";
import { emptySquare } from "../Logic/Game";
import { encodeBoard, EngineBoard } from "./EngineBoard";

// This will cause the whole application to freeze while it works
export default class Engine {
  constructor(playerIsBlack) {
    console.log('Constructing engine');
    this.color = !playerIsBlack
    console.log(`Engine is black: ${this.color}`);
    // Useless now as a single-threaded application
    // Need to implement web workers later
    this.isThinking = false;
  }

  calculateRandom(choices) {
    const choice =  choices[Math.floor(Math.random() * (choices.length - 1))];
    console.log("Got engine choice:");
    console.log(choice);
    console.log("Checking for promotion option");
    if (choice.promote) {
      if (Math.random() < 0.5) choice.promote = false;
      else console.log("Choosing to promote");
    }
    return choice;
  }

  // Iterate over the board and sum piece values
  getScore(board, engineIsBlack) {
    let engineScore = 0;
    for (let row of board.board) {
      for (let piece of row) {
        if (piece === emptySquare) continue;
        // Map the piece to a value
        const pieceValue = PieceValues.getPieceValue(piece.getPieceType(), 
          piece.isPromoted);
        // Change the score by the piece value and ownership
        engineScore = engineIsBlack === piece.isBlack ?
          engineScore + pieceValue :
          engineScore - pieceValue;
      }
    }
    return engineScore;
  }

  calculate(choices, board) {
    console.log("Getting engine score:");
    console.log(this.getScore(board, this.color));

    console.log("Encoding board");
    const encodedBoard = encodeBoard(board, this.color);
    console.log(encodedBoard);

    return this.calculateRandom(choices);
  }
}
