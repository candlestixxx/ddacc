'use client';

import { useEffect, useState } from 'react';

export default function PWARegister() {
  const [isOffline, setIsOffline] = useState(() => {
    if (typeof navigator !== 'undefined') {
      return !navigator.onLine;
    }
    return false;
  });

  useEffect(() => {
    // Register Service Worker if supported
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('DDACC Service Worker registered successfully:', reg.scope);
          })
          .catch((err) => {
            console.warn('DDACC Service Worker registration failed:', err);
          });
      });
    }

    // Monitor connectivity status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-amber-500/90 text-black px-4 py-1.5 text-center text-xs font-mono font-semibold flex items-center justify-center gap-2 backdrop-blur-md shadow-lg">
      <span className="w-2 h-2 rounded-full bg-black animate-ping" />
      <span>OFFLINE MODE - Serving cached schedule, venue maps, and offline data from Huntington Place cache.</span>
    </div>
  );
}
