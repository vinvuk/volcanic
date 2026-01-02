"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Volcano } from "@/lib/types";

interface EruptionTickerProps {
  volcanoes: Volcano[];
  onSelectVolcano: (volcano: Volcano) => void;
}

/**
 * Horizontal scrolling ticker showing currently erupting volcanoes
 * Click any volcano to fly to its location
 */
export function EruptionTicker({ volcanoes, onSelectVolcano }: EruptionTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  const eruptingVolcanoes = volcanoes.filter((v) => v.status === "erupting");

  if (eruptingVolcanoes.length === 0) return null;

  // Duplicate for seamless loop
  const duplicatedVolcanoes = [...eruptingVolcanoes, ...eruptingVolcanoes];

  return (
    <div className="fixed top-[88px] left-0 right-0 z-40 pointer-events-none">
      <div className="px-4">
        <div
          className="glass-solid rounded-xl overflow-hidden pointer-events-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex items-center">
            {/* Label */}
            <div className="flex-shrink-0 px-4 py-2 border-r border-white/10 bg-lava/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-lava rounded-full animate-pulse" />
                <span className="text-xs font-medium text-lava uppercase tracking-wider">
                  Active Eruptions
                </span>
              </div>
            </div>

            {/* Scrolling Container */}
            <div
              ref={containerRef}
              className="flex-1 overflow-hidden"
            >
              <motion.div
                className="flex gap-1 py-2 px-2"
                animate={{
                  x: isPaused ? 0 : [0, -50 * eruptingVolcanoes.length],
                }}
                transition={{
                  x: {
                    duration: eruptingVolcanoes.length * 3,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                {duplicatedVolcanoes.map((volcano, index) => (
                  <button
                    key={`${volcano.id}-${index}`}
                    onClick={() => onSelectVolcano(volcano)}
                    className="flex-shrink-0 flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-lava/30 transition-all group"
                  >
                    <span className="w-1.5 h-1.5 bg-lava rounded-full group-hover:animate-ping" />
                    <span className="text-sm text-cream whitespace-nowrap">{volcano.name}</span>
                    <span className="text-xs text-muted">{volcano.country}</span>
                  </button>
                ))}
              </motion.div>
            </div>

            {/* Count */}
            <div className="flex-shrink-0 px-4 py-2 border-l border-white/10">
              <span className="text-sm font-mono text-silver">{eruptingVolcanoes.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
