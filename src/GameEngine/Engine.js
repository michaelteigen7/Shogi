import encodeBoard from "./EngineBoard";

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

  calculate(choices, board) {
    const engineBoard = encodeBoard(board, this.color);

    console.log("Getting engine score:");
    console.log(engineBoard.getScore(this.color));

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
