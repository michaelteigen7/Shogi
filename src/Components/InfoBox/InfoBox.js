import React from "react";
import DebugBox from "./DebugBox";
import PromotionOptionBox from "./PromoOption";
import HistoryNavigator from "./HistoryNavigator";

export default function InfoBox(props) {
  return (
    <div 
      id="info-box"
    >
      { props.color === 'black' ?
        (<PromotionOptionBox 
          promotionOption={props.state.promotionOption.value}
          setpromotionOption={props.state.promotionOption.set}
          promotePiece={props.actions.promotePiece}
        />)
        : null
      }
      <HistoryNavigator 
        color={props.color}
        board={props.board}
        history={props.state.mode.value.history}
      />
      <DebugBox color={props.color} board={props.board}/>
    </div>
  );
}
