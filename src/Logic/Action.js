class Action {
  constructor(
    currPos,
    movePos,
    capture = false,
    drop = false,
    pieceType = null,
    check = false
  ) {
    this.currPos = currPos;
    this.movePos = movePos;
    this.promote = false;
    this.drop = drop;
    this.capture = capture;
    this.check = check;
    this.pieceType = pieceType;
  }
}

export default Action;
