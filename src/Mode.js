import Engine from "./GameEngine/Engine";
import HistoryTree from "./Logic/HistoryTree";

class Mode {
  constructor(board) {
    this.gameInProgress = false;
    this.isPlayersTurn = true;
    this.promoOptionActive = false;
    this.HistoryModeEnabled = false;
    this.gameInProgress = false;
    this.history = new HistoryTree(board);
  }

  // Need to get this to write to history
  do_action(action) {
    const newBoard = action();
    if (newBoard) {
      this.history.record_board(newBoard);
    }
  }
}

class ReviewMode extends Mode {
  constructor(board) {
    super(board);
    this.HistoryModeEnabled = true;
    this.isPlayersTurn = true;
  }

  take_turn(action) {
    this.do_action(action);
  }
}

class GameMode extends Mode {
  constructor(playerPlaysBlack, board) {
    super(board);
    this.playerIsBlack = playerPlaysBlack;
  }

  start_game() {
    this.gameInProgress = true;
    console.log("Game started!");
    if (!this.playerIsBlack) {
      this.isPlayersTurn = false;
    }
  }

  // Need to implement endgame logic later
  checkWinCondition(board) {
    return false;
  }
}

class GameVAI extends GameMode {
  constructor(playerIsBlack, board) {
    super(playerIsBlack, board);
    this.engine = new Engine(this.playerIsBlack);
  }

  take_turn(action, commands, board) {
    if (this.isPlayersTurn) {
      // Player's move
      if (action) this.do_action(action);
      this.isPlayersTurn = this.promoOptionActive;
    } else {
      // Engine's move
      const engineChoice = this.engine.calculate(board);
      if (engineChoice.drop) {
        this.do_action(() => commands.drop(engineChoice));
      } else {
        if (engineChoice.promote) {
          this.do_action(() => commands.promotePiece(engineChoice));
        } else {
          this.do_action(() => commands.move(engineChoice));
        }
      }
      this.isPlayersTurn = true;
    }
  }
}

export { GameVAI, ReviewMode };