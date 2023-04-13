import { getChatsHistory, search } from "../../server/Server";
import "./RightPanelSearch.css";
import React from "react";

import { chatsHistoryProvider } from "../../App";

export default function RightPanelSearch() {
  const { chatsHistory, setChatsHistory, setChatsHistoryFilter, newChats, setNewChats } = React.useContext(chatsHistoryProvider);

  return (
    <div id="right-panel-search">
      <svg id="right-panel-chats-filter" viewBox="0 0 24 24" height="20" width="20" x="0px" y="0px">
        <path fill="#8696a0" d="M10,18.1h4v-2h-4V18.1z M3,6.1v2h18v-2H3z M6,13.1h12v-2H6V13.1z"></path>
      </svg>
      <div id="right-panel-search-input">
        <svg viewBox="0 0 24 24" height="24" width="24" x="0px" y="0px">
          <path fill="#8696a0" d="M17.25,7.8L16.2,6.75l-4.2,4.2l-4.2-4.2L6.75,7.8l4.2,4.2l-4.2,4.2l1.05,1.05l4.2-4.2l4.2,4.2l1.05-1.05 l-4.2-4.2L17.25,7.8z"></path>
        </svg>

        <div
          id="right-panel-search-input-text"
          contentEditable="true"
          onInput={(e) => {
            if (!e.target.textContent.length) {
              setChatsHistoryFilter(false);
              setNewChats([]);
            } else {
              search(e.target.textContent).then((res) => {
                let chatids = [];
                for (let i of res.data) {
                  chatids.push(i.chatid);
                }
                setChatsHistoryFilter(chatids);

                for (let c of res.data) {
                  if (chatsHistory.findIndex((i) => i.chatid == c.chatid) == -1) {
                    setNewChats((newChats) => newChats.concat(c));
                  }
                }
              });
            }
          }}
        />
        {/* <svg viewBox="0 0 24 24" height="24" width="24" x="0px" y="0px">
        <path fill="#00a884" d="M12,4l1.4,1.4L7.8,11H20v2H7.8l5.6,5.6L12,20l-8-8L12,4z"></path>
      </svg> */}
        <svg viewBox="0 0 24 24" height="24" width="24" x="0px" y="0px">
          <path
            fill="#54656f"
            d="M15.009,13.805h-0.636l-0.22-0.219c0.781-0.911,1.256-2.092,1.256-3.386 c0-2.876-2.332-5.207-5.207-5.207c-2.876,0-5.208,2.331-5.208,5.207s2.331,5.208,5.208,5.208c1.293,0,2.474-0.474,3.385-1.255 l0.221,0.22v0.635l4.004,3.999l1.194-1.195L15.009,13.805z M10.201,13.805c-1.991,0-3.605-1.614-3.605-3.605 s1.614-3.605,3.605-3.605s3.605,1.614,3.605,3.605S12.192,13.805,10.201,13.805z"
          ></path>
        </svg>
      </div>
    </div>
  );
}
