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

    const choices = engineBoard.possibleActions(this.engineIsBlack);
    console.log("Got engine choices:")
    console.log(choices)

    const getLocalMaxiumum = actions => {
      // max of object
      const getMaxScore = localActions => {
        let maxScore = parseFloat(Object.keys(localActions)[0]);
        for (let scoreKey in localActions) {
          const score = parseFloat(scoreKey);
          if (parseFloat(score) > maxScore) maxScore = score;
        }
        return maxScore;
      }

      const localActions = {};
      for (let action of actions) {
        let localBoard = engineBoard.copy();
        localBoard = action.drop ? localBoard.drop_piece(action) :
          localBoard.move_piece(action);
        const score = localBoard.getScore(this.engineIsBlack);
        localActions[score] = [action, localBoard];      
      }
      const maxScore = getMaxScore(localActions);
      const bestAction = localActions[maxScore.toString()][0];
      return bestAction;
    }

    if (choices.length < 1) throw TypeError;
    const engineMove = getLocalMaxiumum(choices);

    engineBoard = engineMove.drop ? engineBoard.drop_piece(engineMove) :
      engineBoard.move_piece(engineMove);

    return engineMove;
  }
}
