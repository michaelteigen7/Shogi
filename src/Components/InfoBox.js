import React from "react";

export default function InfoBox(props) {
  const destroy_view = () => {
    props.setpromotionOption(false);
  };

  const handleClicks = promote => {
    props.promotePiece(promote);
    destroy_view();
  };

  const debugWindow = () => {
    return props.color === "white" ? (
      <button onClick={() => console.clear()}>Clear console</button>
    ) : null;
  };

  const next = () => {
    const newBoard = props.history.next();
  }

  const historyNavigator = () => {
    const setBoardFromHistory = board => {
      if (board) props.setBoard(board);
    }

    return props.color === "white" ? 
      (
        <div id="move-navigator">
          <button
            onClick={ () => setBoardFromHistory(props.history.previous()) }
          >Previous</button>
          <button
            onClick={ () => setBoardFromHistory(props.history.next()) }
          >Next</button>
        </div>
      ) 
      : null;
    };

  const promotionOptionBox = () => {
      return props.promotionOption ? 
      (
        <div id="promo-box">
          <h3 className="prompt">Do you want to promote?</h3>
          <div className="buttons-box">
            <button
              onClick={() => handleClicks(true)}
            >
              Yes
            </button>
            <button onClick={() => handleClicks(false)}>No</button>
          </div>
        </div>
      )
      : null;
  };

  return (
    <div 
      id="info-box"
    >
      {promotionOptionBox()}
      {historyNavigator()}
      {debugWindow()}
    </div>
  );
}
