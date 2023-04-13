import "./Message.css";
import { userProvider } from "../../App";
import React from "react";
import { formatTimestamp } from "../../functions/Functions";
import MessageStatus from "./MessageStatus";

export default function Message({ message }) {
  const { user } = React.useContext(userProvider);

  let a = message.from == user._id ? "outcome" : "income";

  return (
    <div className={`message ${a}`}>
      <div className="message-options">
        <svg viewBox="0 0 18 18" height="18" width="18" x="0px" y="0px">
          <path fill="#8696a0" d="M3.3,4.6L9,10.3l5.7-5.7l1.6,1.6L9,13.4L1.7,6.2L3.3,4.6z"></path>
        </svg>
      </div>
      {a == "outcome" ? (
        <svg viewBox="0 0 8 13" height="13" width="8" x="0px" y="0px" className="message-quote">
          <path opacity="0.13" fill="#0000000" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"></path>
          <path fill="#d9fdd3" d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"></path>
        </svg>
      ) : (
        <svg viewBox="0 0 8 13" height="13" width="8" x="0px" y="0px" className="message-quote">
          <path opacity="0.13" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path>
          <path fill="white" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path>
        </svg>
      )}

      <div className="message-text">
        {message.text}
        <div className="message-details">
          <div className="message-time">{formatTimestamp(message.timestamp)}</div>
          {a == "outcome" ? <MessageStatus status={message.status} /> : <></>}
        </div>
      </div>
    </div>
  );
}
