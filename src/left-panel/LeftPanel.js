import Chat from "./left-panel-chat/Chat";
import "./LeftPanel.css";

import React from "react";
import { currentChatProvider, widthProvider } from "../App";
import { breakWidth } from "../env";

export default function LeftPanel() {
  const { currentChat } = React.useContext(currentChatProvider);
  const { width } = React.useContext(widthProvider);

  return (
    <div id="left-panel" style={{ display: width < breakWidth && !currentChat ? "none" : undefined }}>
      {currentChat ? <Chat /> : <div id="left-panel-bottom"></div>}
    </div>
  );
}
