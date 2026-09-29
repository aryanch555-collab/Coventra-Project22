import React, { useState } from 'react';

interface CoventraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const CoventraLogo: React.FC<CoventraLogoProps> = ({ size = 'md' }) => {
  const [imageError, setImageError] = useState(false);

  const heightClass = size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8';

  return (
    <div 
      className="inline-flex items-center justify-center bg-white px-2.5 py-1 rounded-xl shadow-xs border border-slate-200/90 transition duration-150 hover:shadow-sm hover:border-slate-300 focus-visible:ring-2 focus-visible:ring-indigo-500 select-none shrink-0"
      title="Coventra Global"
    >
      {!imageError ? (
        <img
          src="/coventra-logo.jpg"
          alt="Coventra Global"
          className={`${heightClass} w-auto object-contain block`}
          onError={() => setImageError(true)}
          referrerPolicy="no-referrer"
        />
      ) : (
        /* Crisp inline vector rendering as a guaranteed fallback */
        <div className={`flex items-center space-x-2 ${heightClass}`}>
          <svg className="h-full w-auto aspect-square" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="42" stroke="#1A365D" strokeWidth="6" opacity="0.3" />
            {/* Gold orbit rings */}
            <ellipse cx="50" cy="50" rx="38" ry="18" stroke="#CCA353" strokeWidth="5.5" transform="rotate(-30 50 50)" />
            <ellipse cx="50" cy="50" rx="38" ry="18" stroke="#CCA353" strokeWidth="4.5" transform="rotate(35 50 50)" />
            {/* Navy orbit rings */}
            <ellipse cx="50" cy="50" rx="42" ry="20" stroke="#1A365D" strokeWidth="6" transform="rotate(15 50 50)" />
            <ellipse cx="50" cy="50" rx="42" ry="20" stroke="#1A365D" strokeWidth="5" transform="rotate(-70 50 50)" />
          </svg>
          <span className="font-extrabold tracking-wider text-[#1A365D] text-xs font-sans whitespace-nowrap">
            COVENTRA GLOBAL
          </span>
        </div>
      )}
    </div>
  );
};
