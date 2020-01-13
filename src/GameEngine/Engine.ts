import encodeBoard from "./EngineBoard";
import {ActionDef} from "../Definitions";

// This will cause the whole application to freeze while it works
export default class Engine {
  constructor(playerIsBlack : boolean) {
    console.log('Constructing engine');
    this.color = !playerIsBlack
    console.log(`Engine is black: ${this.color}`);
    // Useless now as a single-threaded application
    // Need to implement web workers later
    this.isThinking = false;
  }

  calculateRandom(choices : ActionDef[]) {
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

  calculate(board) {
    const engineBoard = encodeBoard(board, this.color);

    console.log("Possible moves for white:");
    const choices = engineBoard.possibleActions(false);

    const engineMove = this.calculateRandom(choices);

    if (!engineMove.drop) {
      engineBoard.move_piece(engineMove);
    } else {
      engineBoard.drop_piece(engineMove);
    }

    console.log("Commited action to board");
    engineBoard.print();

    return engineMove
  }
}
