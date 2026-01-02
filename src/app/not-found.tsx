"use client";

import Link from "next/link";
import { motion } from "framer-motion";

/**
 * Custom 404 Not Found page
 * Displays a volcanic-themed error page with animation
 * @returns The 404 page component
 */
export default function NotFound() {
  return (
    <main className="min-h-screen bg-obsidian flex flex-col items-center justify-center px-6">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-radial from-lava/20 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center"
      >
        {/* Volcano icon */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 32 32"
            className="opacity-60"
          >
            <defs>
              <linearGradient id="lava404" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ff4400" }} />
                <stop offset="50%" style={{ stopColor: "#ff2200" }} />
                <stop offset="100%" style={{ stopColor: "#cc1100" }} />
              </linearGradient>
              <linearGradient id="mountain404" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#4a4a52" }} />
                <stop offset="100%" style={{ stopColor: "#2a2a32" }} />
              </linearGradient>
            </defs>
            <path d="M16 8 L26 26 L6 26 Z" fill="url(#mountain404)" />
            <ellipse cx="16" cy="9" rx="4" ry="1.5" fill="#1a1a1e" />
            <ellipse
              cx="16"
              cy="6"
              rx="3"
              ry="2"
              fill="url(#lava404)"
              opacity="0.9"
            />
            <circle cx="14" cy="4" r="1" fill="#ff4400" opacity="0.8" />
            <circle cx="18" cy="3" r="0.8" fill="#ff6600" opacity="0.8" />
            <circle cx="16" cy="2" r="1.2" fill="#ff2200" opacity="0.8" />
          </svg>
        </motion.div>

        {/* 404 text */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-8xl md:text-9xl font-display font-bold text-cream/20 mb-4"
        >
          404
        </motion.h1>

        {/* Message */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-2xl md:text-3xl font-display text-cream mb-4"
        >
          Dormant Page
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-silver/70 mb-8 max-w-md mx-auto"
        >
          This volcano has gone silent. The page you&apos;re looking for
          doesn&apos;t exist or has been moved.
        </motion.p>

        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-lava/20 hover:bg-lava/30 border border-lava/30 rounded-xl text-cream transition-all duration-200 hover:scale-105"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Globe
          </Link>
        </motion.div>
      </motion.div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />
    </main>
  );
}
