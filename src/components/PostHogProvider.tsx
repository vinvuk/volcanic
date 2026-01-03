"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider } from "posthog-js/react";
import { useEffect, useState } from "react";
import { CookieConsent, getConsentStatus, ConsentStatus } from "./CookieConsent";

/**
 * Initialize PostHog with the configured settings
 */
function initPostHog() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com",
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage+cookie",
      respect_dnt: true,
    });
  }
}

/**
 * PostHog analytics provider component with GDPR-compliant cookie consent
 * Only initializes PostHog after user grants consent
 */
export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(null);
  const [initialized, setInitialized] = useState(false);

  // Check for existing consent on mount
  useEffect(() => {
    const status = getConsentStatus();
    setConsentStatus(status);

    // If already consented, initialize PostHog
    if (status === "granted" && !initialized) {
      initPostHog();
      setInitialized(true);
    }
  }, [initialized]);

  /**
   * Handle consent status change from the banner
   * @param status - The new consent status
   */
  const handleConsentChange = (status: ConsentStatus) => {
    setConsentStatus(status);

    if (status === "granted" && !initialized) {
      initPostHog();
      setInitialized(true);
    } else if (status === "denied" && initialized) {
      // Opt out if previously initialized
      posthog.opt_out_capturing();
    }
  };

  // If no API key configured, just render children
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return <>{children}</>;
  }

  // Wrap with PostHog provider only if initialized
  const content = initialized ? (
    <PHProvider client={posthog}>{children}</PHProvider>
  ) : (
    <>{children}</>
  );

  return (
    <>
      {content}
      <CookieConsent onConsentChange={handleConsentChange} />
    </>
  );
}
