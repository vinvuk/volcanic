"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volcano, STATUS_CONFIG, VolcanoStatus } from "@/lib/types";

interface MinimalHeaderProps {
  volcanoes: Volcano[];
  visibleStatuses: Set<string>;
  onToggleStatus: (status: string) => void;
  onSearch: () => void;
}

/**
 * Minimal header with glass effects - logo, search, filters, time
 */
export function MinimalHeader({
  volcanoes,
  visibleStatuses,
  onToggleStatus,
  onSearch,
}: MinimalHeaderProps) {
  const [time, setTime] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toISOString().slice(11, 16));
      // Get short timezone abbreviation
      const tz = new Intl.DateTimeFormat("en", { timeZoneName: "short" })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value || "UTC";
      setTimezone(tz);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const statusOrder: VolcanoStatus[] = ["erupting", "warning", "watch", "advisory", "normal"];

  return (
    <header className="fixed top-5 left-5 right-5 z-50 pointer-events-none">
      <div className="flex items-center justify-between">
        {/* Left: Empty space - eruption indicator is handled separately */}
        <div className="flex items-center gap-3 pointer-events-auto">
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Search */}
          <button
            onClick={onSearch}
            className="glass-panel rounded-2xl px-4 py-3 hover:bg-white/10 transition-colors"
            title="Search (Press /)"
          >
            <svg className="w-5 h-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`glass-panel rounded-2xl px-4 py-3 transition-colors ${showFilters ? "bg-white/10" : "hover:bg-white/10"}`}
              title="Filter volcanoes"
            >
              <svg className="w-5 h-5 text-silver" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  className="absolute right-0 top-full mt-2 glass-panel rounded-2xl p-2 min-w-[160px]"
                >
                  {statusOrder.map((status) => {
                    const config = STATUS_CONFIG[status];
                    const isVisible = visibleStatuses.has(status);
                    return (
                      <button
                        key={status}
                        onClick={() => onToggleStatus(status)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                          isVisible ? "hover:bg-white/10" : "opacity-40 hover:opacity-60"
                        }`}
                      >
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${status === "erupting" ? "animate-pulse" : ""}`}
                          style={{ backgroundColor: config.color }}
                        />
                        <span className="text-sm text-cream">{config.label}</span>
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Time with timezone */}
          <div className="glass-panel rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <div className="relative flex items-center justify-center">
              <div className="w-2 h-2 bg-emerald-500 rounded-full" />
              <div className="absolute w-2 h-2 bg-emerald-500 rounded-full animate-ping opacity-75" />
            </div>
            <span className="font-mono text-sm text-cream">{time}</span>
            <span className="text-xs text-muted">{timezone}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
