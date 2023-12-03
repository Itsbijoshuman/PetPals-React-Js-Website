import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebase-config";
import { onAuthStateChanged } from "firebase/auth";
import style from "./message.module.css";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";
import ChatBox from "./ChatBox";
import BotChatBox from "./BotChatBox"; // Import the BotChatBox component
import User from "../../User";

function MessagesList() {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState(null); // Initialize chat state as null
  const [isBotChatActive, setIsBotChatActive] = useState(false);
  const tempPetId = "9sYo60KFi2k52JJcZwpZ";

  // references the favArr in the database and returns a Promise
  const getFavArr = (user1) => {
    const arrayRef = doc(db, "users", user1);
    return getDoc(arrayRef).then((docSnap) => {
      const data = docSnap.data();
      const favArr = data.favArr;
      return favArr;
    });
  };

  // gets the log of messages and updates automatically
  const getChatLog = (user) => {
    const user1 = user.uid;
    return getFavArr(user1).then((favArr) => {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "in", favArr));
  
      const unsub = onSnapshot(q, (querySnapshot) => {
        let usersArr = [];
        querySnapshot.forEach((doc) => {
          usersArr.push(doc.data());
        });
  
        // Check if the user with UID "bot" is in the list, if not, add it
        const botUser = usersArr.find((user) => user.uid === "bot");
        if (!botUser) {
          // Create a hardcoded "bot" user
          const botUser = {
            uid: "bot",
            person: "Bot",
            // Add additional properties for name and profile picture
            firstName: "Bot",
            imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Frepository-images.githubusercontent.com%2F156847937%2F2ac66980-0f3d-11eb-8e62-693087aa1f67&f=1&nofb=1&ipt=dbb3337ed3129899393e0c4ee92791eccac68795494e9a50c6adba30b7d35561&ipo=images",
          };
          usersArr.unshift(botUser);
          // Set the bot user as the default chat user
          setChat(botUser);
        }
  
        setUsers(usersArr);
      });
  
      return () => unsub();
    });
  };
  

  const selectUser = function (user) {
    if (user.uid === "bot") {
      setIsBotChatActive(true); // Activate BotChatBox
      setChat(null); // Set chat state to null
    } else {
      setIsBotChatActive(false); // Deactivate BotChatBox
      setChat(user); // Set the selected user in the chat state
    }
  };
  

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getChatLog(user).then((unsubscribe) => {
          // You can handle unsubscribe logic here if needed
        });
      }
    });
  }, []);

  return (
    <div className={style.messageListCont}>
      <div className={style.useContainer}>
        <h1 style={{ margin: "10px", textAlign: "center" }}>Users</h1>
        {users.map((user, index) => (
          <User key={index} user={user} selectUser={selectUser} />
        ))}
      </div>
      <div className={style.chatbox}>
        {isBotChatActive ? (
          <div>
            <h3>Bot</h3>
            <BotChatBox petID={tempPetId} />
          </div>
        ) : chat ? (
          <div>
            <h3>{chat.person}</h3>
            <ChatBox user1={auth.currentUser.uid} user2={chat} petID={tempPetId} />
          </div>
        ) : (
          <div>
            <h3 className="select-user-chatbox">Select a user</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesList;
