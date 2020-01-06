class PieceValues {
  constructor() {
    // As suggested by Tanigawa
    this.pieceValues = {
      'Pawn': 1,
      'Lance': 5,
      'Knight': 6,
      'Silver': 8,
      'Gold': 9,
      'Bishop': 13,
      'Rook': 15,
      'King': 0
    }

    this.promotedPieceValues = {
      'Pawn': 12,
      'Lance': 10,
      'Knight': 10,
      'Silver': 9,
      'Bishop': 15,
      'Rook': 17
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