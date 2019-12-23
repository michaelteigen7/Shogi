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
    console.log("Checking for promotion option");
    if (choice.promote) {
      if (Math.random() < 0.5) choice.promote = false;
      else console.log("Choosing to promote"); 
    }
    return choice;
  }
}
