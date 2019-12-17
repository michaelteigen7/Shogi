class Mode {
  constructor() {
    this.gameInProgress = false;
    this.isPlayersTurn = true;
    this.isPromoOptionActive = false;
    this.HistoryModeEnabled = false;
    this.gameInProgress = false;
    this.history = {};
  }

  // Need to get this to write to history
  do_action(action, board) {
    action();
  }
}

class ReviewMode extends Mode {
  constructor() {
    super();
    this.HistoryModeEnabled = true;
  }
}

class GameMode extends Mode {
  start_game() {
    this.gameInProgress = true;
  }

  checkWinCondition(board) {
    return false
  }
}

class GameVAI extends GameMode {
  constructor(isPlayersTurn) {
    super();
    this.isPlayersTurn = isPlayersTurn;
  }

  take_turn(action, possibleActions = null) {
    if(this.isPlayersTurn && action) {
      this.do_action(action);
    } else {
      action = this.getEngineAction(possibleActions);
      this.do_action(action);
    }
    this.isPlayersTurn = !this.isPlayersTurn;
  }

  getEngineAction(possibleActions) {
    return null;
  }
}

export {GameVAI, ReviewMode};