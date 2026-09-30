"use client";

import { useState } from 'react';
import { ApplicationType, ArtMedium } from '@/types';

export default function ArtistPortal() {
  const [formType, setFormType] = useState<ApplicationType>('Artist Alley Table');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
    }, 500);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16 bg-gray-800 rounded-2xl border border-gray-700">
        <h3 className="text-2xl font-bold text-green-400 mb-4">Application Submitted!</h3>
        <p className="text-gray-300 mb-8">Thank you for joining the Love Collective. We will review your application and get back to you soon.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Artist Alley & Speaker Portal</h2>
        <p className="text-gray-400">Apply to showcase your work, host a workshop, or speak at DDACC 2026.</p>
      </div>

      <div className="bg-gray-800 rounded-2xl p-6 md:p-8 border border-gray-700 shadow-xl">
        <div className="flex flex-wrap gap-2 mb-8">
          {(['Artist Alley Table', 'Speaker / Panel Proposal', 'Interactive Installation', 'Workshop Lead'] as ApplicationType[]).map((type) => (
            <button
              key={type}
              onClick={() => setFormType(type)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name *</label>
              <input required type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
              <input required type="email" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="jane@example.com" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Artist Handle / Stage Name</label>
              <input type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="@janedigital" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Portfolio URL *</label>
              <input required type="url" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500" placeholder="https://portfolio.com" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Primary Medium</label>
            <select className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-blue-500 appearance-none">
              <option value="">Select a medium...</option>
              <option value="2D Digital Illustration">2D Digital Illustration</option>
              <option value="3D Modeling & Sculpting">3D Modeling & Sculpting</option>
              <option value="Concept Art & Visual Development">Concept Art & Visual Development</option>
              <option value="Motion Graphics & Animation">Motion Graphics & Animation</option>
              <option value="VFX & Real-Time Engine">VFX & Real-Time Engine</option>
              <option value="AR / VR / XR">AR / VR / XR</option>
              <option value="Generative & Algorithmic">Generative & Algorithmic</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {formType === 'Artist Alley Table' ? 'Describe your booth/merch setup *' : 'Proposal Abstract *'}
            </label>
            <textarea required rows={4} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="Tell us about what you want to bring to DDACC..."></textarea>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input required id="pledge" type="checkbox" className="w-4 h-4 bg-gray-900 border-gray-700 rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-gray-800" />
            </div>
            <label htmlFor="pledge" className="ml-3 text-sm text-gray-400">
              I agree to the <span className="text-blue-400">Love Collective Pledge</span>, upholding community guidelines of inclusion, mutual support, and creative equity. *
            </label>
          </div>

          <div className="pt-4 border-t border-gray-700">
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800">
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}