'use client';

import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';
import { WallNote } from '@/types';

type WallCategory = 'All' | 'General' | 'Art Tip' | 'Collaboration' | 'Shoutout';

export default function DigitalWall() {
  const [notes, setNotes] = useState<WallNote[]>([]);
  const [category, setCategory] = useState<WallCategory>('All');
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<WallNote['category']>('General');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      try {
        const url = category === 'All' ? '/api/wall' : `/api/wall?category=${category}`;
        const res = await fetch(url);
        if (res.ok && isMounted) {
          const data = await res.json();
          setNotes(data.notes || []);
        }
      } catch (err) {
        console.error('Failed to fetch digital wall notes:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchNotes();
    return () => {
      isMounted = false;
    };
  }, [category, reloadTrigger]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author,
          message,
          category: selectedCategory
        })
      });

      if (res.ok) {
        setMessage('');
        setReloadTrigger((v) => v + 1);
      }
    } catch (err) {
      console.error('Failed to post note to digital wall:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (id: string) => {
    // Optimistic UI update
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );

    try {
      await fetch('/api/wall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'like', id })
      });
    } catch {
      // Revert if needed
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-950/60 border border-pink-500/30 rounded-full text-xs font-mono text-pink-300 mb-3">
          <span>LIVE COMMUNITY FEED</span>
          <Tooltip content="Messages posted here appear live on the Huntington Place Grand Ballroom projection walls and online viewer streams." />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">The Digital Wall</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Share your craft insights, drop shoutouts for Detroit artists, or seek collaborators for upcoming game jams and projects.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Post Form */}
        <div className="lg:col-span-1 bg-gray-950/80 p-6 rounded-2xl border border-gray-800 shadow-xl backdrop-blur-md h-fit">
          <h3 className="text-lg font-bold text-white mb-1 flex items-center justify-between">
            <span>Drop a Thought</span>
            <span className="text-xs font-mono text-gray-500">{280 - message.length} left</span>
          </h3>
          <p className="text-xs text-gray-400 mb-4">Post directly to the live exhibition displays.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Your Name or Alias</label>
              <input
                required
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Maya Lin (@maya_render)"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as WallNote['category'])}
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              >
                <option value="General">General</option>
                <option value="Art Tip">Art Tip</option>
                <option value="Collaboration">Collaboration</option>
                <option value="Shoutout">Shoutout</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Message (Max 280 chars)</label>
              <textarea
                required
                maxLength={280}
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a tip, say hello, or coordinate an impromptu coffee meetup at Hall A..."
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !author.trim() || !message.trim()}
              className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all font-mono text-xs tracking-wider"
            >
              {submitting ? 'Broadcasting...' : 'Broadcast to Canvas'}
            </button>
          </form>
        </div>

        {/* Live Wall Feed */}
        <div className="lg:col-span-2 space-y-4">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {(['All', 'General', 'Art Tip', 'Collaboration', 'Shoutout'] as WallCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === cat
                    ? 'bg-pink-600 text-white font-bold shadow-md shadow-pink-900/30'
                    : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin mb-2" />
              <p className="font-mono text-xs">Syncing digital wall...</p>
            </div>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-950/80 border border-gray-800/80 hover:border-pink-500/40 p-5 rounded-2xl flex flex-col justify-between transition-all backdrop-blur-sm group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-white text-sm tracking-tight">{note.author}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-950/60 text-pink-300 border border-pink-500/30">
                        {note.category}
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed mb-4">{note.message}</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-900 text-xs text-gray-500 font-mono">
                    <span>
                      {new Date(note.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <button
                      onClick={() => handleLike(note.id)}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-gray-900 text-gray-400 hover:text-pink-400 transition-colors"
                      title="Cheer note"
                    >
                      <span>♥</span>
                      <span className="font-semibold">{note.likes}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-950/40 rounded-2xl border border-gray-900 text-gray-500">
              <p className="text-sm">No notes found under this category.</p>
              <p className="text-xs text-gray-600 mt-1">Be the first to leave a message!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
