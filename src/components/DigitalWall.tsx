"use client";

import { useState } from 'react';

// Mock messages representing community art/messages
const mockMessages = [
  { id: 1, type: 'text', content: 'Excited for the XR workshops!', author: '@detroit_dev', color: 'bg-blue-900/40' },
  { id: 2, type: 'text', content: 'Can’t wait to see the live mural!! 🎨', author: '@artlover', color: 'bg-purple-900/40' },
  { id: 3, type: 'text', content: 'Bringing the Love Collective energy from Chicago!', author: '@chi_creator', color: 'bg-green-900/40' },
  { id: 4, type: 'text', content: 'Looking for collaborators for a 3D short film, hit me up at the alley!', author: '@animator_dan', color: 'bg-yellow-900/40' },
  { id: 5, type: 'text', content: 'Detroit hustle x Digital Art = 🔥', author: '@motorcitypixels', color: 'bg-red-900/40' },
  { id: 6, type: 'text', content: 'Love and pixels to everyone.', author: '@anon', color: 'bg-gray-800' },
];

export default function DigitalWall() {
  const [messages, setMessages] = useState(mockMessages);
  const [newMessage, setNewMessage] = useState('');

  const handlePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const colors = ['bg-blue-900/40', 'bg-purple-900/40', 'bg-green-900/40', 'bg-red-900/40'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newEntry = {
      id: Date.now(),
      type: 'text',
      content: newMessage,
      author: '@you',
      color: randomColor
    };

    setMessages([newEntry, ...messages]);
    setNewMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Interactive Digital Canvas</h2>
        <p className="text-gray-400">Leave a message of love or support for the community. This virtual wall mirrors our live open canvas at the event.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* Post Form */}
        <div className="lg:col-span-1">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 sticky top-24">
            <h3 className="text-xl font-bold mb-4 text-gray-200">Contribute</h3>
            <form onSubmit={handlePost}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                rows={4}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 mb-4 resize-none"
                placeholder="Type your message of love here..."
                maxLength={140}
              />
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">{newMessage.length}/140</span>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Post to Wall
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Masonry-style Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-max">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${msg.color} p-6 rounded-2xl border border-gray-700/50 hover:border-gray-500 transition-colors flex flex-col justify-between min-h-[150px] shadow-lg break-inside-avoid`}
              >
                <p className="text-gray-100 font-medium text-lg mb-4">{msg.content}</p>
                <div className="text-sm font-mono text-gray-400 text-right">
                  - {msg.author}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}