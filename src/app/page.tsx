"use client";

import { Suspense, useState, useCallback, useRef, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { VolcanoPanel } from "@/components/VolcanoPanel";
import { FilterControls } from "@/components/FilterControls";
import { LoadingScreen } from "@/components/LoadingScreen";
import { SearchBar } from "@/components/SearchBar";
import { NavigationControls } from "@/components/NavigationControls";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
// V2 Components
import { HeaderV2 } from "@/components/v2/HeaderV2";
import { EruptionTicker } from "@/components/v2/EruptionTicker";
import { VolcanoPanelV2 } from "@/components/v2/VolcanoPanelV2";
import { FloatingActions } from "@/components/v2/FloatingActions";
// V3 Components - Minimal
import { MinimalHeader } from "@/components/v3/MinimalHeader";
import { CompactPanel } from "@/components/v3/CompactPanel";
import { MiniControls } from "@/components/v3/MiniControls";
import { EruptionIndicator } from "@/components/v3/EruptionIndicator";
import { StatsBar } from "@/components/v3/StatsBar";
import { InfoModal, InfoButton } from "@/components/v3/InfoModal";
import { useVolcanoes } from "@/hooks/useVolcanoes";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { Volcano, VolcanoStatus } from "@/lib/types";
import type { SceneControls } from "@/components/Scene";

// Dynamic import for Scene to avoid SSR issues with Three.js
const Scene = dynamic(
  () => import("@/components/Scene").then((mod) => mod.Scene),
  { ssr: false }
);

/**
 * Main page component wrapper with Suspense boundary for useSearchParams
 */
export default function Home() {
  return (
    <Suspense fallback={<LoadingScreen isLoading={true} />}>
      <HomeContent />
    </Suspense>
  );
}

/**
 * Inner content component that uses URL search params
 * Manages global state and coordinates all child components
 */
function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { volcanoes, isLoading } = useVolcanoes();
  const [selectedVolcano, setSelectedVolcano] = useState<Volcano | null>(null);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [visibleStatuses, setVisibleStatuses] = useState<Set<string>>(
    new Set<VolcanoStatus>(["erupting", "warning", "watch", "advisory", "normal"])
  );
  const [hoveredVolcano, setHoveredVolcano] = useState<{
    volcano: { name: string; status: string };
    position: { x: number; y: number };
  } | null>(null);

  // UI state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [eruptingIndex, setEruptingIndex] = useState(0);
  const [initialUrlHandled, setInitialUrlHandled] = useState(false);

  // UI version - check URL param (1=original, 2=bottom sheet, 3=minimal)
  const uiParam = searchParams.get("ui");
  const uiVersion = uiParam === "3" ? 3 : uiParam === "2" ? 2 : 1;

  // Scene ref for camera controls
  const sceneRef = useRef<SceneControls>(null);

  /**
   * Handle initial URL parameter to select volcano on page load
   */
  useEffect(() => {
    if (initialUrlHandled || volcanoes.length === 0 || !sceneLoaded) return;

    const volcanoId = searchParams.get("v");
    if (volcanoId) {
      const volcano = volcanoes.find((v) => v.id === volcanoId);
      if (volcano) {
        setSelectedVolcano(volcano);
        // Small delay to ensure scene is ready
        setTimeout(() => {
          sceneRef.current?.rotateToLocation(volcano.latitude, volcano.longitude);
        }, 100);
      }
    }
    setInitialUrlHandled(true);
  }, [volcanoes, sceneLoaded, searchParams, initialUrlHandled]);

  /**
   * Update URL when volcano selection changes
   * Preserves the UI version parameter
   */
  const updateUrl = useCallback((volcano: Volcano | null) => {
    const params = new URLSearchParams();
    if (uiVersion > 1) {
      params.set("ui", String(uiVersion));
    }
    if (volcano) {
      params.set("v", volcano.id);
    }
    const queryString = params.toString();
    window.history.replaceState(
      null,
      "",
      queryString ? `?${queryString}` : window.location.pathname
    );
  }, [uiVersion]);

  /**
   * Handle volcano selection with URL update
   */
  const handleSelectVolcano = useCallback((volcano: Volcano | null) => {
    setSelectedVolcano(volcano);
    updateUrl(volcano);
  }, [updateUrl]);

  /**
   * Get list of erupting volcanoes for navigation
   */
  const eruptingVolcanoes = useMemo(
    () => volcanoes.filter((v) => v.status === "erupting"),
    [volcanoes]
  );

  /**
   * Handle scene load completion
   */
  const handleSceneLoadComplete = useCallback(() => {
    setSceneLoaded(true);
  }, []);

  /**
   * Toggle visibility of a volcano status
   * @param status - Status to toggle
   */
  const handleToggleStatus = useCallback((status: string) => {
    setVisibleStatuses((prev) => {
      const next = new Set(prev);
      if (next.has(status)) {
        next.delete(status);
      } else {
        next.add(status);
      }
      return next;
    });
  }, []);

  /**
   * Handle volcano hover for tooltip display
   * @param volcano - Hovered volcano info
   * @param screenPos - Screen position for tooltip
   */
  const handleHoverVolcano = useCallback(
    (
      volcano: { name: string; status: string } | null,
      screenPos: { x: number; y: number } | null
    ) => {
      if (volcano && screenPos) {
        setHoveredVolcano({ volcano, position: screenPos });
      } else {
        setHoveredVolcano(null);
      }
    },
    []
  );

  /**
   * Handle volcano selection from search
   */
  const handleSearchSelect = useCallback((volcano: Volcano) => {
    handleSelectVolcano(volcano);
    sceneRef.current?.rotateToLocation(volcano.latitude, volcano.longitude);
  }, [handleSelectVolcano]);

  /**
   * Handle my location - requires HTTPS in production
   */
  const handleMyLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    // Check if we're on HTTPS (required for geolocation in production)
    if (typeof window !== "undefined" && window.location.protocol === "http:" && window.location.hostname !== "localhost") {
      alert("Location requires a secure connection (HTTPS)");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        sceneRef.current?.rotateToLocation(
          position.coords.latitude,
          position.coords.longitude
        );
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);

        // Provide specific error messages
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert("Location permission denied. Please enable location access in your browser settings.");
            break;
          case error.POSITION_UNAVAILABLE:
            alert("Location information unavailable.");
            break;
          case error.TIMEOUT:
            alert("Location request timed out. Please try again.");
            break;
          default:
            alert("Unable to get your location.");
        }
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 60000
      }
    );
  }, []);

  /**
   * Handle close (panels, search, etc.)
   */
  const handleClose = useCallback(() => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    } else if (isHelpOpen) {
      setIsHelpOpen(false);
    } else if (isInfoOpen) {
      setIsInfoOpen(false);
    } else if (selectedVolcano) {
      handleSelectVolcano(null);
    }
  }, [isSearchOpen, isHelpOpen, isInfoOpen, selectedVolcano, handleSelectVolcano]);

  /**
   * Navigate to next erupting volcano
   */
  const handleNextErupting = useCallback(() => {
    if (eruptingVolcanoes.length === 0) return;
    const nextIndex = (eruptingIndex + 1) % eruptingVolcanoes.length;
    setEruptingIndex(nextIndex);
    const volcano = eruptingVolcanoes[nextIndex];
    handleSelectVolcano(volcano);
    sceneRef.current?.rotateToLocation(volcano.latitude, volcano.longitude);
  }, [eruptingVolcanoes, eruptingIndex, handleSelectVolcano]);

  /**
   * Navigate to previous erupting volcano
   */
  const handlePrevErupting = useCallback(() => {
    if (eruptingVolcanoes.length === 0) return;
    const prevIndex = (eruptingIndex - 1 + eruptingVolcanoes.length) % eruptingVolcanoes.length;
    setEruptingIndex(prevIndex);
    const volcano = eruptingVolcanoes[prevIndex];
    handleSelectVolcano(volcano);
    sceneRef.current?.rotateToLocation(volcano.latitude, volcano.longitude);
  }, [eruptingVolcanoes, eruptingIndex, handleSelectVolcano]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onSearch: () => setIsSearchOpen(true),
    onClose: handleClose,
    onHelp: () => setIsHelpOpen(true),
    onMyLocation: handleMyLocation,
    onZoomIn: () => sceneRef.current?.zoomIn(),
    onZoomOut: () => sceneRef.current?.zoomOut(),
    onResetView: () => sceneRef.current?.resetView(),
    onNextErupting: handleNextErupting,
    onPrevErupting: handlePrevErupting,
    isSearchOpen,
    isHelpOpen,
  });

  const showLoading = isLoading || !sceneLoaded;

  return (
    <main className="relative min-h-screen overflow-hidden bg-obsidian">
      {/* Loading Screen */}
      <LoadingScreen isLoading={showLoading} />

      {/* 3D Scene */}
      <Scene
        ref={sceneRef}
        volcanoes={volcanoes}
        selectedVolcano={selectedVolcano}
        onSelectVolcano={handleSelectVolcano}
        visibleStatuses={visibleStatuses}
        onLoadComplete={handleSceneLoadComplete}
        isLoading={isLoading}
        onHoverVolcano={handleHoverVolcano}
      />

      {/* UI Overlay */}
      <div className="content-layer pointer-events-none">
        {uiVersion === 1 && (
          <>
            {/* V1 UI - Original */}
            <Header />

            <NavigationControls
              onSearch={() => setIsSearchOpen(true)}
              onMyLocation={handleMyLocation}
              onZoomIn={() => sceneRef.current?.zoomIn()}
              onZoomOut={() => sceneRef.current?.zoomOut()}
              onResetView={() => sceneRef.current?.resetView()}
              onHelp={() => setIsHelpOpen(true)}
              isLocating={isLocating}
            />

            <VolcanoPanel
              volcano={selectedVolcano}
              onClose={() => handleSelectVolcano(null)}
            />

            <FilterControls
              volcanoes={volcanoes}
              visibleStatuses={visibleStatuses}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}

        {uiVersion === 2 && (
          <>
            {/* V2 UI - Bottom sheet */}
            <HeaderV2
              volcanoes={volcanoes}
              visibleStatuses={visibleStatuses}
              onToggleStatus={handleToggleStatus}
              onSearch={() => setIsSearchOpen(true)}
            />

            <EruptionTicker
              volcanoes={volcanoes}
              onSelectVolcano={handleSearchSelect}
            />

            <VolcanoPanelV2
              volcano={selectedVolcano}
              onClose={() => handleSelectVolcano(null)}
            />

            <FloatingActions
              eruptingVolcanoes={eruptingVolcanoes}
              onSelectVolcano={handleSearchSelect}
              onMyLocation={handleMyLocation}
              onResetView={() => sceneRef.current?.resetView()}
              onZoomIn={() => sceneRef.current?.zoomIn()}
              onZoomOut={() => sceneRef.current?.zoomOut()}
              onHelp={() => setIsHelpOpen(true)}
              isLocating={isLocating}
            />
          </>
        )}

        {uiVersion === 3 && (
          <>
            {/* V3 UI - Glass effects, bigger elements */}
            <MinimalHeader
              volcanoes={volcanoes}
              visibleStatuses={visibleStatuses}
              onToggleStatus={handleToggleStatus}
              onSearch={() => setIsSearchOpen(true)}
            />

            <CompactPanel
              volcano={selectedVolcano}
              onClose={() => handleSelectVolcano(null)}
            />

            <MiniControls
              eruptingVolcanoes={eruptingVolcanoes}
              onSelectVolcano={handleSearchSelect}
              onMyLocation={handleMyLocation}
              onResetView={() => sceneRef.current?.resetView()}
              onZoomIn={() => sceneRef.current?.zoomIn()}
              onZoomOut={() => sceneRef.current?.zoomOut()}
              onHelp={() => setIsHelpOpen(true)}
              isLocating={isLocating}
            />

            <EruptionIndicator
              volcanoes={volcanoes}
              onSelectVolcano={handleSearchSelect}
            />

            {/* Info button - bottom left */}
            <div className="fixed bottom-5 left-5 z-50 pointer-events-auto">
              <InfoButton onClick={() => setIsInfoOpen(true)} />
            </div>

            {/* Info Modal */}
            <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
          </>
        )}

        {/* Hover Tooltip (all versions) */}
        {hoveredVolcano && (
          <div
            className="fixed pointer-events-none z-50 glass-solid px-3 py-2 rounded-lg"
            style={{
              left: hoveredVolcano.position.x + 15,
              top: hoveredVolcano.position.y - 30,
            }}
          >
            <p className="text-sm font-medium text-cream">
              {hoveredVolcano.volcano.name}
            </p>
            <p className="text-xs text-silver capitalize">
              {hoveredVolcano.volcano.status}
            </p>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <SearchBar
        volcanoes={volcanoes}
        onSelectVolcano={handleSearchSelect}
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* Keyboard Shortcuts Modal */}
      <KeyboardShortcutsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </main>
  );
}
