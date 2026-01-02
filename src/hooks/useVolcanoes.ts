"use client";

import { useState, useEffect, useCallback } from "react";
import { Volcano, VolcanoApiResponse } from "@/lib/types";

/**
 * Hook for fetching and managing volcano data
 * Handles loading state, errors, and data refresh
 * @returns Volcano data and loading state
 */
export function useVolcanoes() {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  /**
   * Fetch volcano data from API
   */
  const fetchVolcanoes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/volcanoes");

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status}`);
      }

      const data: VolcanoApiResponse = await response.json();

      setVolcanoes(data.volcanoes);
      setLastUpdated(data.lastUpdated);
    } catch (err) {
      console.error("Error fetching volcanoes:", err);
      setError(err instanceof Error ? err.message : "Failed to load volcano data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolcanoes();
  }, [fetchVolcanoes]);

  /**
   * Refresh volcano data
   */
  const refresh = useCallback(() => {
    fetchVolcanoes();
  }, [fetchVolcanoes]);

  return {
    volcanoes,
    isLoading,
    error,
    lastUpdated,
    refresh,
  };
}
