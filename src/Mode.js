import Engine from "./GameEngine/Engine";

class Mode {
  constructor() {
    this.gameInProgress = false;
    this.isPlayersTurn = true;
    this.promoOptionActive = false;
    this.HistoryModeEnabled = false;
    this.gameInProgress = false;
    this.history = {};
  }

  // Need to get this to write to history
  do_action(action) {
    console.log("Entered do action function");
    action();
  }
}

class ReviewMode extends Mode {
  constructor() {
    super();
    this.HistoryModeEnabled = true;
  }

  take_turn(action) {
    this.do_action(action);
  }
}

class GameMode extends Mode {
  start_game() {
    this.gameInProgress = true;
    console.log("Game started!");
    console.log(`Player's turn: ${this.isPlayersTurn}`);
  }

  checkWinCondition(board) {
    return false
  }
}

class GameVAI extends GameMode {
  constructor() {
    super();
    this.engine = new Engine();
  }

  take_turn(action, possibleActions, actionRefs) {
    console.log("Entered action taking function".toUpperCase());
    if(this.isPlayersTurn && action) {
      this.do_action(action);
      console.log("Executed player action");
      if (!this.promoOptionActive) {
        console.log("Flipping move token to false");
        this.isPlayersTurn = false;
      } else {
        console.log("Allowing for promotion");
      }
    } else {
      console.log("Engine will take an action:");
      console.log(action);
      if (!actionRefs) throw TypeError;
      const engineChoice = this.engine.calculate(possibleActions);
      if (engineChoice.drop) {
        console.log("Dropping piece");
        this.do_action(() => actionRefs.drop(engineChoice));
      } else {
        console.log("Moving piece");
        this.do_action(() => actionRefs.move(engineChoice));
      }
      console.log("Executed engine action");
      this.isPlayersTurn = true;
    }
  }
}

export {GameVAI, ReviewMode};