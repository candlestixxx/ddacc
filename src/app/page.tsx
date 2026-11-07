'use client';

import React, { useState } from 'react';
import Schedule from '@/components/Schedule';
import ArtistPortal from '@/components/ArtistPortal';
import DigitalWall from '@/components/DigitalWall';
import VenueMap from '@/components/VenueMap';
import BadgePassModal from '@/components/BadgePassModal';
import Tooltip from '@/components/Tooltip';
import { soundFx } from '@/lib/audio';

export default function Home() {
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);

  return (
    <div className="flex flex-col items-center min-h-screen text-gray-100">
      <BadgePassModal
        isOpen={isBadgeModalOpen}
        onClose={() => setIsBadgeModalOpen(false)}
      />
      {/* Hero Section with High-Impact Value Hierarchy */}
      <section className="relative w-full py-20 md:py-28 overflow-hidden bg-gradient-to-b from-blue-950/40 via-purple-950/20 to-black flex flex-col items-center px-4 border-b border-gray-800/80">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>MAY 15–17, 2026 • HUNTINGTON PLACE DETROIT & VIRTUAL</span>
          <Tooltip content="Physical pass gives access to Detroit Huntington Place exhibition halls; virtual pass includes WebRTC live canvas streaming." />
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-center max-w-5xl leading-tight mb-6">
          Detroit Digital Artist <br className="hidden md:inline" />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Convention & Conference
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 max-w-3xl text-center leading-relaxed mb-10 font-light">
          Bridging Michigan’s vibrant creative community and high-tech craft. Uniting concept artists, 3D sculptors, XR innovators, and creative coders under <span className="font-semibold text-cyan-300">The Love Collective</span>.
        </p>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-14">
          <a
            href="#schedule"
            onClick={() => soundFx.playClick()}
            className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-900/40 flex items-center gap-2"
          >
            <span>📅 Browse Schedule</span>
          </a>
          <button
            onClick={() => {
              soundFx.playChime();
              setIsBadgeModalOpen(true);
            }}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-cyan-900/30 flex items-center gap-2"
          >
            <span>🎫 Claim Digital Pass</span>
          </button>
          <a
            href="#apply"
            onClick={() => soundFx.playClick()}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold text-sm transition-all shadow-lg shadow-pink-900/30 flex items-center gap-2"
          >
            <span>✨ Apply as Creator / Speaker</span>
          </a>
          <a
            href="#digital-wall"
            onClick={() => soundFx.playClick()}
            className="px-6 py-3.5 rounded-xl bg-gray-900/90 hover:bg-gray-800 text-gray-200 border border-gray-700 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <span>🎨 Live Collaborative Canvas</span>
          </a>
          <a
            href="#venue-map"
            onClick={() => soundFx.playClick()}
            className="px-6 py-3.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-200 border border-cyan-700/60 font-semibold text-sm transition-all flex items-center gap-2"
          >
            <span>🗺️ Huntington Place Floorplan</span>
          </a>
        </div>

        {/* High-Value Live Stats Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl w-full">
          {[
            { label: 'Sessions', count: '10 Sessions', sub: '5 Focused Tracks', tip: 'Spanning generative AI ethics to Blender sculpting' },
            { label: 'Artist Alley', count: '42 Creators', sub: 'Tables & Showcases', tip: 'Juried independent illustrators, animators, and physical merch' },
            { label: 'Registered', count: '388+', sub: 'Community Members', tip: 'Registered attendees across in-person & global streams' },
            { label: 'Wall Status', count: 'Live & Open', sub: 'Huntington Place Screen', tip: 'Direct projection sync to Main Stage screens' }
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-gray-950/70 border border-gray-800 p-4 rounded-xl text-left backdrop-blur-sm relative"
            >
              <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center justify-between">
                <span>{stat.label}</span>
                <Tooltip content={stat.tip} />
              </div>
              <div className="text-xl font-bold text-white mt-1">{stat.count}</div>
              <div className="text-xs text-blue-400 mt-0.5">{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* High-Value Sticky Section Sub-Navigation */}
      <nav aria-label="Section quick navigation" className="sticky top-0 z-40 w-full bg-gray-950/90 border-b border-gray-800 backdrop-blur-md px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs font-mono overflow-x-auto gap-4">
          <span className="text-gray-400 hidden sm:inline">JUMP TO SECTION:</span>
          <div className="flex items-center gap-5 text-gray-400 whitespace-nowrap">
            <a href="#mission" className="hover:text-cyan-300 transition-colors">01. Vision & Ethos</a>
            <span>•</span>
            <a href="#tracks" className="hover:text-cyan-300 transition-colors">02. Curated Tracks</a>
            <span>•</span>
            <a href="#schedule" className="hover:text-cyan-300 transition-colors">03. Program Schedule</a>
            <span>•</span>
            <a href="#apply" className="hover:text-cyan-300 transition-colors">04. Artist Portal</a>
            <span>•</span>
            <a href="#venue-map" className="hover:text-cyan-300 transition-colors">05. Venue Floorplan</a>
            <span>•</span>
            <a href="#digital-wall" className="hover:text-cyan-300 transition-colors">06. Digital Wall</a>
          </div>
          <a
            href="#apply"
            className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-semibold text-xs transition-colors ml-auto"
          >
            Apply Now
          </a>
        </div>
      </nav>

      {/* Main Consolidated Dashboard Content Body */}
      <div className="w-full max-w-6xl px-4 py-16 space-y-24">

        {/* Section 1: Ethos & The Love Collective */}
        <section id="mission" className="scroll-mt-20">
          <div className="bg-gradient-to-r from-blue-950/40 via-purple-950/20 to-gray-900 border border-cyan-500/20 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/30 text-xs font-mono text-blue-300 mb-4">
                <span>FOUNDATIONAL PILLAR</span>
                <Tooltip content="The Love Collective is the non-hierarchical community governing DDACC and ensuring artist-first economics." />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                The Love Collective Ethos
              </h2>
              <p className="text-gray-300 leading-relaxed text-base md:text-lg mb-6">
                Detroit has always been a city forged in industrial reinvention, techno synthesizer roots, and underground grit. DDACC translates this heritage into the modern digital realm—ensuring creators retain ownership, tools remain accessible, and collaboration replaces gatekeeping.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 font-mono text-xs text-gray-300">
                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800">
                  <div className="text-cyan-400 font-bold mb-1">01. Open Knowledge</div>
                  <div>Workflows, geometry nodes, and production assets shared freely without gatekeeping.</div>
                </div>
                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800">
                  <div className="text-purple-400 font-bold mb-1">02. Creative Equity</div>
                  <div>Transparent artist table fees, student scholarships, and travel grants for Detroit youth.</div>
                </div>
                <div className="bg-gray-950/60 p-4 rounded-xl border border-gray-800">
                  <div className="text-pink-400 font-bold mb-1">03. High-Tech Craft</div>
                  <div>Marrying concept art, shader math, spatial audio, and tactile physical fabrication.</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Curated Convention Tracks */}
        <section id="tracks" className="scroll-mt-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold mb-3">Curated Convention Tracks</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-sm">
              Four specialized tracks designed to connect raw artistic talent with cutting-edge real-time technologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                track: "Love Collective",
                badge: "Community & Equity",
                desc: "Grassroots portfolio reviews, peer critique circles, grant-writing masterclasses, and speed-sculpt duels.",
                color: "border-pink-500/30 hover:border-pink-500"
              },
              {
                track: "Industry & Innovation",
                badge: "Automotive & Games",
                desc: "Real-time production pipelines, USD asset standards, automotive visualization, and studio career panels.",
                color: "border-blue-500/30 hover:border-blue-500"
              },
              {
                track: "Emergent Tools",
                badge: "Workshops & Tech",
                desc: "Hands-on labs in Blender geometry nodes, Unreal Niagara systems, Godot shaders, and open-source stacks.",
                color: "border-cyan-500/30 hover:border-cyan-500"
              },
              {
                track: "Interactive Media",
                badge: "XR & Projection",
                desc: "Detroit techno audiovisual synchronization, TouchDesigner installations, and VR physical gallery spaces.",
                color: "border-purple-500/30 hover:border-purple-500"
              }
            ].map((t, idx) => (
              <div
                key={idx}
                className={`bg-gray-950/80 p-6 rounded-2xl border ${t.color} transition-all shadow-xl backdrop-blur-md flex flex-col justify-between`}
              >
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-2 block">
                    {t.badge}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2">{t.track}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed">{t.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-900 text-[11px] font-mono text-cyan-400">
                  <a href="#schedule" className="hover:underline">View track sessions →</a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Interactive Program Schedule */}
        <section id="schedule" className="scroll-mt-20">
          <Schedule />
        </section>

        {/* Section 4: Artist Alley & Speaker Portal */}
        <section id="apply" className="scroll-mt-20">
          <ArtistPortal />
        </section>

        {/* Section 5: Interactive Venue Floorplan & CAD Navigator */}
        <section id="venue-map" className="scroll-mt-20">
          <VenueMap />
        </section>

        {/* Section 6: Real-Time Collaborative Digital Wall */}
        <section id="digital-wall" className="scroll-mt-20">
          <DigitalWall />
        </section>

      </div>

      {/* Footer with Operational Metrics & Venue Details */}
      <footer className="w-full border-t border-gray-800 bg-gray-950 py-12 px-4 mt-20 text-center text-xs font-mono text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <div className="font-bold text-gray-300 text-sm">DDACC • Detroit Digital Artist Convention & Conference</div>
            <div className="text-gray-500 mt-1">Huntington Place, 1 Washington Blvd, Detroit, MI 48226</div>
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <a href="#mission" className="hover:text-cyan-400">Ethos</a>
            <a href="#schedule" className="hover:text-cyan-400">Schedule</a>
            <a href="#venue-map" className="hover:text-cyan-400">Floorplan</a>
            <a href="#apply" className="hover:text-cyan-400">Exhibitor Intake</a>
            <a href="#digital-wall" className="hover:text-cyan-400">Canvas</a>
          </div>
          <div className="text-right">
            <div>The Love Collective © 2026</div>
            <div className="text-cyan-500 font-semibold mt-1">Platform Version 0.2.0 • Online</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
