"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volcano, STATUS_CONFIG } from "@/lib/types";

interface VolcanoPanelV2Props {
  volcano: Volcano | null;
  onClose: () => void;
}

type TabType = "overview" | "data" | "history";

/**
 * Bottom sheet volcano panel with tabbed interface
 * Slides up from bottom, mobile-friendly design
 */
export function VolcanoPanelV2({ volcano, onClose }: VolcanoPanelV2Props) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!volcano) return null;

  const statusConfig = STATUS_CONFIG[volcano.status];

  const handleCopyLink = async () => {
    const url = `${window.location.origin}?ui=2&v=${volcano.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "data", label: "Data" },
    { id: "history", label: "History" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 100) onClose();
        }}
        className={`fixed bottom-0 left-0 right-0 z-50 pointer-events-auto ${
          isExpanded ? "top-24" : "max-h-[60vh]"
        }`}
      >
        <div className="h-full glass-panel rounded-t-3xl overflow-hidden flex flex-col border-t border-white/10">
          {/* Drag Handle */}
          <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
            <div className="w-10 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-display text-2xl font-semibold text-cream">
                  {volcano.name}
                </h2>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    backgroundColor: `${statusConfig.color}20`,
                    color: statusConfig.color,
                  }}
                >
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-sm text-silver">
                {volcano.country} • {volcano.region}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Expand/Collapse */}
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg
                  className={`w-5 h-5 text-silver transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-6 flex gap-1 border-b border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id ? "text-cream" : "text-muted hover:text-silver"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-lava"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-2xl font-semibold text-cream">{volcano.elevation.toLocaleString()}</p>
                    <p className="text-xs text-muted mt-1">meters elevation</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-2xl font-semibold text-cream">{volcano.type}</p>
                    <p className="text-xs text-muted mt-1">volcano type</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-white/5">
                    <p className="text-2xl font-semibold text-cream">{volcano.lastEruption || "—"}</p>
                    <p className="text-xs text-muted mt-1">last eruption</p>
                  </div>
                </div>

                {/* Description */}
                {volcano.description && (
                  <div>
                    <h3 className="text-xs text-muted uppercase tracking-wider mb-2">About</h3>
                    <p className="text-sm text-silver leading-relaxed">{volcano.description}</p>
                  </div>
                )}

                {/* Tectonic Setting */}
                {volcano.tectonicSetting && (
                  <div>
                    <h3 className="text-xs text-muted uppercase tracking-wider mb-2">Tectonic Setting</h3>
                    <p className="text-sm text-cream">{volcano.tectonicSetting}</p>
                  </div>
                )}

                {/* Rock Types */}
                {volcano.rockTypes && volcano.rockTypes.length > 0 && (
                  <div>
                    <h3 className="text-xs text-muted uppercase tracking-wider mb-2">Rock Types</h3>
                    <div className="flex flex-wrap gap-2">
                      {volcano.rockTypes.map((rock) => (
                        <span
                          key={rock}
                          className="px-3 py-1 bg-white/5 rounded-full text-xs text-silver"
                        >
                          {rock}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "data" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Latitude</p>
                    <p className="text-lg font-mono text-cream">{volcano.latitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Longitude</p>
                    <p className="text-lg font-mono text-cream">{volcano.longitude.toFixed(4)}°</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Elevation</p>
                    <p className="text-lg font-mono text-cream">{volcano.elevation.toLocaleString()} m</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-xs text-muted uppercase tracking-wider mb-1">Volcano ID</p>
                    <p className="text-lg font-mono text-cream">{volcano.id.toUpperCase()}</p>
                  </div>
                </div>

                {volcano.vei !== undefined && (
                  <div className="p-4 rounded-xl bg-white/5">
                    <p className="text-xs text-muted uppercase tracking-wider mb-2">Volcanic Explosivity Index (VEI)</p>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-lava">{volcano.vei}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-6 rounded ${
                              i < (volcano.vei || 0) ? "bg-lava" : "bg-graphite"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div className="flex items-center justify-center h-40 text-muted text-sm">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-3 text-graphite" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Eruption history coming soon</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/10 flex items-center justify-between bg-black/20">
            <span className="text-xs text-muted">Data: Smithsonian GVP</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-green-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    <span className="text-silver">Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
