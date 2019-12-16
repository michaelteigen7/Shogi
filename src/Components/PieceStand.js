import React from "react";
import "./Components.scss";

export default function PieceStand(props) {
  const pieces = props.pieceStand;
  const highlightedType = props.selected ? props.selected.getPieceType() : null;

  // NEED TO HANDLE PIECE SELECTION AND HIGHLIGHTING
  const handleClick = key => {
    console.log("Stand piece clicked");
    console.log("Checking if promotion option is active");
    if (props.promotionOption) {
      console.log("Promotion option is active");
      return;
    }
    console.log("Promotion option is not active");
    console.log("Key:");
    console.log(key);
    if (props.selected) {
      props.select(null);
    } else props.select(key);
    props.clearHighlights();
  };

  const standPiece = (strRep, pieceCount, key) => {
    const style =
      key === highlightedType
        ? { opacity: "0.3", cursor: "pointer" }
        : { cursor: "pointer" };

    return (
      <div className="droppable-piece" key={key}>
        <h3
          style={style}
          onClick={() => handleClick(pieces[key][0])}
          className="piece-text"
        >
          {strRep}
        </h3>
        <h3 className="pieceCount">{pieceCount}</h3>
      </div>
    );
  };

  const standPieces = [];

  for (let key in pieces) {
    const pieceCount = pieces[key].length;
    if (pieceCount > 0) {
      standPieces.push(standPiece(pieces[key][0].strRep, pieceCount, key));
    }
  }

  return <div className="piece-stand">{standPieces}</div>;
}
