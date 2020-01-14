class PieceValues {
  constructor() {
    // As suggested by Tanigawa
    this.pieceValues = {
      0x1: 1, // Pawn
      0x2 : 5, // Lance
      0x3: 6, // Knight
      0x4: 8, // Silver
      0x5: 9, // Gold
      0x6: 13, // Bishop
      0x7: 15, // Rook
      0x8: 0xfffffff, // King is one nibble less than max safe int
      0x11: 12, // Promoted pawn
      0x12: 10, // promoted lance
      0x13: 10, // promoted knight
      0x14: 9, // promoted silver
      0x16: 15, // horse
      0x17: 17 // dragon
    }

    // It's better if the rook and bishop are mobile, so moves that make them
    // mobile will be rewarded
    this.rangedExtras = {
      0x6: 13,
      0x7: 15,
      0x16: 15,
      0x17: 17
    } 
    this.movementMultiplier = .01
  }

  getPieceValue = (pieceType : number[], isPromoted : boolean) => {
    let pieceValue = isPromoted ?
      this.promotedPieceValues[pieceType] :
      this.pieceValues[pieceType];
    return (pieceType in this.rangedExtras) ? (pieceValue * 
      (1 + this.movementMultiplier)) : pieceValue;
  }
}

const pieceValues = new PieceValues();

export default pieceValues