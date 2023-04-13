import "./ChatMessages.css";
import Message from "./Message";
import React from "react";

import { socket } from "../../server/WebSocket";
import { currentChatProvider, widthProvider } from "../../App";
import { breakWidth } from "../../env";
import { userProvider } from "../../App";

export default function ChatMessages({ setMessagesFromDB, messagesFromDB, newMessages, setNewMessages }) {
  const { currentChat } = React.useContext(currentChatProvider);
  const { width } = React.useContext(widthProvider);
  const chatRef = React.useRef();
  const { user } = React.useContext(userProvider);

  const [messagesGroups, setMessagesGroups] = React.useState([]);

  const handleMessage = (e) => {
    let message = JSON.parse(e.data);
    if (message.privateMessage) {
      if (currentChat.chatid == message.chatid) {
        if (message.from != user._id) {
          setNewMessages((newMessages) => newMessages.concat(message));
          setTimeout(() => (chatRef.current.scrollTop = chatRef.current.scrollHeight), 1);
        } else {
          let index = newMessages.findIndex((msg) => msg.timestamp === message.timestamp);
          if (index != -1) {
            let result = [...newMessages];
            result[index] = message;
            setNewMessages(result);
          }
        }
      }
    }
    if (message.messagesRead && currentChat.chatid == message.chatid) {
      setMessagesFromDB((messagesFromDB) =>
        messagesFromDB.map((msg) => {
          return { ...msg, status: 3 };
        })
      );
      setNewMessages((newMessages) =>
        newMessages.map((msg) => {
          return { ...msg, status: 3 };
        })
      );
    }
    if (message.messageDelivered && currentChat.chatid == message.chatid) {
      setMessagesFromDB((messagesFromDB) =>
        messagesFromDB.map((msg) => {
          return msg.status < 2 ? { ...msg, status: 2 } : msg;
        })
      );
      setNewMessages((newMessages) =>
        newMessages.map((msg) => {
          return msg.status < 2 ? { ...msg, status: 2 } : msg;
        })
      );
    }
  };
  React.useEffect(() => {
    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [newMessages, currentChat]);

  const isIncome = (msg) => {
    if (msg.from == user._id) return false;
    return true;
  };

  const isSameDate = (timestamp1, timestamp2) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);

    return date1.getFullYear() === date2.getFullYear() && date1.getMonth() === date2.getMonth() && date1.getDate() === date2.getDate();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp); // Convert to milliseconds
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      if (isSameDate(date, now)) {
        return "היום";
      } else {
        return "אתמול";
      }
    } else if (diffInDays === 1) {
      return "אתמול";
    } else if (diffInDays < 7) {
      return date.toLocaleDateString("he-IL", { weekday: "long" });
    } else {
      return date.toLocaleDateString("he-IL", { month: "long", day: "numeric" });
    }
  };

  const orderMessages = (messagesArray) => {
    let containers = [];

    let currentContainer = [];

    if (messagesArray.length == 0) return containers;

    let currentState = isIncome(messagesArray[0]);

    let currentTime = messagesArray[0].timestamp;

    const addDate = (timestamp) => {
      containers.push(
        <div key={containers.length} className="date-between-messages">
          {formatDate(timestamp)}
        </div>
      );
    };
    addDate(currentTime);

    for (let m of messagesArray) {
      if (!isSameDate(currentTime, m.timestamp)) {
        currentTime = m.timestamp;
        addDate(m.timestamp);
        if (currentState == isIncome(m)) {
          currentContainer.push(<Message key={m.timestamp} message={m} />);
        } else {
          containers.push(
            <div key={containers.length} className={currentState ? "income-messages" : "outcome-messages"}>
              {currentContainer.map((msg) => msg)}
            </div>
          );
          currentContainer = [];
          currentContainer.push(<Message key={m.timestamp} message={m} />);
          currentState = !currentState;
        }
      }
      else{
        if (currentState == isIncome(m)) {
          currentContainer.push(<Message key={m.timestamp} message={m} />);
        } else {
          containers.push(
            <div key={containers.length} className={currentState ? "income-messages" : "outcome-messages"}>
              {currentContainer.map((msg) => msg)}
            </div>
          );
          currentContainer = [];
          currentContainer.push(<Message key={m.timestamp} message={m} />);
          currentState = !currentState;
        }
      }

    }

    containers.push(
      <div key={containers.length} className={currentState ? "income-messages" : "outcome-messages"}>
        {currentContainer.map((msg) => msg)}
      </div>
    );
    return containers;
  };

  React.useEffect(() => {
    setMessagesGroups(orderMessages([...messagesFromDB, ...newMessages].sort((a, b) => a.timestamp - b.timestamp)));

    setTimeout(() => (chatRef.current.scrollTop = chatRef.current.scrollHeight), 1);
  }, [newMessages, messagesFromDB, currentChat]);

  return (
    <div id="chat-messages" ref={chatRef} style={{ padding: width < breakWidth ? "20px 8px 20px 8px" : undefined }}>
      {messagesGroups.map((group) => group)}
    </div>
  );
}
