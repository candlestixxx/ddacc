"use client";

import { useState } from 'react';
import { Schedule as ScheduleType, Session, TrackType } from '@/types';

// Mock Data based on the schema
const mockSchedule: ScheduleType = {
  eventName: "Detroit Digital Artist Convention & Conference (DDACC)",
  days: [
    {
      dayId: 'day-1',
      date: '2026-05-15',
      theme: 'Welcome to the Collective & Industry Fundamentals',
      sessions: [
        {
          id: 's1',
          title: 'Opening Keynote: Setting the Vision',
          startTime: '09:00',
          endTime: '10:30',
          track: 'General',
          location: 'Main Stage',
          description: 'Welcome to DDACC: Setting the Vision for Detroit’s Digital Future & The Love Collective Ethos.'
        },
        {
          id: 's2',
          title: 'The Modern Digital Pipeline',
          startTime: '10:45',
          endTime: '12:15',
          track: 'Industry & Innovation',
          location: 'Room A',
          description: 'From Concept Art to Real-Time Engines.'
        },
        {
          id: 's3',
          title: 'Blender Essentials',
          startTime: '10:45',
          endTime: '12:15',
          track: 'Emergent Tools & Workshops',
          location: 'Lab 1',
          description: 'Intro to 3D Modeling & Lighting.'
        }
      ]
    },
    {
      dayId: 'day-2',
      date: '2026-05-16',
      theme: 'Deep Dives, Emerging Tech & High-Energy Showcase',
      sessions: [
        {
          id: 's4',
          title: 'Emerging Tools & Creative Rights',
          startTime: '10:00',
          endTime: '11:30',
          track: 'Industry & Innovation',
          location: 'Main Stage',
          description: 'Balancing Automation, Ethics, and Human Artistry.'
        },
        {
          id: 's5',
          title: 'Mastering Real-Time VFX',
          startTime: '11:45',
          endTime: '13:15',
          track: 'Emergent Tools & Workshops',
          location: 'Lab 2',
          description: 'Real-Time VFX & Motion Design.'
        }
      ]
    },
    {
      dayId: 'day-3',
      date: '2026-05-17',
      theme: 'Impact, Future & Collaboration',
      sessions: [
        {
          id: 's6',
          title: 'Grant Writing & Local Funding',
          startTime: '10:30',
          endTime: '12:00',
          track: 'Love Collective',
          location: 'Room B',
          description: 'Local Funding for Digital Artists.'
        }
      ]
    }
  ]
};

const allTracks: TrackType[] = [
  'Love Collective',
  'Industry & Innovation',
  'Emergent Tools & Workshops',
  'Interactive & Experimental Media',
  'General'
];

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState<'day-1' | 'day-2' | 'day-3'>('day-1');
  const [selectedTrack, setSelectedTrack] = useState<TrackType | 'All'>('All');

  const currentDayData = mockSchedule.days.find(d => d.dayId === selectedDay);

  const filteredSessions = currentDayData?.sessions.filter(session => {
    if (selectedTrack === 'All') return true;
    return session.track === selectedTrack;
  }) || [];

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Event Schedule</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">Explore sessions, workshops, and meetups across our 3-day event. Filter by day and track to build your perfect DDACC experience.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        {/* Day Filters */}
        <div className="flex bg-gray-800 rounded-lg p-1 w-full md:w-auto">
          {mockSchedule.days.map((day) => (
            <button
              key={day.dayId}
              onClick={() => setSelectedDay(day.dayId)}
              className={`flex-1 md:flex-none px-6 py-2 rounded-md font-medium transition-colors ${
                selectedDay === day.dayId
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              Day {day.dayId.split('-')[1]}
            </button>
          ))}
        </div>

        {/* Track Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTrack('All')}
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              selectedTrack === 'All'
                ? 'bg-gray-100 text-gray-900 border-gray-100'
                : 'border-gray-700 text-gray-400 hover:border-gray-500'
            }`}
          >
            All Tracks
          </button>
          {allTracks.map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-4 py-2 rounded-full text-sm font-medium border ${
                selectedTrack === track
                  ? 'bg-blue-900 border-blue-500 text-blue-200'
                  : 'border-gray-700 text-gray-400 hover:border-gray-500'
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Display */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 md:p-8 min-h-[400px]">
        {currentDayData && (
          <div className="mb-8 border-b border-gray-800 pb-4">
            <h3 className="text-2xl font-bold text-gray-100">{currentDayData.theme}</h3>
            <p className="text-blue-400 mt-1">{new Date(currentDayData.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
          </div>
        )}

        {filteredSessions.length > 0 ? (
          <div className="space-y-6">
            {filteredSessions.map((session) => (
              <div key={session.id} className="flex flex-col md:flex-row gap-4 bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="md:w-32 flex-shrink-0 text-gray-400 font-mono">
                  {session.startTime} - {session.endTime}
                </div>
                <div className="flex-grow">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/50 text-blue-300 border border-blue-800">
                      {session.track}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                      {session.location}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold mb-2">{session.title}</h4>
                  {session.description && (
                    <p className="text-gray-400 text-sm leading-relaxed">{session.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-48 text-gray-500">
            No sessions found for the selected track on this day.
          </div>
        )}
      </div>
    </div>
  );
}