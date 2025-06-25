import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import axios from 'axios';

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const toggleChat = () => setOpen(!open);

  const sendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:8000/chatbot', { message: query });
      const botReply = res.data.reply || "Sorry, I couldn't understand.";
      setMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Something went wrong. Try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          onClick={toggleChat}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
      {open && (
        <div className="w-80 h-96 bg-white border shadow-lg rounded-xl flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex justify-between items-center rounded-t-xl">
            <h2 className="font-semibold text-sm">Ask SplitBot</h2>
            <button onClick={toggleChat}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-3 space-y-2 overflow-y-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`text-sm px-3 py-2 rounded-lg w-fit max-w-[75%] ${
                  msg.sender === 'user'
                    ? 'ml-auto bg-blue-100 text-gray-900'
                    : 'mr-auto bg-gray-100 text-gray-700'
                }`}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <div className="flex items-center space-x-1 text-sm text-gray-500 animate-pulse">
                <div className="bg-gray-200 px-3 py-2 rounded-lg w-fit">SplitBot is typing...</div>
              </div>
            )}
          </div>

          <div className="p-3 border-t flex items-center gap-2">
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-1 text-sm outline-none focus:ring-1 ring-blue-400"
              placeholder="Ask something..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatbotWidget;
