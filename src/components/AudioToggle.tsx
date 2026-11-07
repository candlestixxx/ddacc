'use client';

import React, { useState, useEffect } from 'react';
import { soundFx } from '@/lib/audio';

export default function AudioToggle() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    // Synchronize audio preferences via an event listener or subscription pattern
    const handleStorage = () => {
      setEnabled(soundFx.isSoundEnabled());
    };
    window.addEventListener('storage', handleStorage);
    // Queue initial sync
    const timer = setTimeout(() => {
      setEnabled(soundFx.isSoundEnabled());
    }, 0);
    return () => {
      window.removeEventListener('storage', handleStorage);
      clearTimeout(timer);
    };
  }, []);

  const handleToggle = () => {
    const newState = soundFx.toggleSound();
    setEnabled(newState);
  };

  return (
    <button
      onClick={handleToggle}
      className={`px-2.5 py-1 rounded-full text-xs font-mono transition-colors border flex items-center gap-1.5 ${
        enabled
          ? 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60'
          : 'bg-gray-900 border-gray-800 text-gray-500 hover:text-gray-300'
      }`}
      title={enabled ? 'Mute Detroit Synthesizer FX' : 'Enable Detroit Synthesizer FX'}
      aria-label="Toggle Audio Effects"
    >
      <span>{enabled ? '🔊 SFX ON' : '🔇 SFX MUTED'}</span>
    </button>
  );
}
