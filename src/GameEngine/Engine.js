export default class Engine {
  constructor() {
    // Useless now as a singlethreaded application
    this.isThinking = false;
  }
  
  // This will cause the whole application to freeze while it works
  calculate(choices) {
    const choice =  choices[Math.floor(Math.random() * (choices.length - 1))];
    console.log("Got engine choice:")
    console.log(choice);
    return choice;
  }
}
