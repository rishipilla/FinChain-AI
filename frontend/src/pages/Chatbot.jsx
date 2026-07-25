import { useState } from 'react';
import api from '../api';

export default function Chatbot() {
  const [messages, setMessages] = useState([{ from: 'bot', text: 'Hi! Ask me anything about your finances.' }]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { from: 'user', text: input };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    const res = await api.post('/ai/chat', { message: input });
    setMessages((m) => [...m, { from: 'bot', text: res.data.reply }]);
  };

  return (
    <div className="p-8 max-w-xl mx-auto flex flex-col h-[80vh]">
      <h1 className="text-2xl font-bold mb-4">Finance Chatbot</h1>
      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow p-4 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.from === 'user' ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${m.from === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border rounded p-2" value={input}
          onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button onClick={send} className="bg-blue-600 text-white px-4 rounded">Send</button>
      </div>
    </div>
  );
}