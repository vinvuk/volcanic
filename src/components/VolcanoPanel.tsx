"use client";

import { useState } from "react";
import { Volcano, STATUS_CONFIG } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";

interface VolcanoPanelProps {
  volcano: Volcano | null;
  onClose: () => void;
}

/**
 * Detailed information panel for selected volcano
 * Displays volcano data, status, and statistics
 * @param volcano - Selected volcano data
 * @param onClose - Close panel callback
 */
export function VolcanoPanel({ volcano, onClose }: VolcanoPanelProps) {
  const [copied, setCopied] = useState(false);

  if (!volcano) return null;

  const statusConfig = STATUS_CONFIG[volcano.status];

  /**
   * Copy shareable link to clipboard
   */
  const handleCopyLink = async () => {
    const url = `${window.location.origin}?v=${volcano.id}`;
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
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed right-20 top-24 w-80 max-h-[calc(100vh-8rem)] glass-panel rounded-2xl overflow-hidden pointer-events-auto z-40 flex flex-col"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/5 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold text-cream">
                {volcano.name}
              </h2>
              <p className="text-sm text-silver">
                {volcano.country} • {volcano.region}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              aria-label="Close panel"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Status Badge */}
          <div className="mt-3 flex items-center gap-2">
            <span
              className="status-dot"
              style={{ backgroundColor: statusConfig.color, boxShadow: `0 0 8px ${statusConfig.color}` }}
            />
            <span
              className="text-sm font-medium"
              style={{ color: statusConfig.color }}
            >
              {statusConfig.label}
            </span>
            {volcano.status === "erupting" && (
              <span className="px-2 py-0.5 bg-lava-dark/30 rounded text-xs text-lava animate-pulse">
                ACTIVE
              </span>
            )}
          </div>
        </div>

        {/* Data Grid */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="data-label">Latitude</span>
              <p className="data-value">{volcano.latitude.toFixed(3)}°</p>
            </div>
            <div>
              <span className="data-label">Longitude</span>
              <p className="data-value">{volcano.longitude.toFixed(3)}°</p>
            </div>
          </div>

          {/* Elevation & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="data-label">Elevation</span>
              <p className="data-value">{volcano.elevation.toLocaleString()} m</p>
            </div>
            <div>
              <span className="data-label">Type</span>
              <p className="data-value">{volcano.type}</p>
            </div>
          </div>

          {/* Last Eruption & VEI */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="data-label">Last Eruption</span>
              <p className="data-value">{volcano.lastEruption || "Unknown"}</p>
            </div>
            {volcano.vei !== undefined && (
              <div>
                <span className="data-label">VEI</span>
                <div className="flex items-center gap-2">
                  <p className="data-value-large">{volcano.vei}</p>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1.5 h-3 rounded-sm ${
                          i < (volcano.vei || 0)
                            ? "bg-lava"
                            : "bg-graphite"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tectonic Setting */}
          {volcano.tectonicSetting && (
            <div>
              <span className="data-label">Tectonic Setting</span>
              <p className="data-value">{volcano.tectonicSetting}</p>
            </div>
          )}

          {/* Rock Types */}
          {volcano.rockTypes && volcano.rockTypes.length > 0 && (
            <div>
              <span className="data-label">Rock Types</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {volcano.rockTypes.map((rock) => (
                  <span
                    key={rock}
                    className="px-2 py-0.5 bg-graphite/50 rounded text-xs text-silver"
                  >
                    {rock}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {volcano.description && (
            <div className="pt-2 border-t border-white/5">
              <span className="data-label">About</span>
              <p className="text-sm text-silver mt-1 leading-relaxed">
                {volcano.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5 bg-black/20 flex-shrink-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted">Data: Smithsonian GVP</span>
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-xs"
              title="Copy link to this volcano"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-green-400">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  <span className="text-silver">Share</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
