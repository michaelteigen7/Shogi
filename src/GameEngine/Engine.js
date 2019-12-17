class Engine {
  constructor() {
    this.isThinking = false;
  }

  makeChoice(choices, board) {
    const index = Math.floor(Math.random() * choices.length);
    return choices[index];
  }
}