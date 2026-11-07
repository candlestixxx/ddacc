import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import SystemTrayDock from '@/components/SystemTrayDock';
import AudioToggle from '@/components/AudioToggle';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'DDACC 2026 | Detroit Digital Artist Convention & Conference',
  description: 'To empower, elevate, and connect digital creators across Detroit and beyond through The Love Collective.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} bg-gray-950 text-gray-100 min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black`}>
        {/* Top Header */}
        <header className="sticky top-0 z-50 w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-2 group">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center font-black text-white text-base shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                  DD
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                    DDACC <span className="text-xs font-mono font-normal text-cyan-400 bg-cyan-950/80 px-1.5 py-0.2 rounded border border-cyan-800/50">2026</span>
                  </span>
                  <span className="text-[10px] text-gray-400 tracking-wider font-mono uppercase">
                    Detroit Digital Artist Convention
                  </span>
                </div>
              </a>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-gray-300">
              <a href="#mission" className="hover:text-cyan-400 transition-colors">Vision & Ethos</a>
              <a href="#tracks" className="hover:text-cyan-400 transition-colors">Tracks</a>
              <a href="#schedule" className="hover:text-cyan-400 transition-colors">Program Schedule</a>
              <a href="#apply" className="hover:text-cyan-400 transition-colors">Artist Alley & Talks</a>
              <a href="#digital-wall" className="hover:text-cyan-400 transition-colors">Live Canvas</a>
            </nav>

            <div className="flex items-center gap-3">
              {/* Audio Synthesizer Toggle */}
              <AudioToggle />

              {/* Header Status Beacon */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-900 border border-gray-800 rounded-full text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-gray-300">SYSTEM ONLINE</span>
                <span className="text-[10px] text-gray-500">ℹ</span>
              </div>
              <a
                href="#apply"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-600/20"
              >
                Apply
              </a>
            </div>
          </div>
        </header>

        {/* Main Single-Page Command Dashboard */}
        <main className="flex-1 w-full">
          {children}
        </main>

        {/* Global Floating System Operations Tray */}
        <SystemTrayDock />
      </body>
    </html>
  );
}
