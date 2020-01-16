import React from "react";

export default function PromotionOptionBox(props) {
  const destroy_view = () => {
    props.setpromotionOption(false);
  };

  const handleClicks = promote => {
    props.promotePiece(promote);
    destroy_view();
  };

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