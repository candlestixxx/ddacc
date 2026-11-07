'use client';

import React, { useState, useEffect } from 'react';
import { TrackType, Session } from '@/types';
import Tooltip from './Tooltip';

interface ApiScheduleResponse {
  status: string;
  totalDays: number;
  days: {
    dayId: string;
    date: string;
    theme: string;
    sessions: Session[];
  }[];
}

const allTracks: TrackType[] = [
  'Love Collective',
  'Industry & Innovation',
  'Emergent Tools & Workshops',
  'Interactive & Experimental Media',
  'General'
];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState<string>('day-1');
  const [selectedTrack, setSelectedTrack] = useState<TrackType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scheduleDays, setScheduleDays] = useState<ApiScheduleResponse['days']>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeSessionModal, setActiveSessionModal] = useState<Session | null>(null);
  const [bookmarkedSessionIds, setBookmarkedSessionIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (selectedDay) params.set('day', selectedDay);
        if (selectedTrack !== 'All') params.set('track', selectedTrack);
        if (searchQuery.trim()) params.set('q', searchQuery.trim());

        const res = await fetch(`/api/schedule?${params.toString()}`);
        if (res.ok) {
          const data: ApiScheduleResponse = await res.json();
          setScheduleDays(data.days || []);
        }
      } catch (err) {
        console.error('Failed to load schedule from API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [selectedDay, selectedTrack, searchQuery]);

  const toggleBookmark = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedSessionIds((prev) =>
      prev.includes(sessionId) ? prev.filter((id) => id !== sessionId) : [...prev, sessionId]
    );
  };

  const currentDayData = scheduleDays.find((d) => d.dayId === selectedDay) || scheduleDays[0];
  const sessions = currentDayData?.sessions || [];

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-950/60 border border-blue-500/30 rounded-full text-xs font-mono text-blue-300 mb-3">
          <span>DDACC 2026 LIVE CURATION</span>
          <Tooltip content="All sessions are scheduled in Eastern Time (EDT) at Huntington Place Detroit and synchronized via live web streams." />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Program Schedule</h2>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
          Browse through our three full days of masterclasses, lightning keynotes, portfolio juries, and Detroit digital art battles.
        </p>
      </div>

      {/* Control Bar: Day Selection & Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-6">
        {/* Day Buttons */}
        <div className="flex bg-gray-900/90 border border-gray-800 p-1.5 rounded-xl">
          {[
            { id: 'day-1', label: 'Day 1 • May 15', desc: 'Fundamentals & Ethos' },
            { id: 'day-2', label: 'Day 2 • May 16', desc: 'Showcase & Emerging' },
            { id: 'day-3', label: 'Day 3 • May 17', desc: 'Future & Community' }
          ].map((day) => (
            <button
              key={day.id}
              onClick={() => setSelectedDay(day.id)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                selectedDay === day.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              {day.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search sessions, topics, speakers, rooms..."
            className="w-full bg-gray-900/90 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-gray-500 hover:text-white font-mono"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>

      {/* Track Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs uppercase font-mono text-gray-400 mr-2 flex items-center">
          Tracks
          <Tooltip content="Filter by thematic focus across technical workshops, industry careers, and Love Collective initiatives." />
        </span>
        <button
          onClick={() => setSelectedTrack('All')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            selectedTrack === 'All'
              ? 'bg-cyan-500 text-black font-bold shadow'
              : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          All Tracks
        </button>
        {allTracks.map((track) => (
          <button
            key={track}
            onClick={() => setSelectedTrack(track)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              selectedTrack === track
                ? 'bg-blue-600 text-white font-bold shadow'
                : 'bg-gray-900/80 text-gray-400 hover:text-white border border-gray-800'
            }`}
          >
            {track}
          </button>
        ))}

        <div className="ml-auto flex items-center gap-2">
          {bookmarkedSessionIds.length > 0 && (
            <div className="text-xs font-mono text-amber-400 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded-md">
              ★ {bookmarkedSessionIds.length} Saved
            </div>
          )}
          <a
            href={
              bookmarkedSessionIds.length > 0
                ? `/api/schedule/export?ids=${bookmarkedSessionIds.join(',')}`
                : '/api/schedule/export'
            }
            download="ddacc-2026-agenda.ics"
            className="text-xs font-mono text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/30 px-2.5 py-1 rounded-md transition-colors flex items-center gap-1"
            title="Download iCalendar file for Apple Calendar, Google Calendar, or Outlook"
          >
            <span>📅</span>
            <span>{bookmarkedSessionIds.length > 0 ? 'Export Saved (.ics)' : 'Export Full Schedule (.ics)'}</span>
          </a>
        </div>
      </div>

      {/* Schedule Container */}
      <div className="bg-gray-950/80 border border-gray-800/80 rounded-2xl p-6 md:p-8 backdrop-blur-sm min-h-[420px]">
        {currentDayData && (
          <div className="mb-6 pb-4 border-b border-gray-800/80 flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{currentDayData.theme}</h3>
              <p className="text-cyan-400 text-xs font-mono mt-1">
                {new Date(currentDayData.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })} • Huntington Place Detroit
              </p>
            </div>
            <div className="text-xs text-gray-500 font-mono">
              Showing {sessions.length} scheduled program{sessions.length === 1 ? '' : 's'}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-500">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-mono text-xs">Querying schedule index...</p>
          </div>
        ) : sessions.length > 0 ? (
          <div className="grid gap-4">
            {sessions.map((session) => {
              const isBookmarked = bookmarkedSessionIds.includes(session.id);
              return (
                <div
                  key={session.id}
                  onClick={() => setActiveSessionModal(session)}
                  className="group relative flex flex-col md:flex-row gap-4 bg-gray-900/60 hover:bg-gray-900 border border-gray-800/90 hover:border-cyan-500/50 p-5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-cyan-950/20"
                >
                  {/* Time column */}
                  <div className="md:w-36 flex-shrink-0 flex md:flex-col justify-between md:justify-start gap-1">
                    <span className="text-cyan-300 font-mono text-sm font-semibold">
                      {session.startTime} - {session.endTime}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">{session.location}</span>
                  </div>

                  {/* Details column */}
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-950/90 text-blue-300 border border-blue-500/30">
                        {session.track}
                      </span>
                      {session.level && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-gray-800 text-gray-300">
                          {session.level}
                        </span>
                      )}
                    </div>
                    <h4 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {session.title}
                    </h4>
                    <p className="text-gray-400 text-sm mt-1 leading-relaxed line-clamp-2">
                      {session.description}
                    </p>
                    {session.speakers && session.speakers.length > 0 && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400 font-mono">
                        <span className="text-gray-500">Speakers:</span>
                        <span className="text-gray-300">{session.speakers.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  {/* Bookmark CTA */}
                  <div className="flex md:flex-col items-center justify-between md:justify-start gap-2">
                    <button
                      onClick={(e) => toggleBookmark(session.id, e)}
                      title={isBookmarked ? 'Remove from Agenda' : 'Add to Agenda'}
                      aria-label="Toggle Bookmark"
                      className={`p-2 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-gray-800 text-gray-400 border-gray-700 hover:text-amber-300 hover:border-gray-600'
                      }`}
                    >
                      ★
                    </button>
                    <span className="text-[11px] text-cyan-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      Details →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-base font-semibold text-gray-400">No sessions match your filter criteria.</p>
            <p className="text-xs text-gray-600 mt-1">Try clearing your search query or switching to All Tracks.</p>
          </div>
        )}
      </div>

      {/* Session Modal Preview */}
      {activeSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-gray-900 border border-cyan-500/30 rounded-2xl max-w-lg w-full p-6 text-gray-200 shadow-2xl relative">
            <button
              onClick={() => setActiveSessionModal(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white font-mono text-sm"
              aria-label="Close Modal"
            >
              ✕
            </button>
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-500/30">
                {activeSessionModal.track}
              </span>
              <span className="text-xs font-mono text-cyan-400">
                {activeSessionModal.startTime} - {activeSessionModal.endTime}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{activeSessionModal.title}</h3>
            <p className="text-sm font-mono text-gray-400 mb-4">Location: {activeSessionModal.location}</p>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">{activeSessionModal.description}</p>
            {activeSessionModal.speakers && (
              <div className="border-t border-gray-800 pt-4 mb-6">
                <span className="text-xs font-mono uppercase text-gray-400 block mb-1">Speakers</span>
                <span className="text-sm font-semibold text-white">{activeSessionModal.speakers.join(', ')}</span>
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  toggleBookmark(activeSessionModal.id, e);
                  setActiveSessionModal(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition-colors"
              >
                {bookmarkedSessionIds.includes(activeSessionModal.id)
                  ? 'Remove from Agenda'
                  : 'Add to My Agenda'}
              </button>
              <button
                onClick={() => setActiveSessionModal(null)}
                className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg text-sm transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
