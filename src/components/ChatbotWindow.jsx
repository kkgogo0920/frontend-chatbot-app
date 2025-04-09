import React, { useState, useEffect, useRef } from 'react';
import { Button, Input } from '@arco-design/web-react';
import '../styles/ChatbotWindow.css';

function ChatbotWindow({ onClose }) {
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('chatMessages');
        return savedMessages ? JSON.parse(savedMessages) : [];
    });
    const [inputText, setInputText] = useState('');
    const [elapsedTime, setElapsedTime] = useState(0);
    const messageViewRef = useRef(null);
    const intervalRef = useRef(null);
  
    useEffect(() => {
        localStorage.setItem('chatMessages', JSON.stringify(messages));
    }, [messages]);
    
    useEffect(() => {
        intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
        
        return () => clearInterval(intervalRef.current);
    }, []);
  
    useEffect(() => {
        if (messageViewRef.current) {
        messageViewRef.current.scrollTop = messageViewRef.current.scrollHeight;
        }
    }, [messages]);
  
    const resetChat = () => {
        setMessages([]);
        localStorage.removeItem('chatMessages');
        setElapsedTime(0);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
        setElapsedTime(prevTime => prevTime + 1);
        }, 1000);
    };
  
  const handleClose = () => {
    clearInterval(intervalRef.current);
    onClose();
  };
  
  const generateResponse = (userMessage) => {
    const lowercaseInput = userMessage.toLowerCase();
    
    if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
      return "I'm here to help!";
    } 
    else if (lowercaseInput.includes('help')) {
      return "I'm happy to assist! What do you need help with?";
    }
    else if (lowercaseInput.includes('thank')) {
      return "You're welcome! Anything else you need?";
    }
    else if (lowercaseInput.includes('how are you')) {
      return "I'm doing well, thanks for asking! How about you?";
    }
    else if (userMessage.endsWith('?')) {
      return "That's a great question. Let me think about that...";
    }
    else {
      const responses = [
        "That's interesting, tell me more.",
        "I see. Can you tell me more about that?",
        "Interesting! Could you elaborate?",
        "Got it. What else would you like to discuss?"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };
  
  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    const userMessage = inputText;
    
    const newMessages = [
      ...messages,
      { text: userMessage, sender: 'user' }
    ];
    
    setMessages(newMessages);
    setInputText('');
    
    setTimeout(() => {
      const botResponse = generateResponse(userMessage);
      
      setMessages(prevMessages => [
        ...prevMessages,
        { text: botResponse, sender: 'bot' }
      ]);
    }, 500);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  
  return (
    <div className="chatbot-window">
      <div className="chatbot-header">
        <div className="timer">{elapsedTime}s</div>
        <div className="header-buttons">
          <Button type="text" className="reset-button" onClick={resetChat}>Reset</Button>
          <Button type="text" className="close-button" onClick={handleClose}>Close</Button>
        </div>
      </div>
      <div className="message-view" ref={messageViewRef}>
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender}-message`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="input-view">
        <Input 
          placeholder="Type your message..." 
          value={inputText}
          onChange={setInputText}
          onKeyUp={handleKeyPress}
        />
        <Button
          type="primary"
          onClick={sendMessage}
          className="send-button"
        >
          Send
        </Button>
      </div>
    </div>
  );
}

export default ChatbotWindow;