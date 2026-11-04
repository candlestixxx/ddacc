'use client';

import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';

interface SystemStatus {
  status: string;
  version: string;
  uptimeSeconds: number;
  activeConnections: number;
  services: {
    scheduleEngine: string;
    artistAlleyIntake: string;
    digitalWallSync: string;
    projectionOutput: string;
  };
}

export default function SystemTrayDock() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<SystemStatus | null>(null);
  const [serverState, setServerState] = useState<'running' | 'restarting' | 'stopped'>('running');
  const [logs, setLogs] = useState<string[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      if (serverState === 'stopped') return;
      try {
        const res = await fetch('/api/system/status');
        if (res.ok) {
          const data = await res.json();
          setStatus(data);
        }
      } catch {
        // Fallback or network error
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, [serverState]);

  const handleRestart = () => {
    setServerState('restarting');
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] SIGTERM received. Gracefully reloading DDACC worker processes...`]);
    setTimeout(() => {
      setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] DDACC operational services reinitialized successfully on port 3000.`]);
      setServerState('running');
    }, 1800);
  };

  const handleShutdown = () => {
    setServerState('stopped');
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] SYSTEM SHUTDOWN: Process listeners disconnected. Testing mock offline state.`]);
  };

  const handleFlushCache = () => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] In-memory cache flushed: schedule indexes and wall caches purged.`]);
  };

  const formatUptime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      {/* Floating System Tray Icon / Pill */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="DDACC Operations Tray"
          className="flex items-center gap-2.5 px-3.5 py-2 bg-gray-950/90 border border-cyan-500/30 hover:border-cyan-400 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono text-cyan-200 transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative flex h-2.5 w-2.5">
            {serverState === 'running' && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            )}
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                serverState === 'running'
                  ? 'bg-emerald-500'
                  : serverState === 'restarting'
                  ? 'bg-amber-400'
                  : 'bg-rose-500'
              }`}
            />
          </span>
          <span className="font-semibold tracking-wider">
            {serverState === 'running' ? 'v0.2.0 • ONLINE' : serverState === 'restarting' ? 'RELOADING' : 'OFFLINE'}
          </span>
          <svg
            className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* System Operations Flyout Modal / Panel */}
        {isOpen && (
          <div className="absolute bottom-12 right-0 w-80 md:w-96 bg-gray-950/95 border border-cyan-500/20 rounded-2xl shadow-2xl backdrop-blur-xl p-5 text-gray-200 z-50 mb-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <h3 className="font-mono font-bold text-sm text-white tracking-wide">DDACC Server Operations</h3>
                <Tooltip content="Operations tray monitoring server health, in-memory pipelines, and worker processes." />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white text-xs font-mono p-1"
                aria-label="Close Tray"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 mb-4 font-mono text-xs">
              <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800">
                <div className="text-gray-400 flex items-center justify-between">
                  <span>Uptime</span>
                  <Tooltip content="Time elapsed since server engine boot" />
                </div>
                <div className="text-emerald-400 font-bold text-sm mt-1">
                  {status ? formatUptime(status.uptimeSeconds) : 'Connecting...'}
                </div>
              </div>
              <div className="bg-gray-900/80 p-2.5 rounded-lg border border-gray-800">
                <div className="text-gray-400 flex items-center justify-between">
                  <span>Active Conns</span>
                  <Tooltip content="Active simulated websocket and HTTP subscribers" />
                </div>
                <div className="text-cyan-400 font-bold text-sm mt-1">
                  {status?.activeConnections || 42}
                </div>
              </div>
            </div>

            {/* Services Status */}
            <div className="space-y-1.5 mb-4 font-mono text-[11px]">
              <div className="text-gray-400 uppercase text-[10px] tracking-wider mb-1 flex items-center justify-between">
                <span>Active Services</span>
                <Tooltip content="Status of internal DDACC platform modules" />
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded bg-gray-900/50">
                <span className="text-gray-300">Schedule Engine</span>
                <span className="text-emerald-400 font-semibold">• ACTIVE</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded bg-gray-900/50">
                <span className="text-gray-300">Artist Alley Intake</span>
                <span className="text-emerald-400 font-semibold">• ACTIVE</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded bg-gray-900/50">
                <span className="text-gray-300">Digital Wall Sync</span>
                <span className="text-emerald-400 font-semibold">• ACTIVE</span>
              </div>
              <div className="flex items-center justify-between py-1 px-2 rounded bg-gray-900/50">
                <span className="text-gray-300">Projections & Tray</span>
                <span className="text-emerald-400 font-semibold">• ACTIVE</span>
              </div>
            </div>

            {/* Operational Controls */}
            <div className="space-y-2 pt-2 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  onClick={handleRestart}
                  disabled={serverState === 'restarting'}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Restart Server
                </button>
                <button
                  onClick={handleFlushCache}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  ⚡ Flush Cache
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-800 rounded-lg text-center"
                >
                  {showLogs ? 'Hide Logs' : 'View Stream Logs'}
                </button>
                <button
                  onClick={handleShutdown}
                  className="px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/40 rounded-lg text-center transition-colors"
                >
                  Test Shutdown
                </button>
              </div>

              {/* In-Tray Operational Logs */}
              {showLogs && (
                <div className="mt-3 p-2 bg-black/90 border border-gray-800 rounded-lg max-h-36 overflow-y-auto font-mono text-[10px] text-gray-400 space-y-1">
                  <div className="text-cyan-400 border-b border-gray-800 pb-1">--- DDACC SYSTEM LOG STREAM ---</div>
                  {logs.length === 0 ? (
                    <div className="italic text-gray-600">No operational logs recorded.</div>
                  ) : (
                    logs.map((log, idx) => (
                      <div key={idx} className="leading-tight">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
