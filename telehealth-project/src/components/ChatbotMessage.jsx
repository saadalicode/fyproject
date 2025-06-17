import React from 'react';
import ChatbotIcon from './ChatbotIcon';
import "../screens/About.css";


const ChatbotMessage = ({chat}) => {
  return (
    <div className={`message ${chat.role === "model" ? 'bot' : 'user'}-message ${chat.isError ? 'error' : ""}`}>
        {chat.role === "model" && <ChatbotIcon />}
        <p className="message-text">
            {chat.text} 
        </p>
    </div>
  )
}

export default ChatbotMessage