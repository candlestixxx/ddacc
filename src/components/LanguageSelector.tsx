'use client';

import React from 'react';
import { useLanguage, Language } from '@/lib/i18n';
import { soundFx } from '@/lib/audio';
import Tooltip from './Tooltip';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  const handleSelect = (lang: Language) => {
    soundFx.playClick();
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 rounded-lg p-0.5 text-xs font-mono">
      <button
        onClick={() => handleSelect('en')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'en'
            ? 'bg-blue-600 text-white font-bold'
            : 'text-gray-400 hover:text-white'
        }`}
        title="English"
      >
        EN
      </button>
      <button
        onClick={() => handleSelect('es')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'es'
            ? 'bg-blue-600 text-white font-bold'
            : 'text-gray-400 hover:text-white'
        }`}
        title="Español"
      >
        ES
      </button>
      <button
        onClick={() => handleSelect('ar')}
        className={`px-2 py-1 rounded transition-colors ${
          language === 'ar'
            ? 'bg-blue-600 text-white font-bold'
            : 'text-gray-400 hover:text-white'
        }`}
        title="العربية (Arabic)"
      >
        AR
      </button>
      <Tooltip content="Select preferred language: English, Español, or العربية with RTL layout support." />
    </div>
  );
}
