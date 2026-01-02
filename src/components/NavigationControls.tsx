"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface NavigationControlsProps {
  onSearch: () => void;
  onMyLocation: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onHelp: () => void;
  isLocating: boolean;
}

/**
 * Navigation controls for the 3D globe
 * Positioned on the right side to avoid overlap with filter panel
 */
export function NavigationControls({
  onSearch,
  onMyLocation,
  onZoomIn,
  onZoomOut,
  onResetView,
  onHelp,
  isLocating,
}: NavigationControlsProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-30 pointer-events-auto">
      <div className="flex flex-col gap-2">
        {/* Search */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onSearch}
            onMouseEnter={() => setShowTooltip("search")}
            onMouseLeave={() => setShowTooltip(null)}
            className="glass-solid p-3 rounded-xl hover:bg-white/10 text-silver hover:text-cream transition-colors"
            aria-label="Search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </motion.button>
          {showTooltip === "search" && (
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap glass-solid px-2.5 py-1.5 rounded-lg text-xs"
            >
              <kbd className="mr-2 px-1.5 py-0.5 bg-graphite rounded text-muted">/</kbd>
              <span className="text-cream">Search</span>
            </motion.div>
          )}
        </div>

        {/* My Location */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMyLocation}
            onMouseEnter={() => setShowTooltip("location")}
            onMouseLeave={() => setShowTooltip(null)}
            className="glass-solid p-3 rounded-xl hover:bg-white/10 text-silver hover:text-cream transition-colors"
            aria-label="My Location"
          >
            {isLocating ? (
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="3" strokeWidth={2} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m10-10h-4M6 12H2" />
              </svg>
            )}
          </motion.button>
          {showTooltip === "location" && (
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap glass-solid px-2.5 py-1.5 rounded-lg text-xs"
            >
              <kbd className="mr-2 px-1.5 py-0.5 bg-graphite rounded text-muted">L</kbd>
              <span className="text-cream">My Location</span>
            </motion.div>
          )}
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-2" />

        {/* Zoom Controls */}
        <div className="glass-solid rounded-xl p-1 flex flex-col">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onZoomIn}
              onMouseEnter={() => setShowTooltip("zoom-in")}
              onMouseLeave={() => setShowTooltip(null)}
              className="p-2.5 rounded-lg hover:bg-white/10 text-silver hover:text-cream transition-colors"
              aria-label="Zoom In"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
            {showTooltip === "zoom-in" && (
              <motion.div
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap glass-solid px-2.5 py-1.5 rounded-lg text-xs"
              >
                <kbd className="mr-2 px-1.5 py-0.5 bg-graphite rounded text-muted">+</kbd>
                <span className="text-cream">Zoom In</span>
              </motion.div>
            )}
          </div>

          <div className="h-px bg-white/10 mx-1" />

          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onZoomOut}
              onMouseEnter={() => setShowTooltip("zoom-out")}
              onMouseLeave={() => setShowTooltip(null)}
              className="p-2.5 rounded-lg hover:bg-white/10 text-silver hover:text-cream transition-colors"
              aria-label="Zoom Out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </motion.button>
            {showTooltip === "zoom-out" && (
              <motion.div
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap glass-solid px-2.5 py-1.5 rounded-lg text-xs"
              >
                <kbd className="mr-2 px-1.5 py-0.5 bg-graphite rounded text-muted">-</kbd>
                <span className="text-cream">Zoom Out</span>
              </motion.div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mx-2" />

        {/* Reset View */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetView}
            onMouseEnter={() => setShowTooltip("reset")}
            onMouseLeave={() => setShowTooltip(null)}
            className="glass-solid p-3 rounded-xl hover:bg-white/10 text-silver hover:text-cream transition-colors"
            aria-label="Reset View"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.button>
          {showTooltip === "reset" && (
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap glass-solid px-2.5 py-1.5 rounded-lg text-xs"
            >
              <kbd className="mr-2 px-1.5 py-0.5 bg-graphite rounded text-muted">R</kbd>
              <span className="text-cream">Reset View</span>
            </motion.div>
          )}
        </div>

        {/* Help */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onHelp}
            onMouseEnter={() => setShowTooltip("help")}
            onMouseLeave={() => setShowTooltip(null)}
            className="glass-solid p-3 rounded-xl hover:bg-white/10 text-silver hover:text-cream transition-colors"
            aria-label="Keyboard Shortcuts"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.button>
          {showTooltip === "help" && (
            <motion.div
              initial={{ opacity: 0, x: 5 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap glass-solid px-2.5 py-1.5 rounded-lg text-xs"
            >
              <kbd className="mr-2 px-1.5 py-0.5 bg-graphite rounded text-muted">?</kbd>
              <span className="text-cream">Shortcuts</span>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
