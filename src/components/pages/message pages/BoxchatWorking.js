import React, { useEffect } from "react";
import { useChatBot } from "react-chatbot-kit";
import MessageParser from "./MessageParser";
import style from "./message.module.css";

function BotChatBox({ predefinedQuestions }) {
  const { messages, sendMessage } = useChatBot({
    messageParser: MessageParser,
    initialMessages: [
      {
        role: "bot",
        content: "Welcome! How can I assist you today?",
        suggestions: predefinedQuestions,
      },
    ],
  });

  const handleQuestionClick = (question) => {
    sendMessage(question);
  };

  useEffect(() => {
    const chatContainer = document.querySelector(".chat-container");
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [messages]);

  return (
    <div className="bot-chatbox">
      <div className={style.chatContainer}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.role}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="predefined-questions">
        <h3>Choose a question:</h3>
        {messages.length > 0 && messages[messages.length - 1].suggestions
          ? messages[messages.length - 1].suggestions.map((question, index) => (
              <button key={index} onClick={() => handleQuestionClick(question)}>
                {question}
              </button>
            ))
          : null}
      </div>
    </div>
  );
}

export default BotChatBox;
