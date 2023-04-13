import "./ChatTop.css";
import React from "react";

import { currentChatProvider, userProvider, widthProvider } from "../../App";
import { socket, send } from "../../server/WebSocket";
import { getLastSeen } from "../../server/Server";
import { breakWidth } from "../../env";

function formatTimestamp(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);

  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  const isYesterday = date.getDate() === now.getDate() - 1 && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `היום ב ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  } else if (isYesterday) {
    return `אתמול ב ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
  } else {
    const year = date.getFullYear().toString().substring(2);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${String(day).padStart(2, "0")}.${String(month).padStart(2, "0")}.${year} ${hour}:${String(minute).padStart(2, "0")}`;
  }
}

export default function ChatTop() {
  const { currentChat, setCurrentChat } = React.useContext(currentChatProvider);
  const { user } = React.useContext(userProvider);
  const [typing, setTyping] = React.useState(false);
  const [connected, setConnected] = React.useState(false);
  const [lastSeen, setLastSeen] = React.useState(false);
  const { width } = React.useContext(widthProvider);
  const [ready, setReady] = React.useState(false);

  const handleMessage = (e) => {
    let message = JSON.parse(e.data);
    if (message.typing == false) {
      setTyping(false);
    }
    if (message.typing == true) {
      setTyping(true);
    }
    if (message.connectionCheck) {
      setConnected(message.isConnected);
    }
    if (message.connectionUpdate) {
      let idchecktemp = user._id == currentChat.to ? currentChat.from : currentChat.to;
      if (message.userid == idchecktemp) {
        setConnected(message.connected);
        if (message.connected == false) {
          setLastSeen(Date.now());
        }
      }
    }
  };

  React.useEffect(() => {
    setConnected(false);
    setReady(false);

    send({ viewOnProfile: true, userid: user._id == currentChat.to ? currentChat.from : currentChat.to });
    send({ connectionCheck: true, userid: user._id == currentChat.to ? currentChat.from : currentChat.to });

    getLastSeen(user._id == currentChat.to ? currentChat.from : currentChat.to).then((res) => {
      setLastSeen(res.data.lastSeen);
      setReady(true);
    });

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [currentChat]);

  return (
    <div id="chat-top">
      <div className="chat-top-button">
        <svg viewBox="0 0 24 24" height="24" width="24" x="0px" y="0px">
          <path
            fill="#54656f"
            d="M12,7c1.104,0,2-0.896,2-2c0-1.105-0.895-2-2-2c-1.104,0-2,0.894-2,2 C10,6.105,10.895,7,12,7z M12,9c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,9.895,13.104,9,12,9z M12,15 c-1.104,0-2,0.894-2,2c0,1.104,0.895,2,2,2c1.104,0,2-0.896,2-2C13.999,15.894,13.104,15,12,15z"
          ></path>
        </svg>
      </div>
      <div className="chat-top-button">
        <svg viewBox="0 0 24 24" height="24" width="24" x="0px" y="0px">
          <path
            fill="#54656f"
            d="M15.9,14.3H15L14.7,14c1-1.1,1.6-2.7,1.6-4.3c0-3.7-3-6.7-6.7-6.7S3,6,3,9.7 s3,6.7,6.7,6.7c1.6,0,3.2-0.6,4.3-1.6l0.3,0.3v0.8l5.1,5.1l1.5-1.5L15.9,14.3z M9.7,14.3c-2.6,0-4.6-2.1-4.6-4.6s2.1-4.6,4.6-4.6 s4.6,2.1,4.6,4.6S12.3,14.3,9.7,14.3z"
          ></path>
        </svg>
      </div>
      <div id="chat-top-details">
        <div id="chat-top-name">{user._id == currentChat.to ? currentChat.fromusername : currentChat.tousername}</div>
        {ready ? <div id="chat-top-status">{connected ? (typing ? "...מקליד/ה" : "מחובר/ת") : `נראה/תה לאחרונה ${formatTimestamp(lastSeen)}`}</div> : <></>}
      </div>
      <img src="./images/profileimg.jpg" alt="" id="chat-top-img" />
      <div
        id="chat-top-back-button"
        style={{ display: width > breakWidth ? "none" : undefined }}
        onClick={() => {
          setCurrentChat(false);
        }}
      >
        Back
      </div>
    </div>
  );
}
