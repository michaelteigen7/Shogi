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

  const historyNavigator = () => {
    return props.color === "white" ? 
      (
        <div id="move-navigator">
          <button>Previous</button>
          <button>Next</button>
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
