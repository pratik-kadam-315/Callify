import React, { useState, useRef, useEffect } from 'react';

/**
 * ChatSidebar Component - Collapsible chat panel for video calls
 * Features message history, real-time messaging, and emoji reactions
 */
const ChatSidebar = ({ 
  isOpen, 
  onClose, 
  messages = [], 
  onSendMessage, 
  unreadCount = 0 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Handle sending message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Emoji reactions
  const emojis = ['👍', '❤️', '😂', '🎉', '👏', '🤝'];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Chat Sidebar */}
      <div className={`
        fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 z-40 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-20
      `}>
        {/* Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-white font-semibold">Chat</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors lg:hidden"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Date Separator */}
          <div className="flex items-center gap-2 my-4">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-400 text-xs">Today</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          {/* Messages */}
          {messages.map((message, index) => (
            <div key={index} className="space-y-2">
              {/* System Message */}
              {message.type === 'system' && (
                <div className="text-center">
                  <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full">
                    {message.content}
                  </span>
                </div>
              )}

              {/* User Message */}
              {message.type === 'user' && (
                <div className={`flex gap-3 ${message.isOwn ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.isOwn ? 'bg-blue-600' : 'bg-gray-600'
                  }`}>
                    <span className="text-white text-sm font-medium">
                      {message.sender.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className={`max-w-[70%] ${message.isOwn ? 'text-right' : ''}`}>
                    {!message.isOwn && (
                      <p className="text-gray-400 text-xs mb-1">{message.sender}</p>
                    )}
                    <div className={`inline-block px-3 py-2 rounded-lg ${
                      message.isOwn 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-800 text-gray-200'
                    }`}>
                      <p className="text-sm break-words">{message.content}</p>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              )}

              {/* File Share */}
              {message.type === 'file' && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
                          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{message.fileName}</p>
                          <p className="text-gray-400 text-xs">{message.fileSize}</p>
                        </div>
                        <button className="text-blue-400 hover:text-blue-300">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mt-1">
                      {message.sender} • {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">P</span>
              </div>
              <div className="bg-gray-800 rounded-lg px-3 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Emoji Reactions */}
        <div className="px-4 py-2 border-t border-gray-800">
          <div className="flex gap-2 justify-center">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => onSendMessage(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-800">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg px-3 py-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-2">
            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              Share File
            </button>
            <button className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg px-3 py-2 text-sm transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              Share Screen
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
