import React from "react";
import { auth } from "../../../firebase-config";
import style from "./message.module.css";

// just assigns classes for sent or received
function ChatMessage(props) {
  const { text, from, photoURL } = props.message;

  const messageClass =
    from === auth.currentUser.uid ? style.sent : style.received;

  return (
    <>
      <div className={`${style.message} ${messageClass}`}>
        <img
          className={style.Icon}
          src={
            photoURL || "https://cdn-icons-png.flaticon.com/512/141/141783.png"
          }
        />
        <p className={style.text}>{text}</p>
        {/* <p>{createdAt.nanoseconds}</p> */}
      </div>
    </>
  );
}

export default ChatMessage;
