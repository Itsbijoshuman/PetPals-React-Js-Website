import React from "react";
import Chatbot from "react-chatbot-kit";
//import "react-chatbot-kit/build/main.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";



function BotChatBox({ predefinedQuestions }) {
    return (
      <div>
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    );
  };

export default BotChatBox;
