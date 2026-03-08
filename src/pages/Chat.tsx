
import React, { useState } from 'react';
import { Send } from 'lucide-react';

export function ChatInterface() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Is the Azadpur Mandi open today?", sender: 'me', time: '10:00 AM' },
    { id: 2, text: "Yes, we are open from 4 AM to 8 PM.", sender: 'mandi', time: '10:05 AM' },
    { id: 3, text: "What is the current rate for Wheat Grade A?", sender: 'me', time: '10:15 AM' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'me', time: 'Now' }]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-gray-50">
      <div className="p-4 bg-white shadow-sm border-b z-10">
        <h2 className="font-bold text-gray-800">Support Chat</h2>
        <p className="text-xs text-gray-500">Directly connect with Mandi administrators</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.sender === 'me' 
                  ? 'bg-green-600 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-sm'
              }`}
            >
              <p>{msg.text}</p>
              <span className={`text-[10px] block mt-1 ${msg.sender === 'me' ? 'text-green-200' : 'text-gray-400'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={handleSend}
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-gray-400 mt-2">
          Your phone number is hidden for privacy.
        </p>
      </div>
    </div>
  );
}
