import React from "react";
import StorageBox from "./StorageBox";

// Debugging controls
export default function DebugBox(props) {
  const ClearConsole = () => (
    <button onClick={() => console.clear()}>Clear console</button>
  );
  return props.color === "white" ? (
    <div>
      <StorageBox board={props.board}/>
      <ClearConsole />
    </div>
  ) : null;
};