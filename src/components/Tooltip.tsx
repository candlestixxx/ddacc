'use client';

import React, { useState } from 'react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = 'top',
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      tabIndex={0}
      role="tooltip"
      aria-label={content}
    >
      {children || (
        <span className="inline-flex items-center justify-center w-4 h-4 ml-1.5 text-[10px] font-bold text-blue-300 bg-blue-950/70 border border-blue-500/40 rounded-full cursor-help hover:bg-blue-800 hover:text-white transition-colors">
          i
        </span>
      )}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-1.5 text-xs font-normal text-white bg-gray-900 border border-gray-700 rounded-md shadow-xl whitespace-normal min-w-[200px] max-w-xs transition-opacity duration-150 pointer-events-none ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-gray-900 border-gray-700 rotate-45 ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1 border-r border-b'
                : position === 'bottom'
                ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1 border-l border-t'
                : position === 'left'
                ? 'left-full top-1/2 -translate-y-1/2 -translate-x-1 border-t border-r'
                : 'right-full top-1/2 -translate-y-1/2 translate-x-1 border-b border-l'
            }`}
          />
        </div>
      )}
    </div>
  );
}
