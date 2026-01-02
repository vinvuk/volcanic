"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volcano, STATUS_CONFIG } from "@/lib/types";

interface SearchBarProps {
  volcanoes: Volcano[];
  onSelectVolcano: (volcano: Volcano) => void;
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Search bar with autocomplete for finding volcanoes
 * @param volcanoes - Array of all volcanoes
 * @param onSelectVolcano - Callback when a volcano is selected
 * @param isOpen - Whether the search bar is visible
 * @param onClose - Callback to close the search bar
 */
export function SearchBar({
  volcanoes,
  onSelectVolcano,
  isOpen,
  onClose,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Volcano[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Focus input when search opens
   */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  /**
   * Reset state when closing
   */
  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  /**
   * Search volcanoes by name, country, or region
   */
  const handleSearch = useCallback(
    (searchQuery: string) => {
      setQuery(searchQuery);

      if (searchQuery.length < 2) {
        setResults([]);
        return;
      }

      const lowerQuery = searchQuery.toLowerCase();
      const filtered = volcanoes
        .filter(
          (v) =>
            v.name.toLowerCase().includes(lowerQuery) ||
            v.country.toLowerCase().includes(lowerQuery) ||
            v.region.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 8);

      // Sort by status priority (erupting first) then by name match quality
      filtered.sort((a, b) => {
        const statusOrder = { erupting: 0, warning: 1, watch: 2, advisory: 3, normal: 4 };
        const aNameMatch = a.name.toLowerCase().startsWith(lowerQuery) ? 0 : 1;
        const bNameMatch = b.name.toLowerCase().startsWith(lowerQuery) ? 0 : 1;

        if (aNameMatch !== bNameMatch) return aNameMatch - bNameMatch;
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setResults(filtered);
      setSelectedIndex(0);
    },
    [volcanoes]
  );

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          onSelectVolcano(results[selectedIndex]);
          onClose();
        }
        break;
      case "Escape":
        e.preventDefault();
        onClose();
        break;
    }
  };

  /**
   * Handle result click
   */
  const handleResultClick = (volcano: Volcano) => {
    onSelectVolcano(volcano);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Search Modal */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4"
          >
            <div className="glass-solid rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              {/* Search Input */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10">
                <svg
                  className="w-5 h-5 text-silver"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search volcanoes..."
                  className="flex-1 bg-transparent text-cream placeholder:text-muted outline-none text-base"
                />
                <kbd className="hidden sm:block px-2 py-0.5 text-xs text-muted bg-graphite rounded">
                  ESC
                </kbd>
              </div>

              {/* Results */}
              {results.length > 0 && (
                <div className="max-h-80 overflow-y-auto">
                  {results.map((volcano, index) => (
                    <button
                      key={volcano.id}
                      onClick={() => handleResultClick(volcano)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                        index === selectedIndex
                          ? "bg-white/10"
                          : "hover:bg-white/5"
                      }`}
                    >
                      {/* Status Indicator */}
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: STATUS_CONFIG[volcano.status].color }}
                      />

                      {/* Volcano Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-cream font-medium truncate">
                          {volcano.name}
                        </p>
                        <p className="text-xs text-silver truncate">
                          {volcano.country} · {volcano.region}
                        </p>
                      </div>

                      {/* Status Badge */}
                      {volcano.status !== "normal" && (
                        <span
                          className="text-xs px-2 py-0.5 rounded-full capitalize"
                          style={{
                            backgroundColor: `${STATUS_CONFIG[volcano.status].color}20`,
                            color: STATUS_CONFIG[volcano.status].color,
                          }}
                        >
                          {volcano.status}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* No Results */}
              {query.length >= 2 && results.length === 0 && (
                <div className="px-4 py-8 text-center text-muted">
                  <p>No volcanoes found for "{query}"</p>
                </div>
              )}

              {/* Hint */}
              {query.length < 2 && (
                <div className="px-4 py-6 text-center text-muted text-sm">
                  <p>Search by volcano name, country, or region</p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
