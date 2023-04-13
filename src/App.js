import "./App.css";
import RightPanel from "./right-panel/RightPanel";
import LeftPanel from "./left-panel/LeftPanel";
import Auth from "./auth/Auth";

import React from "react";
import { getChatsHistory, getNewMessages, getUser } from "./server/Server";
import "./server/WebSocket";
import { socket, send } from "./server/WebSocket";
import { getChatID } from "./functions/Functions";

export const userProvider = React.createContext();
export const currentChatProvider = React.createContext();
export const chatsHistoryProvider = React.createContext();
export const widthProvider = React.createContext();

function App() {
  const [user, setUser] = React.useState();
  const [waitingForUser, setWaitingForUser] = React.useState(true);
  const [waitingForServer, setWaitingForServer] = React.useState(true);
  const [currentChat, setCurrentChat] = React.useState(false);
  const [chatsHistory, setChatsHistory] = React.useState([]);
  const [chatsHistoryFilter, setChatsHistoryFilter] = React.useState(false);
  const [newChats, setNewChats] = React.useState([]);
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    setWidth(window.innerWidth);
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    getUser().then((res) => {
      setUser(res.data);
      setWaitingForUser(false);
    });
  }, []);

  const handleMessage = (e) => {
    let message = JSON.parse(e.data);
    if (message.userReady) {
      setWaitingForServer(false);
    }
    if (message.typing == false || message.typing == true || message.privateMessage || message.messagesRead || message.messageDelivered) {
      updateChatsHistory(message);
    }
  };

  React.useEffect(() => {
    socket.addEventListener("message", handleMessage);
    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [chatsHistory]);

  React.useEffect(() => {
    if (user) {
      send({ MyID: user._id });

      getChatsHistory().then((res) => {
        setChatsHistory(res.data);
      });
    } else {
      setWaitingForServer(false);
    }
  }, [user]);

  // React.useEffect(() => {
  //   console.log(currentChat);
  // }, [currentChat]);

  const updateChatsHistory = (newMessage) => {
    let index = chatsHistory.findIndex((c) => c.chatid == newMessage.chatid);
    if (newMessage.privateMessage) {
      if (index != -1) {
        setChatsHistory((chatsHistory) => chatsHistory.map((c) => (c.chatid == newMessage.chatid ? { ...newMessage, newMessages: newMessage.status != 3 ? c.newMessages + 1 : 0 } : c)));
      } else {
        setChatsHistory((chatsHistory) => chatsHistory.concat({ ...newMessage, newMessages: 1 }));
      }
    }
    if (newMessage.typing == true || newMessage.typing == false) {
      if (index != -1) {
        setChatsHistory((chatsHistory) =>
          chatsHistory.map((c) => {
            return c.chatid == newMessage.chatid ? { ...c, typing: newMessage.typing } : c;
          })
        );
      }
    }
    if (newMessage.messagesRead) {
      if (index != -1) {
        setChatsHistory((chatsHistory) =>
          chatsHistory.map((c) => {
            return c.chatid == newMessage.chatid && c.from != newMessage.reader ? { ...c, status: 3 } : c;
          })
        );
      }
    }
    if (newMessage.messageDelivered) {
      if (index != -1) {
        setChatsHistory((chatsHistory) =>
          chatsHistory.map((c) => {
            return c.chatid == newMessage.chatid && c.status < 2 ? { ...c, status: 2 } : c;
          })
        );
      }
    }
  };

  return (
    <div id="container">
      <div id="background-top"></div>
      <div id="background-bottom"></div>
      <div id="app-container">
        {!waitingForUser && !waitingForServer ? (
          user ? (
            <userProvider.Provider value={{ user, setUser }}>
              <widthProvider.Provider value={{ width, setWidth }}>
                <currentChatProvider.Provider value={{ currentChat, setCurrentChat }}>
                  <chatsHistoryProvider.Provider value={{ chatsHistory, setChatsHistory, updateChatsHistory, chatsHistoryFilter, setChatsHistoryFilter, newChats, setNewChats }}>
                    <LeftPanel />
                    <RightPanel />
                  </chatsHistoryProvider.Provider>
                </currentChatProvider.Provider>
              </widthProvider.Provider>
            </userProvider.Provider>
          ) : (
            <Auth setUser={setUser} />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default App;
