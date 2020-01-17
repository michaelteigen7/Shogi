export interface ActionDef {
  currPos : [number, number],
  movePos  : [number, number],
  capture : boolean,
  drop : boolean,
  promote : boolean | undefined,
  pieceType : string | number | undefined,
  pieceColor : string | undefined,
  actorIsPlayer : boolean |undefined
};

export interface GameBoardDef {
  board : Array<Array<object>>,
  pieceStands : object
}

export interface EngineBoardDef {
  board : number[],
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
