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
      0x8: 0, // King
      0x11: 12,
      0x12: 10,
      0x13: 10,
      0x14: 9,
      0x16: 15,
      0x17: 17
    }
    
    // Rook and bishop have more value if they are mobile.
    this.movementMultiplier = .01
  }

  getPieceValue = (pieceType, isPromoted) => {
    return isPromoted ?
      this.promotedPieceValues[pieceType] :
      this.pieceValues[pieceType]
  }
}

const pieceValues = new PieceValues();

export default pieceValues