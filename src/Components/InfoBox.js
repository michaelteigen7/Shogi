import React from "react";

export default function InfoBox(props) {
  const destroy_view = () => {
    props.setpromotionOption(false);
  };

  const handleClicks = promote => {
    if (promote) props.promotePiece();
    destroy_view();
  };

  const promotionOptionBox = option => {
    if (option) {
      return (
        <div id="promo-box">
          <h3 className="prompt">Do you want to promote?</h3>
          <div className="buttons-box">
            <button
              onClick={() => {
                console.log("Code execution");
                handleClicks(true);
              }}
            >
              Yes
            </button>
            <button onClick={() => handleClicks(false)}>No</button>
          </div>
        </div>
      );
    } else {
      return <div />;
    }
  };

  return <div id="info-box">{promotionOptionBox(props.promotionOption)}</div>;
}
