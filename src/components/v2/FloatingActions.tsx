"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volcano } from "@/lib/types";

interface FloatingActionsProps {
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
 * Floating action button with expandable menu
 * Provides quick access to common actions
 */
export function FloatingActions({
  eruptingVolcanoes,
  onSelectVolcano,
  onMyLocation,
  onResetView,
  onZoomIn,
  onZoomOut,
  onHelp,
  isLocating,
}: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleRandomEruption = () => {
    if (eruptingVolcanoes.length === 0) return;
    const randomIndex = Math.floor(Math.random() * eruptingVolcanoes.length);
    onSelectVolcano(eruptingVolcanoes[randomIndex]);
    setIsOpen(false);
  };

  const actions = [
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
      label: "My Location",
      onClick: () => { onMyLocation(); setIsOpen(false); },
      color: "text-silver",
    },
    {
      id: "random",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      label: "Random Eruption",
      onClick: handleRandomEruption,
      color: "text-lava",
    },
    {
      id: "reset",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Reset View",
      onClick: () => { onResetView(); setIsOpen(false); },
      color: "text-silver",
    },
    {
      id: "help",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: "Shortcuts",
      onClick: () => { onHelp(); setIsOpen(false); },
      color: "text-silver",
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-40 pointer-events-auto">
      {/* Action Buttons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 flex flex-col gap-2 items-end"
          >
            {/* Zoom Controls */}
            <div className="flex gap-1 glass-solid rounded-xl p-1">
              <button
                onClick={onZoomIn}
                className="p-2 rounded-lg hover:bg-white/10 text-silver transition-colors"
                title="Zoom In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <button
                onClick={onZoomOut}
                className="p-2 rounded-lg hover:bg-white/10 text-silver transition-colors"
                title="Zoom Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>
            </div>

            {/* Action Items */}
            {actions.map((action, index) => (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                onClick={action.onClick}
                className="flex items-center gap-3 pl-4 pr-3 py-2 glass-solid rounded-xl hover:bg-white/10 transition-colors"
              >
                <span className="text-sm text-cream whitespace-nowrap">{action.label}</span>
                <div className={`p-1 ${action.color}`}>{action.icon}</div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isOpen
            ? "bg-white/20 border border-white/30"
            : "bg-gradient-to-br from-lava to-lava-dark border border-lava/30"
        }`}
      >
        <motion.svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={{ rotate: isOpen ? 45 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </motion.svg>
      </motion.button>
    </div>
  );
}
