'use client';

import React, { useState, useEffect } from 'react';
import Tooltip from './Tooltip';
import { ApplicationType, ArtMedium } from '@/types';
import { ApplicationRecord } from '@/lib/applicationsData';
import { soundFx } from '@/lib/audio';

export const ART_MEDIUMS: ArtMedium[] = [
  '2D Digital Illustration',
  '3D Modeling & Sculpting',
  'Concept Art & Visual Development',
  'Motion Graphics & Animation',
  'VFX & Real-Time Engine',
  'AR / VR / XR',
  'Generative & Algorithmic',
  'Other'
];

export default function ArtistPortal() {
  const [activeTab, setActiveTab] = useState<'submit' | 'jurying'>('submit');

  // Submit Form States
  const [formType, setFormType] = useState<ApplicationType>('Artist Alley Table');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [artistHandle, setArtistHandle] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [primaryMedium, setPrimaryMedium] = useState<ArtMedium>('2D Digital Illustration');
  const [proposalDetails, setProposalDetails] = useState('');
  const [technicalRequirements, setTechnicalRequirements] = useState('');
  const [pledgeAgreed, setPledgeAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Jurying / Community Showcase States
  const [showcaseApps, setShowcaseApps] = useState<ApplicationRecord[]>([]);
  const [loadingShowcase, setLoadingShowcase] = useState(false);
  const [votingMap, setVotingMap] = useState<Record<string, boolean>>({});
  const [votedIds, setVotedIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const fetchApplications = async () => {
      try {
        const res = await fetch('/api/applications');
        if (res.ok && isMounted) {
          const data = await res.json();
          setShowcaseApps(data.applications || []);
        }
      } catch (err) {
        console.error('Failed to load showcase applications:', err);
      } finally {
        if (isMounted) setLoadingShowcase(false);
      }
    };

    fetchApplications();
    return () => {
      isMounted = false;
    };
  }, []);

  const refreshApplications = async () => {
    try {
      setLoadingShowcase(true);
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        setShowcaseApps(data.applications || []);
      }
    } catch (err) {
      console.error('Failed to reload showcase applications:', err);
    } finally {
      setLoadingShowcase(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!pledgeAgreed) {
      setErrorMessage('You must agree to the Love Collective Pledge before submitting.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          artistHandle,
          portfolioUrl,
          formType,
          primaryMedium,
          proposalDetails,
          technicalRequirements,
          pledgeAgreed
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Submission failed');
      }

      soundFx.playChime();
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (appId: string) => {
    if (votedIds.includes(appId)) return;

    soundFx.playDetroitBeep(784, 'sine', 0.08);
    setVotingMap((prev) => ({ ...prev, [appId]: true }));

    // Optimistic UI update
    setShowcaseApps((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, votes: (app.votes || 0) + 1 } : app))
    );
    setVotedIds((prev) => [...prev, appId]);

    try {
      const res = await fetch('/api/applications/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: appId })
      });
      if (!res.ok) {
        const data = await res.json();
        console.warn('Vote response not ok:', data);
      }
    } catch (err) {
      console.error('Failed to cast vote:', err);
    } finally {
      setVotingMap((prev) => ({ ...prev, [appId]: false }));
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setProposalDetails('');
    setTechnicalRequirements('');
    setPledgeAgreed(false);
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/60 border border-purple-500/30 rounded-full text-xs font-mono text-purple-300 mb-3">
          <span>CALL FOR CREATORS & COMMUNITY JURYING</span>
          <Tooltip content="Exhibit at Huntington Place Hall C or participate in peer jurying to decide spotlight tables." />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Artist Alley & Creator Hub</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Apply for an exhibition table or browse proposals and cast community jury votes under the Love Collective ethos.
        </p>

        {/* Tab Switcher */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('submit');
            }}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border ${
              activeTab === 'submit'
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/40'
                : 'bg-gray-900/80 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            Submit Proposal
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setActiveTab('jurying');
            }}
            className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all border flex items-center gap-2 ${
              activeTab === 'jurying'
                ? 'bg-purple-600 text-white border-purple-400 shadow-lg shadow-purple-900/40'
                : 'bg-gray-900/80 text-gray-400 border-gray-800 hover:text-white'
            }`}
          >
            <span>Community Jury & Voting</span>
            <span className="px-1.5 py-0.5 rounded-md bg-purple-950 text-purple-300 text-[10px] font-mono border border-purple-500/30">
              NEW
            </span>
          </button>
        </div>
      </div>

      {activeTab === 'submit' ? (
        submitted ? (
          <div className="max-w-2xl mx-auto text-center py-16 px-6 bg-gray-950/90 rounded-2xl border border-emerald-500/40 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
              ✓
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-2">Application Received!</h3>
            <p className="text-emerald-300 font-mono text-sm mb-4">Submission confirmed into DDACC Intake Registry</p>
            <p className="text-gray-300 mb-8 max-w-lg mx-auto text-sm leading-relaxed">
              Thank you for joining the Love Collective movement. The artist jury reviews submissions bi-weekly with priority given to innovative digital craft, Detroit ties, and community spirit.
            </p>
            <button
              onClick={resetForm}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all text-white font-semibold text-sm shadow-lg shadow-blue-900/30"
            >
              Submit Another Proposal
            </button>
          </div>
        ) : (
          <div className="bg-gray-950/80 rounded-2xl p-6 md:p-8 border border-gray-800 shadow-2xl backdrop-blur-md">
            {/* Form Type Selector */}
            <div className="mb-6">
              <label className="block text-xs uppercase font-mono text-gray-400 mb-2 flex items-center">
                Application Category
                <Tooltip content="Choose whether you are exhibiting artwork/merch at an Artist Alley table, delivering a lecture, or building a hardware installation." />
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {(
                  [
                    'Artist Alley Table',
                    'Speaker / Panel Proposal',
                    'Interactive Installation',
                    'Workshop Lead'
                  ] as ApplicationType[]
                ).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormType(type)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border text-center ${
                      formType === type
                        ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-900/40'
                        : 'bg-gray-900/60 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-300 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center">
                    Legal or Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="Jane Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center">
                    Contact Email *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="jane@creativestudio.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center">
                    Artist Handle / Studio Name
                    <Tooltip content="Your public-facing social tag, ArtStation handle, or alias for conference marketing badges." />
                  </label>
                  <input
                    type="text"
                    value={artistHandle}
                    onChange={(e) => setArtistHandle(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="@detroit_sculpts"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center">
                    Portfolio or Project URL *
                    <Tooltip content="Direct link to your ArtStation, personal portfolio site, Behance, or GitHub repository." />
                  </label>
                  <input
                    required
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                    placeholder="https://artstation.com/detroit_sculpts"
                  />
                </div>
              </div>

              {/* Primary Medium */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center">
                  Primary Digital Medium *
                  <Tooltip content="Identify the central medium of your work to ensure proper grouping in the exhibition hall." />
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ART_MEDIUMS.map((medium) => (
                    <button
                      type="button"
                      key={medium}
                      onClick={() => setPrimaryMedium(medium)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium border text-left transition-all ${
                        primaryMedium === medium
                          ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200'
                          : 'bg-gray-900/40 border-gray-800 text-gray-400 hover:text-white hover:border-gray-700'
                      }`}
                    >
                      {medium}
                    </button>
                  ))}
                </div>
              </div>

              {/* Proposal Abstract */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center">
                  {formType === 'Artist Alley Table'
                    ? 'Exhibition & Merch Concept Details *'
                    : formType === 'Speaker / Panel Proposal'
                    ? 'Talk / Panel Abstract & Key Takeaways *'
                    : 'Installation Scope & Interactive Overview *'}
                  <Tooltip content="Provide a concise summary of what you will present, how it engages attendees, and what makes your approach distinctive." />
                </label>
                <textarea
                  required
                  rows={4}
                  value={proposalDetails}
                  onChange={(e) => setProposalDetails(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="Detail your planned work, topics covered, or interactive booth design..."
                />
              </div>

              {/* Technical Specs */}
              <div>
                <label className="block text-xs font-mono text-gray-300 mb-1.5 flex items-center">
                  Technical & Equipment Requirements (Optional)
                  <Tooltip content="List hardware requirements: power outlets (120V), projector HDMI feeds, Ethernet drops, or pedestal space." />
                </label>
                <input
                  type="text"
                  value={technicalRequirements}
                  onChange={(e) => setTechnicalRequirements(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
                  placeholder="e.g. 2x 120V outlets, high-lumen HDMI projector, 8ft table"
                />
              </div>

              {/* Love Collective Pledge */}
              <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl flex items-start gap-3">
                <input
                  required
                  id="pledge"
                  type="checkbox"
                  checked={pledgeAgreed}
                  onChange={(e) => setPledgeAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded bg-gray-950 border-gray-700 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="pledge" className="text-xs text-gray-300 leading-relaxed cursor-pointer">
                  I commit to <strong className="text-cyan-300">The Love Collective Ethos</strong>: fostering open creative knowledge sharing, respecting creator copyright integrity, welcoming artists of all skill levels, and maintaining an inclusive space at DDACC. *
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-cyan-900/30 transition-all font-mono text-sm tracking-wide"
              >
                {submitting ? 'Submitting to Registry...' : 'Submit Application to DDACC 2026'}
              </button>
            </form>
          </div>
        )
      ) : (
        /* Community Showcase & Peer Jurying Tab */
        <div className="space-y-6">
          <div className="p-4 bg-purple-950/40 border border-purple-500/30 rounded-2xl flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>The Love Collective Community Jury</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/80 text-purple-200">
                  PEER REVIEW
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Upvote proposals to grant creators featured main-aisle exhibition space at Huntington Place.
              </p>
            </div>
            <button
              onClick={refreshApplications}
              className="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-lg text-xs font-mono transition-colors border border-gray-800"
            >
              Refresh Feed
            </button>
          </div>

          {loadingShowcase ? (
            <div className="text-center py-20 text-gray-500 font-mono text-xs">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading jury showcase...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {showcaseApps.map((app) => {
                const hasVoted = votedIds.includes(app.id);
                return (
                  <div
                    key={app.id}
                    className="bg-gray-950/80 border border-gray-800/80 hover:border-purple-500/40 p-5 rounded-2xl flex flex-col justify-between transition-all backdrop-blur-sm"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-bold text-white text-base tracking-tight">{app.fullName}</h4>
                          {app.artistHandle && (
                            <span className="text-xs font-mono text-cyan-400">{app.artistHandle}</span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-950/60 text-purple-300 border border-purple-500/30 whitespace-nowrap">
                          {app.formType}
                        </span>
                      </div>

                      <div className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-gray-900 text-gray-400 mb-3 border border-gray-800">
                        {app.primaryMedium}
                      </div>

                      <p className="text-gray-300 text-xs leading-relaxed mb-4">{app.proposalDetails}</p>

                      {app.portfolioUrl && (
                        <a
                          href={app.portfolioUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 underline font-mono inline-block mb-3"
                        >
                          View Creator Portfolio →
                        </a>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-900 text-xs">
                      <span className="font-mono text-gray-500">
                        {app.votes || 0} {app.votes === 1 ? 'Peer Vote' : 'Peer Votes'}
                      </span>
                      <button
                        onClick={() => handleVote(app.id)}
                        disabled={hasVoted || votingMap[app.id]}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all flex items-center gap-1.5 ${
                          hasVoted
                            ? 'bg-purple-900/60 text-purple-300 border border-purple-600/50 cursor-default'
                            : 'bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-900/30'
                        }`}
                      >
                        <span>{hasVoted ? '✓ Voted' : '▲ Upvote Proposal'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
