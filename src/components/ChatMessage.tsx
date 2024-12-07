import React from 'react';

interface ChatMessageProps {
  username: string;
  message: string;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ username, message, timestamp }) => {
  return (
    <div className="p-3 hover:bg-gray-50">
      <div className="flex items-start gap-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{username}</span>
            <span className="text-xs text-gray-400">{timestamp}</span>
          </div>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;