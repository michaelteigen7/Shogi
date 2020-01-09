import { ActionDef } from "../Definitions";

class Action implements ActionDef {
  constructor(
    public currPos,
    public movePos,
    capture = false,
    drop = false,
    promote = false,
    pieceType = null,
    pieceColor = null
  ) {
    this.drop = drop;
    this.promote = promote;
    this.capture = capture;
    this.pieceType = pieceType;
    this.pieceColor = pieceColor
  }
}

export default Action;
