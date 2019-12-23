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
    if(this.isPlayersTurn && action) {
      this.do_action(action);
      if (!this.promoOptionActive) {
        this.isPlayersTurn = false;
      } else {
      }
    } else {
      if (!actionRefs) throw TypeError;
      const engineChoice = this.engine.calculate(possibleActions);
      if (engineChoice.drop) {
        this.do_action(() => actionRefs.drop(engineChoice));
      } else {
        this.do_action(() => actionRefs.move(engineChoice));
      }
      if (engineChoice.promote) {
        this.do_action(actionRefs.promotePiece(true));
      }
      this.isPlayersTurn = true;
    }
  }
}

export {GameVAI, ReviewMode};