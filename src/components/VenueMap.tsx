'use client';

import React, { useState, useEffect } from 'react';
import { VenueFloor, VenueZone } from '@/types';
import Tooltip from './Tooltip';
import { soundFx } from '@/lib/audio';

export default function VenueMap() {
  const [floors, setFloors] = useState<VenueFloor[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<1 | 2>(1);
  const [activeZone, setActiveZone] = useState<VenueZone | null>(null);
  const [overallStats, setOverallStats] = useState({
    totalCapacity: 3470,
    totalOccupancy: 2291,
    occupancyRate: 66
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVenueData() {
      try {
        const res = await fetch('/api/venue');
        if (res.ok) {
          const data = await res.json();
          setFloors(data.floors || []);
          setOverallStats({
            totalCapacity: data.totalCapacity || 3470,
            totalOccupancy: data.totalOccupancy || 2291,
            occupancyRate: data.occupancyRate || 66
          });
          const initialFloor = (data.floors || []).find((f: VenueFloor) => f.level === 1);
          if (initialFloor && initialFloor.zones.length > 0) {
            setActiveZone(initialFloor.zones[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load venue floorplan data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchVenueData();
  }, []);

  const currentFloor = floors.find((f) => f.level === selectedLevel);

  const handleSelectLevel = (lvl: 1 | 2) => {
    soundFx.playClick();
    setSelectedLevel(lvl);
    const targetFloor = floors.find((f) => f.level === lvl);
    if (targetFloor && targetFloor.zones.length > 0) {
      setActiveZone(targetFloor.zones[0]);
    }
  };

  const handleZoneClick = (zone: VenueZone) => {
    soundFx.playSubClick();
    setActiveZone(zone);
  };

  const getTrackColor = (track?: string) => {
    switch (track) {
      case 'Love Collective':
        return 'border-pink-500/50 bg-pink-950/20 text-pink-300';
      case 'Industry & Innovation':
        return 'border-blue-500/50 bg-blue-950/20 text-blue-300';
      case 'Emergent Tools & Workshops':
        return 'border-cyan-500/50 bg-cyan-950/20 text-cyan-300';
      case 'Interactive & Experimental Media':
        return 'border-purple-500/50 bg-purple-950/20 text-purple-300';
      default:
        return 'border-emerald-500/50 bg-emerald-950/20 text-emerald-300';
    }
  };

  return (
    <div className="w-full bg-gray-950/90 border border-gray-800 rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Background Accent Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Venue Overview */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-gray-800/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-xs font-mono text-cyan-300 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>HUNTINGTON PLACE CONVENTION COMPLEX</span>
            <Tooltip content="Directly connected to Detroit People Mover and Detroit Riverwalk. 1 Washington Blvd, Detroit, MI." />
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Interactive Venue Floorplan
          </h2>
          <p className="text-gray-400 text-sm mt-1 max-w-xl">
            Live hall telemetry, stage capacities, turnstile traffic, and track zone mapping across Huntington Place.
          </p>
        </div>

        {/* Global Occupancy Card */}
        <div className="flex items-center gap-4 bg-gray-900/80 border border-gray-800 px-5 py-3 rounded-2xl">
          <div>
            <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <span>Venue Density</span>
              <Tooltip content="Live turnstile aggregate count calculated from hall RFID/QR badge checkpoints." />
            </div>
            <div className="text-2xl font-black text-cyan-400 mt-0.5">
              {overallStats.occupancyRate}%
            </div>
          </div>
          <div className="h-10 w-[1px] bg-gray-800" />
          <div className="text-right">
            <div className="text-xs text-gray-300 font-mono font-medium">
              {overallStats.totalOccupancy} / {overallStats.totalCapacity}
            </div>
            <div className="text-[11px] text-gray-500 font-mono">Present on Floor</div>
          </div>
        </div>
      </div>

      {/* Floor Level Toggle Tabs */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => handleSelectLevel(1)}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
            selectedLevel === 1
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400/50'
              : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <span>Level 1: Main Arena & Exhibition</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30">Ground Concourse</span>
        </button>

        <button
          onClick={() => handleSelectLevel(2)}
          className={`px-5 py-2.5 rounded-xl font-mono text-xs font-semibold transition-all flex items-center gap-2 ${
            selectedLevel === 2
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400/50'
              : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
          }`}
        >
          <span>Level 2: Ballrooms & Workshops</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/30">Upper Labs</span>
        </button>
      </div>

      {/* Main Grid: Architectural Floorplan View + Zone Detail Panel */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Architectural Layout Map (8 cols) */}
        <div className="lg:col-span-8 bg-gray-900/60 border border-gray-800 rounded-2xl p-4 md:p-6 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-gray-400 mb-4 pb-2 border-b border-gray-800">
            <span>{currentFloor ? currentFloor.name : 'Loading Floorplan...'}</span>
            <span className="text-[11px] text-gray-500">Click a zone to inspect telemetry</span>
          </div>

          {isLoading ? (
            <div className="h-96 flex items-center justify-center font-mono text-sm text-cyan-400 animate-pulse">
              Syncing Huntington Place CAD telemetry...
            </div>
          ) : (
            <div className="relative w-full aspect-[800/480] bg-gray-950/80 rounded-xl border border-gray-800/80 p-2 overflow-hidden shadow-inner">
              {/* Floorplan SVG Render */}
              <svg
                viewBox="0 0 800 480"
                className="w-full h-full select-none"
              >
                {/* Architectural Grid Lines */}
                <defs>
                  <pattern id="cad-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="800" height="480" fill="url(#cad-grid)" />

                {/* Zones */}
                {currentFloor?.zones.map((zone) => {
                  const isSelected = activeZone?.id === zone.id;
                  const occPercent = Math.round((zone.currentOccupancy / zone.capacity) * 100);

                  return (
                    <g
                      key={zone.id}
                      onClick={() => handleZoneClick(zone)}
                      className="cursor-pointer transition-all duration-300"
                    >
                      {/* Zone Bounding Box */}
                      <rect
                        x={zone.coordinates.x}
                        y={zone.coordinates.y}
                        width={zone.coordinates.width}
                        height={zone.coordinates.height}
                        rx="12"
                        className={`transition-all duration-200 ${
                          isSelected
                            ? 'fill-cyan-950/70 stroke-cyan-400 stroke-2 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                            : 'fill-gray-900/80 hover:fill-gray-800/80 stroke-gray-700 hover:stroke-cyan-500/50 stroke-1'
                        }`}
                      />

                      {/* Header Badge in CAD box */}
                      <rect
                        x={zone.coordinates.x + 12}
                        y={zone.coordinates.y + 12}
                        width="80"
                        height="20"
                        rx="4"
                        fill="rgba(0,0,0,0.5)"
                      />
                      <text
                        x={zone.coordinates.x + 18}
                        y={zone.coordinates.y + 26}
                        fill="#38bdf8"
                        fontSize="10"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {zone.code}
                      </text>

                      {/* Zone Name */}
                      <text
                        x={zone.coordinates.x + 16}
                        y={zone.coordinates.y + 56}
                        fill="#ffffff"
                        fontSize="14"
                        fontFamily="sans-serif"
                        fontWeight="bold"
                      >
                        {zone.name}
                      </text>

                      {/* Track Affinity */}
                      <text
                        x={zone.coordinates.x + 16}
                        y={zone.coordinates.y + 76}
                        fill="#94a3b8"
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        Track: {zone.highlightTrack || 'General'}
                      </text>

                      {/* Capacity Meter Bar */}
                      <rect
                        x={zone.coordinates.x + 16}
                        y={zone.coordinates.y + 104}
                        width={zone.coordinates.width - 32}
                        height="8"
                        rx="4"
                        fill="#1e293b"
                      />
                      <rect
                        x={zone.coordinates.x + 16}
                        y={zone.coordinates.y + 104}
                        width={(zone.coordinates.width - 32) * (occPercent / 100)}
                        height="8"
                        rx="4"
                        fill={occPercent > 85 ? '#f43f5e' : occPercent > 65 ? '#fbbf24' : '#10b981'}
                      />

                      {/* Capacity Text */}
                      <text
                        x={zone.coordinates.x + 16}
                        y={zone.coordinates.y + 130}
                        fill="#cbd5e1"
                        fontSize="11"
                        fontFamily="monospace"
                      >
                        Occupancy: {zone.currentOccupancy} / {zone.capacity} ({occPercent}%)
                      </text>

                      {/* Interactive Pulse on Selected */}
                      {isSelected && (
                        <circle
                          cx={zone.coordinates.x + zone.coordinates.width - 24}
                          cy={zone.coordinates.y + 24}
                          r="6"
                          fill="#22d3ee"
                          className="animate-ping"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Zone Detail Panel (4 cols) */}
        <div className="lg:col-span-4 bg-gray-900/60 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between min-h-[460px]">
          {activeZone ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-md bg-gray-950 border border-gray-800 text-cyan-400 font-bold">
                  {activeZone.code}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${getTrackColor(activeZone.highlightTrack)}`}>
                  {activeZone.highlightTrack || 'General'}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{activeZone.name}</h3>
              <p className="text-gray-300 text-xs leading-relaxed mb-6">
                {activeZone.description}
              </p>

              {/* Occupancy Indicator */}
              <div className="bg-gray-950/80 p-4 rounded-xl border border-gray-800/80 mb-6">
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="text-gray-400">Current Occupancy</span>
                  <span className="text-white font-bold">
                    {Math.round((activeZone.currentOccupancy / activeZone.capacity) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      (activeZone.currentOccupancy / activeZone.capacity) > 0.85
                        ? 'bg-rose-500'
                        : (activeZone.currentOccupancy / activeZone.capacity) > 0.65
                        ? 'bg-amber-400'
                        : 'bg-emerald-400'
                    }`}
                    style={{
                      width: `${(activeZone.currentOccupancy / activeZone.capacity) * 100}%`
                    }}
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-gray-500">
                  <span>Present: {activeZone.currentOccupancy}</span>
                  <span>Max Capacity: {activeZone.capacity}</span>
                </div>
              </div>

              {/* Station Features & Amenities */}
              <div>
                <h4 className="text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-3 flex items-center justify-between">
                  <span>Room Amenities & Specs</span>
                  <Tooltip content="Physical staging hardware and infrastructure provisioned at Huntington Place." />
                </h4>
                <div className="space-y-2">
                  {activeZone.features.map((feat, i) => (
                    <div
                      key={i}
                      className="text-xs font-mono text-gray-300 bg-gray-950/50 border border-gray-800/60 px-3 py-2 rounded-lg flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-center py-20 font-mono text-xs">
              Select a zone from the floorplan to inspect telemetry.
            </div>
          )}

          <div className="mt-8 pt-4 border-t border-gray-800 flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span>Direct Turnstile Link</span>
            <a href="#schedule" onClick={() => soundFx.playClick()} className="text-cyan-400 hover:underline">
              View Schedule Sessions →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
