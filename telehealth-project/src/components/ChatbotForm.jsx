import React, { useRef } from "react";
import "../screens/About.css";

const ChatbotForm = ({ chatHistory, setChatHistory, generateBotResponse}) => {
    const inputRef = useRef();

    const handleBotFormSubmit = (e) => {
        e.preventDefault();
        const userMessage = inputRef.current.value.trim();
        // console.log(userMessage);
        if(!userMessage) return;
        inputRef.current.value = "";

        // update the chat history with user messages
        setChatHistory(history => [...history, {role: "user", text: userMessage }]);

        // placeholder for the bot's response
        setTimeout(() => {
            setChatHistory(history => [...history, {role: "model", text: "Thinking..." }]);

            // call the function to generate the bot's response
            generateBotResponse([...chatHistory, {role: "user", text: userMessage }]);
        } 
        ,600);

    }

    return (
        <form action="#" className="chatbot-form" onSubmit={handleBotFormSubmit}>
            <input ref={inputRef} type="text" placeholder="Message..." className="message-input" required />
            <button className="material-symbols-rounded">arrow_upward</button>
        </form>
    );
}
export default ChatbotForm;