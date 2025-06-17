import React, { useEffect, useRef, useState } from "react";
import ChatbotIcon from "../components/ChatbotIcon";
import './About.css';
import ChatbotForm from "../components/ChatbotForm";
import ChatbotMessage from "../components/ChatbotMessage";

const About = () => {
    const [chatHistory, setChatHistory] = useState([]);
    const [showChatbot, setShowChatbot] = useState(false);
    const chatBodyRef = useRef();

    // helper function to update the chat history
    const updateHistory = (text, isError = false) => {
        setChatHistory(pre => [...pre.filter(msg => msg.text !== "Thinking..."), {role: "model", text, isError}]);
    }

    const generateBotResponse = async (history) => {
        // format chat history for API request
        history = history.map(({role, text}) => ({role, parts:[{text}]}));

        const  requestOptons = {
            method: "POST",
            headers: { 
                "Content-Type": "application/json"
            },
            body: JSON.stringify({contents: history})
        }

        try{
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptons);
            const data = await response.json();
            if(!response.ok) throw new Error(data.error.message || "Something went wrong!");

            // clean and update chat history with bot;s response
            const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            updateHistory(apiResponseText);
        }catch(error){
            updateHistory(error.message, ture);
        }

    }

    useEffect(() => {
        // Auto-scroll whenever chat history updates
        chatBodyRef.current.scrollTo({top: chatBodyRef.current.scrollHeight, behavior: "smooth"});
    }, [chatHistory]);

    return(
        <div className={`chatbot-container ${showChatbot ? 'show-chatbot' : ""}`}>
            <button onClick={() => setShowChatbot(prev => !prev)} id="chatbot-toggler">
                <span className="material-symbols-rounded">mode_comment</span>
                <span className="material-symbols-rounded">close</span>
            </button>

            <div className="chatbot-subcontainer">
                <div className="chatbot-popup">
                    {/* Chat bot header */}
                    <div className="chatbot-header">
                        <div className="chatbot-header-info">
                            <ChatbotIcon/>
                            <h2 className="logo-text">Chatbot</h2>
                        </div>
                        <button onClick={() => setShowChatbot(prev => !prev)}className="material-symbols-rounded">keyboard_arrow_down</button>
                    </div>

                    {/* Chatbot body */}
                    <div ref={chatBodyRef} className="chatbot-body">
                        <div className="message bot-message">
                            <ChatbotIcon/>
                            <p className="message-text">
                                Hey there 👋 <br /> How can I help you?
                            </p>
                        </div>

                         {/* Render the chat history dynamically */}
                        {chatHistory.map((chat, index) => (
                            <ChatbotMessage key={index} chat={chat}/>
                        ))}

                        
                    </div>

                    {/* Chatbot footer  */}
                    <div className="chatbot-footer">
                        <ChatbotForm chatHistory={chatHistory} setChatHistory={setChatHistory} generateBotResponse={generateBotResponse} />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default About;