"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volcano } from "@/lib/types";

interface EruptionIndicatorProps {
  volcanoes: Volcano[];
  onSelectVolcano: (volcano: Volcano) => void;
}

/**
 * Eruption indicator with glass effect - expandable list on click
 * Shows actively erupting volcanoes with visual prominence
 */
export function EruptionIndicator({ volcanoes, onSelectVolcano }: EruptionIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const eruptingVolcanoes = volcanoes.filter((v) => v.status === "erupting");

  if (eruptingVolcanoes.length === 0) return null;

  return (
    <div className="fixed top-5 left-5 z-50 pointer-events-auto">
      {/* Main trigger button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`glass-panel rounded-2xl px-4 py-3 flex items-center gap-3 transition-all duration-200 ${
          isExpanded
            ? "bg-[#ff2200]/15 ring-1 ring-[#ff2200]/30"
            : "hover:bg-white/10"
        }`}
      >
        {/* Pulsing indicator with glow */}
        <span className="relative flex items-center justify-center">
          <span className="w-2.5 h-2.5 bg-[#ff2200] rounded-full" />
          <span className="absolute w-2.5 h-2.5 bg-[#ff2200] rounded-full animate-ping opacity-75" />
        </span>
        <span className="text-sm font-medium text-[#ff2200]">
          {eruptingVolcanoes.length} erupting
        </span>
        <motion.svg
          className="w-4 h-4 text-[#ff2200]/70"
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Dropdown list */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute top-full left-0 mt-2 glass-panel rounded-2xl p-1.5 max-h-80 overflow-y-auto w-72 shadow-xl shadow-black/20"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/5 mb-1">
              <span className="text-xs text-silver/60 uppercase tracking-wider font-medium">
                Active Eruptions
              </span>
              <span className="text-xs text-[#ff2200]/80 font-mono">
                {eruptingVolcanoes.length}
              </span>
            </div>

            {/* Volcano list */}
            <div className="space-y-0.5">
              {eruptingVolcanoes.map((volcano, index) => (
                <motion.button
                  key={volcano.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => {
                    onSelectVolcano(volcano);
                    setIsExpanded(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/8 active:bg-white/12 transition-colors text-left group"
                >
                  {/* Indicator dot */}
                  <span className="relative flex-shrink-0">
                    <span className="w-2 h-2 bg-[#ff2200] rounded-full block" />
                    <span className="absolute inset-0 w-2 h-2 bg-[#ff2200] rounded-full animate-pulse opacity-50" />
                  </span>

                  {/* Volcano name */}
                  <span className="text-sm text-cream/90 truncate flex-1 group-hover:text-cream transition-colors">
                    {volcano.name}
                  </span>

                  {/* Country */}
                  <span className="text-xs text-silver/50 group-hover:text-silver/70 transition-colors">
                    {volcano.country}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
