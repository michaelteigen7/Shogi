export interface ActionDef {
  currPos : Array<number, number>,
  movePos  : Array<number, number>,
  capture : boolean,
  drop : boolean,
  pieceType : string | null,
  pieceColor : string | null
};

export interface GameBoard {
  board : Array<Array<object>>,
  pieceStands : object
}
