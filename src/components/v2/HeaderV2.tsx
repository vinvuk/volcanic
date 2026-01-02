"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volcano, STATUS_CONFIG, VolcanoStatus } from "@/lib/types";

interface HeaderV2Props {
  volcanoes: Volcano[];
  visibleStatuses: Set<string>;
  onToggleStatus: (status: string) => void;
  onSearch: () => void;
}

/**
 * Unified header for UI v2
 * Contains logo, search, filters dropdown, and live indicator
 */
export function HeaderV2({
  volcanoes,
  visibleStatuses,
  onToggleStatus,
  onSearch,
}: HeaderV2Props) {
  const [time, setTime] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().slice(11, 19));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusOrder: VolcanoStatus[] = ["erupting", "warning", "watch", "advisory", "normal"];

  const statusCounts = volcanoes.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const eruptingCount = statusCounts["erupting"] || 0;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="p-4">
        <div className="glass-solid rounded-2xl px-4 py-3 pointer-events-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8">
                <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="headerTriangleV2" x1="50%" y1="0%" x2="50%" y2="100%">
                      <stop offset="0%" stopColor="#e85d04" />
                      <stop offset="100%" stopColor="#9d0208" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M50 15 L85 80 L15 80 Z"
                    fill="none"
                    stroke="url(#headerTriangleV2)"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M50 15 L85 80 L15 80 Z"
                    fill="url(#headerTriangleV2)"
                    fillOpacity="0.15"
                  />
                </svg>
              </div>
              <span className="font-display text-xl font-semibold text-cream hidden sm:block">
                Volcanic
              </span>
            </div>

            {/* Center: Search + Filters */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              {/* Search Button */}
              <button
                onClick={onSearch}
                className="flex items-center gap-2 flex-1 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="text-sm text-muted">Search volcanoes...</span>
                <kbd className="hidden sm:inline-block ml-auto px-1.5 py-0.5 text-xs bg-graphite rounded text-muted">/</kbd>
              </button>

              {/* Filter Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
                    showFilters
                      ? "bg-white/10 border-white/20"
                      : "bg-white/5 border-white/10 hover:bg-white/10"
                  }`}
                >
                  <svg className="w-4 h-4 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <span className="text-sm text-silver hidden sm:inline">Filters</span>
                  <motion.svg
                    className="w-3 h-3 text-muted"
                    animate={{ rotate: showFilters ? 180 : 0 }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </motion.svg>
                </button>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-56 glass-solid rounded-xl p-2 border border-white/10"
                    >
                      <div className="text-xs text-muted uppercase tracking-wider px-2 py-1 mb-1">
                        Status Filter
                      </div>
                      {statusOrder.map((status) => {
                        const config = STATUS_CONFIG[status];
                        const count = statusCounts[status] || 0;
                        const isVisible = visibleStatuses.has(status);

                        return (
                          <button
                            key={status}
                            onClick={() => onToggleStatus(status)}
                            className={`w-full flex items-center justify-between px-2 py-2 rounded-lg transition-colors ${
                              isVisible ? "bg-white/5" : "opacity-50"
                            } hover:bg-white/10`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-2.5 h-2.5 rounded-full ${status === "erupting" ? "animate-pulse" : ""}`}
                                style={{ backgroundColor: config.color }}
                              />
                              <span className="text-sm text-cream">{config.label}</span>
                            </div>
                            <span className="text-xs text-muted tabular-nums">{count}</span>
                          </button>
                        );
                      })}
                      <div className="border-t border-white/10 mt-2 pt-2 px-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Total</span>
                          <span className="text-silver tabular-nums">{volcanoes.length}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Right: Erupting count + Live indicator */}
            <div className="flex items-center gap-4">
              {/* Erupting Badge */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-lava/10 border border-lava/20">
                <span className="w-2 h-2 bg-lava rounded-full animate-pulse" />
                <span className="text-sm font-medium text-lava">{eruptingCount}</span>
                <span className="text-xs text-lava/70">erupting</span>
              </div>

              {/* Live + Time */}
              <div className="flex items-center gap-2">
                <div className="relative flex items-center justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
                </div>
                <span className="font-mono text-sm text-cream">{time}</span>
                <span className="text-xs text-muted">UTC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
