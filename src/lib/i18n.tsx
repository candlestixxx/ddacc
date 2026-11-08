'use client';

import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'es' | 'ar';

export interface Translations {
  datesBadge: string;
  heroTitle1: string;
  heroTitle2: string;
  heroSubtitle: string;
  btnSchedule: string;
  btnPass: string;
  btnApply: string;
  btnCanvas: string;
  btnFloorplan: string;
  statSessions: string;
  statArtists: string;
  statRegistered: string;
  statWall: string;
  jumpLabel: string;
  navEthos: string;
  navTracks: string;
  navSchedule: string;
  navApply: string;
  navVenue: string;
  navWall: string;
  offlineBanner: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    datesBadge: 'MAY 15–17, 2026 • HUNTINGTON PLACE DETROIT & VIRTUAL',
    heroTitle1: 'Detroit Digital Artist',
    heroTitle2: 'Convention & Conference',
    heroSubtitle: 'Bridging Michigan’s vibrant creative community and high-tech craft. Uniting concept artists, 3D sculptors, XR innovators, and creative coders under The Love Collective.',
    btnSchedule: '📅 Browse Schedule',
    btnPass: '🎫 Claim Digital Pass',
    btnApply: '✨ Apply as Creator / Speaker',
    btnCanvas: '🎨 Live Collaborative Canvas',
    btnFloorplan: '🗺️ Huntington Place Floorplan',
    statSessions: 'Sessions',
    statArtists: 'Artist Alley',
    statRegistered: 'Registered',
    statWall: 'Wall Status',
    jumpLabel: 'JUMP TO SECTION:',
    navEthos: '01. Vision & Ethos',
    navTracks: '02. Curated Tracks',
    navSchedule: '03. Program Schedule',
    navApply: '04. Artist Portal',
    navVenue: '05. Venue Floorplan',
    navWall: '06. Digital Wall',
    offlineBanner: 'OFFLINE MODE - Serving cached schedule, venue maps, and offline data from Huntington Place cache.'
  },
  es: {
    datesBadge: '15–17 DE MAYO DE 2026 • HUNTINGTON PLACE DETROIT Y VIRTUAL',
    heroTitle1: 'Convención de Artistas Digitales',
    heroTitle2: 'de Detroit & Conferencia',
    heroSubtitle: 'Conectando la vibrante comunidad creativa de Michigan y la tecnología avanzada. Uniendo artistas conceptuales, escultores 3D, innovadores XR y programadores bajo The Love Collective.',
    btnSchedule: '📅 Ver Cronograma',
    btnPass: '🎫 Obtener Pase Digital',
    btnApply: '✨ Postularse como Creador',
    btnCanvas: '🎨 Lienzo Colaborativo en Vivo',
    btnFloorplan: '🗺️ Mapa de Huntington Place',
    statSessions: 'Sesiones',
    statArtists: 'Callejón del Arte',
    statRegistered: 'Registrados',
    statWall: 'Estado del Muro',
    jumpLabel: 'IR A LA SECCIÓN:',
    navEthos: '01. Visión y Ética',
    navTracks: '02. Ejes Temáticos',
    navSchedule: '03. Cronograma',
    navApply: '04. Portal del Artista',
    navVenue: '05. Plano del Recinto',
    navWall: '06. Muro Digital',
    offlineBanner: 'MODO SIN CONEXIÓN - Datos y mapas servidos desde la memoria caché de Huntington Place.'
  },
  ar: {
    datesBadge: '١٥-١٧ مايو ٢٠٢٦ • هنتنغتون بليس ديترويت وافتراضياً',
    heroTitle1: 'مؤتمر ومعرض ديترويت',
    heroTitle2: 'للفنانين الرقميين ٢٠٢٦',
    heroSubtitle: 'جسر يربط بين مجتمع ميشيغان الإبداعي النابض بالحياة والتقنيات الفائقة. يجمع فناني المفاهيم والنحاتين ومبتكري الواقع الممتد تحت مظلة The Love Collective.',
    btnSchedule: '📅 تصفح الجدول',
    btnPass: '🎫 استلام التصريح الرقمي',
    btnApply: '✨ التقديم كفنان أو متحدث',
    btnCanvas: '🎨 جدار الرسم المباشر',
    btnFloorplan: '🗺️ خريطة هنتنغتون بليس',
    statSessions: 'الجلسات',
    statArtists: 'ممر الفنانين',
    statRegistered: 'المسجلون',
    statWall: 'حالة الجدار',
    jumpLabel: 'الانتقال السريع:',
    navEthos: '٠١. الرؤية والمبادئ',
    navTracks: '٠٢. المسارات المنسقة',
    navSchedule: '٠٣. جدول الفعاليات',
    navApply: '٠٤. بوابة الفنانين',
    navVenue: '٠٥. خريطة القاعات',
    navWall: '٠٦. الجدار الرقمي',
    offlineBanner: 'وضع عدم الاتصال - يتم عرض الجداول والخرائط المخزنة محلياً من ذاكرة هنتنغتون بليس.'
  }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: translations.en,
  isRTL: false
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ddacc_lang') as Language;
      if (saved && (saved === 'en' || saved === 'es' || saved === 'ar')) {
        return saved;
      }
    }
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ddacc_lang', lang);
    }
  };

  const isRTL = language === 'ar';
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      <div dir={isRTL ? 'rtl' : 'ltr'} className={isRTL ? 'font-sans' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
