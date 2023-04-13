import "./Chat.css";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatTop from "./ChatTop";

import React from "react";
import { getChatHistory } from "../../server/Server";
import { currentChatProvider, userProvider } from "../../App";

export default function Chat() {
  const [messagesFromDB, setMessagesFromDB] = React.useState([]);
  const [newMessages, setNewMessages] = React.useState([]);
  const { currentChat } = React.useContext(currentChatProvider);
  const { user } = React.useContext(userProvider);

  React.useEffect(() => {
    setNewMessages([]);
    setMessagesFromDB([]);
    getChatHistory(currentChat.to == user._id ? currentChat.from : currentChat.to).then((res) => {
      setMessagesFromDB(res.data);
    });
  }, [currentChat]);

  return (
    <div id="chat">
      <ChatTop />
      <ChatMessages setMessagesFromDB={setMessagesFromDB} messagesFromDB={messagesFromDB} newMessages={newMessages} setNewMessages={setNewMessages} />
      <ChatInput newMessages={newMessages} setNewMessages={setNewMessages} />
    </div>
  );
}
