'use client';

export const Logo = () => {
  return (
    <div className="flex items-center justify-center group cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="transition-transform duration-300 group-hover:scale-105 filter drop-shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
      >
        <defs>
          <linearGradient id="logoGradPrimary" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
          <linearGradient id="logoGradInner" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E0E7FF" stopOpacity="0.75" />
          </linearGradient>
          <linearGradient id="logoGradGlow" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Ambient Glow */}
        <circle cx="24" cy="24" r="20" fill="url(#logoGradGlow)" filter="blur(6px)" opacity="0.5" />

        {/* Outer Rounded Geometric Shield */}
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="12"
          fill="#111827"
          stroke="url(#logoGradPrimary)"
          strokeWidth="2"
        />

        {/* Dynamic Nexus Pulse Emblem */}
        <path
          d="M14 24C14 18.4772 18.4772 14 24 14C27.2 14 30.05 15.5 31.9 17.85"
          stroke="url(#logoGradPrimary)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        <path
          d="M34 24C34 29.5228 29.5228 34 24 34C20.8 34 17.95 32.5 16.1 30.15"
          stroke="url(#logoGradPrimary)"
          strokeWidth="2.8"
          strokeLinecap="round"
        />

        {/* Central Interconnection Node */}
        <circle cx="24" cy="24" r="4.5" fill="url(#logoGradPrimary)" />
        <circle cx="24" cy="24" r="2" fill="#FFFFFF" />

        {/* Satellite Channel Points */}
        <circle cx="15" cy="18" r="2" fill="#6366F1" />
        <circle cx="33" cy="30" r="2" fill="#06B6D4" />
      </svg>
    </div>
  );
};
