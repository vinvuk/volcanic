"use client";

import { useState, useEffect } from "react";

/**
 * Header component with logo, title, and live UTC clock
 * Displays current time and volcanic activity status
 */
export function Header() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    /**
     * Update the displayed time every second
     */
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().slice(11, 19) + " UTC");
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="flex items-center justify-between p-4 md:p-6">
        {/* Logo and Title */}
        <div className="glass-solid rounded-xl px-4 py-3 pointer-events-auto">
          <div className="flex items-center gap-3">
            {/* Triangle logo - matches loading screen */}
            <div className="relative w-8 h-8">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full"
              >
                <defs>
                  <linearGradient id="headerTriangleGradient" x1="50%" y1="0%" x2="50%" y2="100%">
                    <stop offset="0%" stopColor="#e85d04" />
                    <stop offset="100%" stopColor="#9d0208" />
                  </linearGradient>
                  <filter id="headerGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Main triangle */}
                <path
                  d="M50 15 L85 80 L15 80 Z"
                  fill="none"
                  stroke="url(#headerTriangleGradient)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  filter="url(#headerGlow)"
                />

                {/* Inner glow */}
                <path
                  d="M50 15 L85 80 L15 80 Z"
                  fill="url(#headerTriangleGradient)"
                  fillOpacity="0.15"
                />
              </svg>
            </div>

            <div>
              <h1 className="font-display text-xl md:text-2xl font-semibold tracking-wide text-gradient">
                Volcanic
              </h1>
              <p className="text-[10px] text-muted font-mono tracking-[0.2em] uppercase">
                Global Volcano Observatory
              </p>
            </div>
          </div>
        </div>

        {/* Time Display */}
        <div className="glass-solid rounded-xl px-4 py-2 pointer-events-auto">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xs text-silver uppercase tracking-wider">Live</span>
            </div>
            <div className="h-4 w-px bg-slate" />
            <span className="font-mono text-sm text-cream">{time}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
