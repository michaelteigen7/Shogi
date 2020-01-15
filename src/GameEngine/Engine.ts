import encodeBoard from "./EngineBoard";
import {ActionDef} from "../Definitions";

// This will cause the whole application to freeze while it works
export default class Engine {
  constructor(playerIsBlack : boolean) {
    console.log('Constructing engine');
    this.engineIsBlack = !playerIsBlack
    console.log(`Engine is black: ${this.engineIsBlack}`);
    // Useless now as a single-threaded application
    // Need to implement web workers later
    this.isThinking = false;
  }

  calculateRandom(choices : ActionDef[]) {
    const choice =  choices[Math.floor(Math.random() * (choices.length - 1))];
    if (choice.promote) {
      if (Math.random() < 0.5) choice.promote = false;
    }
    return choice;
  }

  calculate(board) {
    let engineBoard = encodeBoard(board, this.engineIsBlack);

    console.log("Possible moves for white:");
    const choices = engineBoard.possibleActions(false);

    const engineMove = this.calculateRandom(choices);

    engineBoard = engineMove.drop ? engineBoard.drop_piece(engineMove) :
      engineBoard.move_piece(engineMove);

    engineBoard.print();
    console.log(`Engine score: ${engineBoard.getScore(this.engineIsBlack)}`);

    return engineMove;
  }
}
