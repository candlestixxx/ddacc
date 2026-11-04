'use client';

import React, { useState } from 'react';
import Tooltip from './Tooltip';
import { ApplicationType, ArtMedium } from '@/types';

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

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An error occurred while submitting.';
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setProposalDetails('');
    setTechnicalRequirements('');
    setPledgeAgreed(false);
  };

  if (submitted) {
    return (
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
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-950/60 border border-purple-500/30 rounded-full text-xs font-mono text-purple-300 mb-3">
          <span>CALL FOR CREATORS & SPEAKERS</span>
          <Tooltip content="Submissions are open for Artist Alley exhibition tables, live stage talks, 3D battle entries, and interactive installations." />
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Artist Alley & Speaker Intake</h2>
        <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-base">
          Apply to exhibit physical merchandise, screen original animations, deliver technical masterclasses, or build site-specific XR experiences.
        </p>
      </div>

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
    </div>
  );
}
