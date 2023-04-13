import "./ChatPreview.css";

import React from "react";
import { currentChatProvider, userProvider, chatsHistoryProvider } from "../../App";
import { formatTimestamp } from "../../functions/Functions";
import MessageStatus from "../../left-panel/left-panel-chat/MessageStatus";

export default function ChatPreview({ chat }) {
  const { setCurrentChat, currentChat } = React.useContext(currentChatProvider);
  const { setChatsHistoryFilter, setNewChats, updateChatsHistory } = React.useContext(chatsHistoryProvider);
  const { user } = React.useContext(userProvider);
  if (!chat) return <></>;
  return (
    <div
      className={currentChat && currentChat.chatid == chat.chatid ? "chat-preview chat-preview-selected" : "chat-preview"}
      onClick={() => {
        if (chat.chatid != currentChat.chatid) {
          setCurrentChat(chat);
          setChatsHistoryFilter(false);
          setNewChats([]);
          document.getElementById("right-panel-search-input-text").innerHTML = "";
          if (chat.from != user._id) updateChatsHistory({ ...chat, status: 3 });
        }
      }}
    >
      <div className="chat-preview-inner">
        <div className="chat-preview-top">
          <div className="chat-preview-time" style={{ fontWeight: chat.from != user._id && (!chat.status || chat.status < 3) ? 600 : undefined, color: chat.from != user._id && (!chat.status || chat.status < 3) ? "#1fa855" : undefined }}>
            {chat.timestamp ? formatTimestamp(chat.timestamp) : ""}
          </div>
          <div className="chat-preview-details-name" style={{ fontWeight: chat.from != user._id && (!chat.status || chat.status < 3) ? 600 : undefined, color: chat.from != user._id && (!chat.status || chat.status < 3) ? "#111b21" : undefined }}>
            {chat.to == user._id ? chat.fromusername : chat.tousername}
          </div>
        </div>
        <div className="chat-preview-bottom">
          <div style={{ display: "flex", gap: "2px" }}>
            <div style={{height: "20px"}}></div>
            <svg viewBox="0 0 19 20" height="20" width="20" x="0px" y="0px" className="chat-preview-options">
              <path fill="#8696a0" d="M3.8,6.7l5.7,5.7l5.7-5.7l1.6,1.6l-7.3,7.2L2.2,8.3L3.8,6.7z"></path>
            </svg>
            {chat.newMessages && chat.status != 3 && chat.from != user._id ? <div className="chat-preview-messages-count">{chat.newMessages}</div> : <></>}
          </div>
          <div className="chat-preview-details-message" style={{ fontWeight: chat.from != user._id && (!chat.status || chat.status < 3) ? 600 : undefined /*, color: chat.from != user._id && (!chat.status || chat.status < 3) ? "#000000" : undefined*/ }}>
            {chat.typing ? "...מקליד/ה" : chat.text}
            {chat.from == user._id ? <MessageStatus status={chat.status} /> : <></>}
          </div>
        </div>
      </div>
      <img src="./images/profileimg.jpg" alt="" className="chat-preview-img" />
    </div>
  );
}
