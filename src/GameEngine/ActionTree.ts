import { ActionDef, EngineBoardDef } from "../Definitions";

interface ActionNodeDef {
  action: ActionDef,
  score: number
}

class ActionNode implements ActionDef {
  constructor(action, score) {
    this.action = action;
    this.score = score;
  }
}

export default class ActionTree {
  constructor(public engineIsBlack : boolean) {
    // How many moves ahead the should engine read
    this.readingDepth = 1;
    this.pruner = {
      active: false,
      threshold: 0
    }
    
    this.currentDepth = 0;
  }

  generateTree(boards : EngineBoardDef[], depth : number) {
    if (this.currentDepth < this.readingDepth) {

      const actionNodes = [];
      for (let board of boards) {
        for (let action of board.possibleActions()) {
          const newBoard = action.drop ? board.drop_piece(action) :
            board.move_piece(action);
          const score = newBoard.getScore(this.engineIsBlack);
          actionNodes.push(new ActionNode(action, score));
          this.generateTree(board, depth)
        }
      }
    }
  }

  generateBranch(board : EngineBoardDef) {
    this.currentDepth++;
    const actionNodes = [];
    for (let action of board.possibleActions()) {
      const newBoard = action.drop ? board.drop_piece(action) :
        board.move_piece(action);
      const score = newBoard.getScore(this.engineIsBlack);
      actionNodes.push(new ActionNode(action, score));
    }
    return actionNodes;
  }
}