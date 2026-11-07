'use client';

import React, { useState } from 'react';
import { BadgePass, BadgeRole } from '@/types';
import { soundFx } from '@/lib/audio';
import Tooltip from './Tooltip';

interface BadgePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BadgePassModal({ isOpen, onClose }: BadgePassModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<BadgeRole>('Community Attendee');
  const [tier, setTier] = useState<BadgePass['tier']>('Weekend Pass');
  const [affiliation, setAffiliation] = useState('');
  const [badge, setBadge] = useState<BadgePass | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setCheckInStatus(null);
    try {
      const res = await fetch('/api/badge/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'issue',
          attendeeName: name,
          role,
          tier,
          affiliation
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setBadge(data.badge);
        soundFx.playChime();
      }
    } catch (err) {
      console.error('Failed to issue badge:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTestCheckIn = async () => {
    if (!badge) return;
    setLoading(true);
    try {
      const res = await fetch('/api/badge/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'checkin',
          passId: badge.passId
        })
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setBadge(data.badge);
        setCheckInStatus('Checked in at Huntington Place Hall C!');
        soundFx.playDetroitBeep(880, 'triangle', 0.15);
      } else {
        setCheckInStatus(data.message || 'Check-in failed');
      }
    } catch {
      setCheckInStatus('Connection error during check-in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-950 border border-gray-800 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => {
            soundFx.playClick();
            onClose();
          }}
          className="absolute top-5 right-5 text-gray-400 hover:text-white text-lg font-mono"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
            DIGITAL CREDENTIAL
          </span>
          <Tooltip content="Digital passes are cryptographically signed and scanned at Huntington Place entrance turnstiles." />
        </div>

        <h3 className="text-2xl font-extrabold text-white tracking-tight mb-1">
          {badge ? 'Your DDACC 2026 Digital Pass' : 'Claim Attendee Digital Pass'}
        </h3>
        <p className="text-xs text-gray-400 mb-6">
          Access keynote stages, artist alley duels, and networking lounges.
        </p>

        {!badge ? (
          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Attendee Name or Alias *</label>
              <input
                required
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jordan Miles"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Pass Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as BadgeRole)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Community Attendee">Community Attendee</option>
                  <option value="Creator / Exhibitor">Creator / Exhibitor</option>
                  <option value="Speaker">Speaker</option>
                  <option value="VIP Pass">VIP Pass</option>
                  <option value="Staff / Volunteer">Staff / Volunteer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1">Access Tier</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value as BadgePass['tier'])}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Weekend Pass">Weekend Pass</option>
                  <option value="All-Access">All-Access (Keynotes + Workshops)</option>
                  <option value="Day Pass">Single Day Pass</option>
                  <option value="Exhibitor Booth">Exhibitor Booth Table</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-300 mb-1">Studio / Affiliation (Optional)</label>
              <input
                type="text"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="e.g. Detroit Pixel Studio / Independent"
                className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="w-full py-3 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold rounded-xl transition-all font-mono text-xs tracking-wider"
            >
              {loading ? 'Synthesizing Pass...' : 'Generate Verified Pass →'}
            </button>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Cyber Credential Card */}
            <div className="relative bg-gradient-to-b from-gray-900 via-gray-950 to-black p-6 rounded-2xl border-2 border-cyan-500/50 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-800">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">DDACC 2026 OFFICIAL BADGE</div>
                  <div className="text-xs text-gray-500">Huntington Place • Detroit, MI</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                  badge.checkedIn
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}>
                  {badge.checkedIn ? '✓ CHECKED IN' : 'READY TO SCAN'}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-2">
                  <h4 className="text-xl font-black text-white tracking-tight">{badge.attendeeName}</h4>
                  <div className="text-xs font-mono text-cyan-300 font-semibold">{badge.role}</div>
                  {badge.affiliation && (
                    <div className="text-xs text-gray-400 mt-0.5">{badge.affiliation}</div>
                  )}
                  <div className="mt-3 text-[11px] font-mono text-gray-500 space-y-0.5">
                    <div>TIER: <span className="text-gray-300 font-bold">{badge.tier}</span></div>
                    <div>PASS ID: <span className="text-cyan-400">{badge.passId}</span></div>
                    <div>SIG: <span className="text-gray-400 font-mono text-[9px]">{badge.verificationHash}</span></div>
                  </div>
                </div>

                {/* SVG QR Code Simulation */}
                <div className="col-span-1 flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-inner">
                  <svg className="w-20 h-20" viewBox="0 0 100 100" fill="black">
                    <rect x="0" y="0" width="30" height="30" fill="black" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="black" />

                    <rect x="70" y="0" width="30" height="30" fill="black" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="black" />

                    <rect x="0" y="70" width="30" height="30" fill="black" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="black" />

                    <rect x="35" y="10" width="10" height="10" fill="black" />
                    <rect x="50" y="10" width="10" height="10" fill="black" />
                    <rect x="35" y="35" width="30" height="30" fill="black" />
                    <rect x="70" y="45" width="15" height="15" fill="black" />
                    <rect x="45" y="75" width="15" height="15" fill="black" />
                    <rect x="75" y="75" width="20" height="20" fill="black" />
                  </svg>
                  <span className="text-[8px] font-mono text-black font-bold mt-1">SCAN AT DOOR</span>
                </div>
              </div>
            </div>

            {checkInStatus && (
              <div className="p-3 bg-cyan-950/60 border border-cyan-500/30 rounded-xl text-center text-xs font-mono text-cyan-300">
                {checkInStatus}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleTestCheckIn}
                disabled={loading || badge.checkedIn}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-xl transition-colors"
              >
                {badge.checkedIn ? 'Badge Verified' : 'Simulate Turnstile Scan'}
              </button>

              <button
                onClick={() => {
                  soundFx.playClick();
                  setBadge(null);
                }}
                className="px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-gray-300 font-mono text-xs rounded-xl border border-gray-800"
              >
                New Pass
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
