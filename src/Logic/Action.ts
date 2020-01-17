import { ActionDef } from "../Definitions";

export default class Action implements ActionDef {
  constructor(parameters : object) {
    Object.assign(this, parameters);
  }
}
