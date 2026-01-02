"use client";

import { Volcano } from "@/lib/types";

interface MiniControlsProps {
  eruptingVolcanoes: Volcano[];
  onSelectVolcano: (volcano: Volcano) => void;
  onMyLocation: () => void;
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onHelp: () => void;
  isLocating: boolean;
}

/**
 * Control buttons with glass effect - centered row at bottom
 */
export function MiniControls({
  eruptingVolcanoes,
  onSelectVolcano,
  onMyLocation,
  onResetView,
  onZoomIn,
  onZoomOut,
  onHelp,
  isLocating,
}: MiniControlsProps) {
  const handleRandomEruption = () => {
    if (eruptingVolcanoes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * eruptingVolcanoes.length);
    onSelectVolcano(eruptingVolcanoes[randomIndex]);
  };

  const buttons = [
    {
      id: "zoomIn",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      ),
      onClick: onZoomIn,
      title: "Zoom in (+)",
    },
    {
      id: "zoomOut",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      ),
      onClick: onZoomOut,
      title: "Zoom out (-)",
    },
    {
      id: "location",
      icon: isLocating ? (
        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="3" strokeWidth={2} />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
        </svg>
      ),
      onClick: onMyLocation,
      title: "My location (L)",
    },
    {
      id: "random",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      onClick: handleRandomEruption,
      title: "Random eruption",
      highlight: true,
    },
    {
      id: "reset",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: onResetView,
      title: "Reset view (R)",
    },
    {
      id: "help",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: onHelp,
      title: "Keyboard shortcuts (?)",
    },
  ];

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 pointer-events-auto">
      <div className="glass-panel rounded-2xl px-2 py-2 flex items-center gap-1">
        {buttons.map((btn) => (
          <button
            key={btn.id}
            onClick={btn.onClick}
            className={`p-3 rounded-xl transition-colors ${
              btn.highlight
                ? "text-lava hover:bg-lava/20"
                : "text-silver hover:bg-white/10"
            }`}
            title={btn.title}
          >
            {btn.icon}
          </button>
        ))}
      </div>
    </div>
  );
}
