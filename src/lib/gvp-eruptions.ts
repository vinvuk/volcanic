/**
 * GVP Eruption Data Service
 * Fetches currently erupting volcanoes from Smithsonian GVP GeoServer
 */

/**
 * GVP E3WebApp eruption endpoint
 * Contains eruption data since 1960 with ContinuingEruption flag
 */
const GVP_ERUPTIONS_URL =
  "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:E3WebApp_Eruptions1960&outputFormat=application/json";

/**
 * Eruption data from GVP
 */
interface GVPEruption {
  VolcanoNumber: number;
  VolcanoName: string;
  ContinuingEruption: string;
  StartDate: string | null;
  StartDateYear: number;
  ExplosivityIndexMax: number | null;
}

/**
 * GeoJSON response from GVP
 */
interface GVPEruptionsResponse {
  type: "FeatureCollection";
  features: Array<{
    type: "Feature";
    properties: GVPEruption;
  }>;
}

/**
 * Active eruption info
 */
export interface ActiveEruption {
  volcanoId: string;
  volcanoName: string;
  startDate: string | null;
  vei: number | null;
}

/**
 * Cache for eruption data
 */
let eruptionCache: {
  eruptions: Map<string, ActiveEruption>;
  timestamp: number;
} | null = null;

const ERUPTION_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch currently erupting volcanoes from GVP
 * @returns Map of volcano IDs to eruption info
 */
export async function fetchActiveEruptions(): Promise<Map<string, ActiveEruption>> {
  try {
    // Check cache
    const now = Date.now();
    if (eruptionCache && now - eruptionCache.timestamp < ERUPTION_CACHE_DURATION) {
      console.log(`Using cached eruption data (${eruptionCache.eruptions.size} active eruptions)`);
      return eruptionCache.eruptions;
    }

    console.log("Fetching active eruptions from GVP...");

    const response = await fetch(GVP_ERUPTIONS_URL, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GVP Eruptions API returned ${response.status}`);
    }

    const data: GVPEruptionsResponse = await response.json();

    // Filter for continuing eruptions
    const activeEruptions = new Map<string, ActiveEruption>();

    for (const feature of data.features) {
      const props = feature.properties;

      if (props.ContinuingEruption === "True") {
        const volcanoId = String(props.VolcanoNumber);

        // Only keep the most recent eruption for each volcano
        if (!activeEruptions.has(volcanoId)) {
          activeEruptions.set(volcanoId, {
            volcanoId,
            volcanoName: props.VolcanoName,
            startDate: props.StartDate,
            vei: props.ExplosivityIndexMax,
          });
        }
      }
    }

    console.log(`Found ${activeEruptions.size} currently erupting volcanoes`);

    // Update cache
    eruptionCache = {
      eruptions: activeEruptions,
      timestamp: now,
    };

    return activeEruptions;
  } catch (error) {
    console.error("Error fetching active eruptions:", error);

    // Return cached data if available, even if stale
    if (eruptionCache) {
      console.log("Using stale eruption cache due to fetch error");
      return eruptionCache.eruptions;
    }

    // Return empty map as fallback
    return new Map();
  }
}

/**
 * Check if a volcano is currently erupting
 * @param volcanoId - GVP volcano number
 * @returns True if volcano has an ongoing eruption
 */
export async function isVolcanoErupting(volcanoId: string): Promise<boolean> {
  const eruptions = await fetchActiveEruptions();
  return eruptions.has(volcanoId);
}

/**
 * Get eruption info for a volcano
 * @param volcanoId - GVP volcano number
 * @returns Eruption info or null if not erupting
 */
export async function getEruptionInfo(volcanoId: string): Promise<ActiveEruption | null> {
  const eruptions = await fetchActiveEruptions();
  return eruptions.get(volcanoId) || null;
}

/**
 * Force refresh of eruption cache
 * Useful for manual refresh triggers
 */
export function invalidateEruptionCache(): void {
  eruptionCache = null;
  console.log("Eruption cache invalidated");
}
