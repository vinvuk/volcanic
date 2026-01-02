"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volcano, STATUS_CONFIG } from "@/lib/types";

interface CompactPanelProps {
  volcano: Volcano | null;
  onClose: () => void;
}

/**
 * Compact side panel for volcano info
 * Minimal footprint, slides in from right
 */
export function CompactPanel({ volcano, onClose }: CompactPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!volcano) return null;

  const statusConfig = STATUS_CONFIG[volcano.status];

  const handleCopyLink = async () => {
    const url = `${window.location.origin}?ui=3&v=${volcano.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-20 right-4 bottom-4 w-72 z-40 pointer-events-auto"
      >
        <div className="h-full glass-panel rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="font-display text-lg font-semibold text-cream truncate">
                  {volcano.name}
                </h2>
                <p className="text-xs text-silver truncate">
                  {volcano.country} • {volcano.region}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
              >
                <svg className="w-4 h-4 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Status badge */}
            <div className="mt-2 flex items-center gap-2">
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide"
                style={{
                  backgroundColor: `${statusConfig.color}20`,
                  color: statusConfig.color,
                }}
              >
                {statusConfig.label}
              </span>
              {volcano.lastEruption && (
                <span className="text-[10px] text-muted">
                  Last: {volcano.lastEruption}
                </span>
              )}
            </div>
          </div>

          {/* Content - scrollable */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <p className="text-lg font-semibold text-cream">{volcano.elevation.toLocaleString()}</p>
                <p className="text-[10px] text-muted">meters</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5 text-center">
                <p className="text-sm font-semibold text-cream truncate">{volcano.type}</p>
                <p className="text-[10px] text-muted">type</p>
              </div>
            </div>

            {/* Coordinates */}
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Coordinates</p>
              <p className="font-mono text-xs text-cream">
                {volcano.latitude.toFixed(4)}°, {volcano.longitude.toFixed(4)}°
              </p>
            </div>

            {/* VEI if available */}
            {volcano.vei !== undefined && (
              <div className="p-2 rounded-lg bg-white/5">
                <p className="text-[10px] text-muted uppercase tracking-wide mb-1">VEI Rating</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-lava">{volcano.vei}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-2 h-4 rounded-sm ${
                          i < (volcano.vei || 0) ? "bg-lava" : "bg-graphite"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {volcano.description && (
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide mb-1">About</p>
                <p className="text-xs text-silver leading-relaxed">{volcano.description}</p>
              </div>
            )}

            {/* Tectonic Setting */}
            {volcano.tectonicSetting && (
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Tectonic Setting</p>
                <p className="text-xs text-cream">{volcano.tectonicSetting}</p>
              </div>
            )}

            {/* Rock Types */}
            {volcano.rockTypes && volcano.rockTypes.length > 0 && (
              <div>
                <p className="text-[10px] text-muted uppercase tracking-wide mb-1">Rock Types</p>
                <div className="flex flex-wrap gap-1">
                  {volcano.rockTypes.map((rock) => (
                    <span
                      key={rock}
                      className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-silver"
                    >
                      {rock}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[10px] text-muted">Smithsonian GVP</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {copied ? (
                <>
                  <svg className="w-3 h-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[10px] text-green-400">Copied</span>
                </>
              ) : (
                <>
                  <svg className="w-3 h-3 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-[10px] text-silver">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
