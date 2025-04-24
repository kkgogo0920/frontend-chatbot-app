import React from 'react';
import { Button } from '@arco-design/web-react';
import { IconMessage } from '@arco-design/web-react/icon';
import '../styles/ChatbotIcon.css';

function ChatbotIcon({ onClick }) {
  return (
    <div className="chatbot-icon">
      <Button 
        type="primary" 
        shape="circle" 
        icon={<IconMessage />} 
        size="large"
        onClick={onClick}
      />
    </div>
  );
}

export default ChatbotIcon;