export interface ActionDef {
  currPos : [number, number],
  movePos  : [number, number],
  capture : boolean,
  drop : boolean,
  pieceType : string | null,
  pieceColor : string | null
};

export interface GameBoard {
  board : Array<Array<object>>,
  pieceStands : object
}

export interface PieceDef {
  position: [number, number] | null[],
  strRep: string,
  promoStrRep: string,
  isPromoted: boolean,
  isBlack: boolean,
  isRanged: false,
  possibleMoveIndices: number[],
}
