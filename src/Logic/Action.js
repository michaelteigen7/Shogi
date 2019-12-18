class Action {
  constructor(
    currPos,
    movePos,
    capture = false,
    drop = false,
    pieceType = null,
    pieceColor = null
  ) {
    this.currPos = currPos;
    this.movePos = movePos;
    this.promote = false;
    this.drop = drop;
    this.capture = capture;
    this.pieceType = pieceType;
    this.pieceColor = pieceColor
  }
}

export default Action;
