import RightPanelTop from "./right-panel-top/RightPanelTop";
import RightPanelSearch from "./right-panel-top/RightPanelSearch";
import ChatPreview from "./right-panel-chats/ChatPreview";
import "./RightPanel.css";

import React from "react";

import { chatsHistoryProvider, currentChatProvider, widthProvider } from "../App";
import { breakWidth } from "../env";

export default function RightPanel() {
  const { chatsHistory, chatsHistoryFilter, newChats } = React.useContext(chatsHistoryProvider);
  const { currentChat } = React.useContext(currentChatProvider);
  const { width } = React.useContext(widthProvider);

  React.useEffect(() => {
    if (chatsHistoryFilter) {
      let result = [];
      for (let i of chatsHistory) {
        if (!chatsHistoryFilter.includes(i.chatid)) {
          result.push();
        }
      }
    }
  }, [chatsHistoryFilter]);
  return (
    <div id="right-panel" style={{ width: width < breakWidth ? "100%" : undefined, display: width < breakWidth && currentChat ? "none" : undefined }}>
      <RightPanelTop />
      <RightPanelSearch />
      <div id="chats">
        {chatsHistoryFilter ? <div className="search-divider">צ'אטים</div> : <></>}
        {chatsHistory
          .sort((b, a) => a.timestamp - b.timestamp)
          .map((chat, idx) => (chatsHistoryFilter ? chatsHistoryFilter.includes(chat.chatid) ? <ChatPreview key={idx} chat={chat} /> : <React.Fragment key={idx} /> : <ChatPreview key={idx} chat={chat} />))}
        {chatsHistoryFilter && newChats.length > 0 ? <div className="search-divider">אנשי קשר</div> : <></>}
        {newChats.map((chat, idx) => (
          <ChatPreview key={idx} chat={chat} />
        ))}
      </div>
    </div>
  );
}
