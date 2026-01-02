import { NextResponse } from "next/server";
import { Volcano, VolcanoStatus, VolcanoApiResponse } from "@/lib/types";
import { fetchActiveEruptions, ActiveEruption } from "@/lib/gvp-eruptions";

/**
 * Cached volcano data with timestamp
 */
let cachedData: { volcanoes: Volcano[]; timestamp: number } | null = null;
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours in milliseconds

/**
 * GVP GeoServer WFS endpoint for Holocene volcanoes
 * Returns GeoJSON with all volcanoes from the Smithsonian Global Volcanism Program
 */
const GVP_GEOJSON_URL =
  "https://webservices.volcano.si.edu/geoserver/GVP-VOTW/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=GVP-VOTW:Smithsonian_VOTW_Holocene_Volcanoes&outputFormat=application/json";

/**
 * Currently erupting volcanoes - fetched dynamically from GVP
 * This will be populated by fetchActiveEruptions()
 */
let activeEruptions: Map<string, ActiveEruption> = new Map();

/**
 * Volcanoes with elevated activity (warning/watch status)
 * Based on USGS and local observatory alerts
 */
const WARNING_VOLCANO_IDS = new Set([
  "263250", // Merapi
  "341090", // Popocatépetl
  "342090", // Fuego
  "263340", // Agung
]);

const WATCH_VOLCANO_IDS = new Set([
  "352010", // Cotopaxi
  "212040", // Santorini
  "357120", // Villarrica
  "282110", // Aso
  "311070", // Grímsvötn
  "264020", // Krakatau
  "263310", // Bromo
]);

const ADVISORY_VOLCANO_IDS = new Set([
  "264140", // Raung
  "383010", // Teide
  "223020", // Nyiragongo
  "221080", // Erta Ale
  "264020", // Krakatau
  "273070", // Taal
  "211010", // Campi Flegrei
  "311060", // Katla
  "241040", // White Island
]);

/**
 * Determine volcano status based on current activity
 * Uses live eruption data from GVP + manual elevated activity lists
 * @param volcanoId - GVP volcano number
 * @returns VolcanoStatus
 */
function determineStatus(volcanoId: string): VolcanoStatus {
  // Check live eruption data first
  if (activeEruptions.has(volcanoId)) return "erupting";
  // Fall back to manual lists for elevated activity
  if (WARNING_VOLCANO_IDS.has(volcanoId)) return "warning";
  if (WATCH_VOLCANO_IDS.has(volcanoId)) return "watch";
  if (ADVISORY_VOLCANO_IDS.has(volcanoId)) return "advisory";
  return "normal";
}

/**
 * Parse GeoJSON feature to Volcano object
 * @param feature - GeoJSON feature from GVP
 * @returns Volcano object
 */
function parseGeoJSONFeature(feature: GVPFeature): Volcano {
  const props = feature.properties;
  const coords = feature.geometry.coordinates;

  const volcanoId = String(props.Volcano_Number);

  return {
    id: volcanoId,
    name: props.Volcano_Name,
    country: props.Country || "Unknown",
    region: props.Subregion || props.Region || "Unknown",
    latitude: coords[1],
    longitude: coords[0],
    elevation: props.Elevation || 0,
    type: props.Primary_Volcano_Type || "Unknown",
    status: determineStatus(volcanoId),
    lastEruption: props.Last_Eruption_Year
      ? String(props.Last_Eruption_Year)
      : undefined,
    description: props.Tectonic_Setting
      ? `${props.Primary_Volcano_Type} volcano in ${props.Tectonic_Setting} setting.`
      : undefined,
    tectonicSetting: props.Tectonic_Setting || undefined,
    rockTypes: props.Major_Rock_Type
      ? [props.Major_Rock_Type]
      : undefined,
  };
}

/**
 * GeoJSON feature interface from GVP
 */
interface GVPFeature {
  type: "Feature";
  geometry: {
    type: "Point";
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    Volcano_Number: number;
    Volcano_Name: string;
    Country: string;
    Region: string;
    Subregion: string;
    Primary_Volcano_Type: string;
    Elevation: number;
    Last_Eruption_Year: number | null;
    Tectonic_Setting: string;
    Major_Rock_Type: string;
  };
}

/**
 * GeoJSON response interface
 */
interface GVPGeoJSON {
  type: "FeatureCollection";
  features: GVPFeature[];
}

/**
 * Fetch volcano data from Smithsonian GVP GeoServer
 * Also fetches live eruption data to determine status
 * @returns Array of volcano data
 */
async function fetchVolcanoData(): Promise<Volcano[]> {
  try {
    console.log("Fetching volcano data from GVP GeoServer...");

    // Fetch live eruption data first
    activeEruptions = await fetchActiveEruptions();

    const response = await fetch(GVP_GEOJSON_URL, {
      next: { revalidate: 21600 }, // 6 hour cache
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GVP API returned ${response.status}`);
    }

    const geojson: GVPGeoJSON = await response.json();

    if (!geojson.features || !Array.isArray(geojson.features)) {
      throw new Error("Invalid GeoJSON response");
    }

    console.log(`Received ${geojson.features.length} volcanoes from GVP`);

    const volcanoes = geojson.features
      .filter(
        (f) =>
          f.geometry &&
          f.geometry.coordinates &&
          f.properties &&
          f.properties.Volcano_Name
      )
      .map(parseGeoJSONFeature);

    // Sort by status priority, then by name
    const statusPriority: Record<VolcanoStatus, number> = {
      erupting: 0,
      warning: 1,
      watch: 2,
      advisory: 3,
      normal: 4,
    };

    volcanoes.sort((a, b) => {
      const priorityDiff = statusPriority[a.status] - statusPriority[b.status];
      if (priorityDiff !== 0) return priorityDiff;
      return a.name.localeCompare(b.name);
    });

    return volcanoes;
  } catch (error) {
    console.error("Error fetching from GVP:", error);
    // Return fallback data
    return getFallbackVolcanoData();
  }
}

/**
 * Fallback data in case GVP API is unavailable
 */
function getFallbackVolcanoData(): Volcano[] {
  return [
    {
      id: "300150",
      name: "Kilauea",
      country: "United States",
      region: "Hawaiian Islands",
      latitude: 19.421,
      longitude: -155.287,
      elevation: 1222,
      type: "Shield",
      status: "erupting",
      lastEruption: "2024",
      vei: 1,
    },
    {
      id: "211040",
      name: "Stromboli",
      country: "Italy",
      region: "Aeolian Islands",
      latitude: 38.789,
      longitude: 15.213,
      elevation: 924,
      type: "Stratovolcano",
      status: "erupting",
      lastEruption: "2024",
      vei: 2,
    },
    {
      id: "211060",
      name: "Etna",
      country: "Italy",
      region: "Sicily",
      latitude: 37.748,
      longitude: 14.999,
      elevation: 3357,
      type: "Stratovolcano",
      status: "erupting",
      lastEruption: "2024",
      vei: 2,
    },
    {
      id: "282080",
      name: "Sakurajima",
      country: "Japan",
      region: "Kyushu",
      latitude: 31.585,
      longitude: 130.657,
      elevation: 1117,
      type: "Stratovolcano",
      status: "erupting",
      lastEruption: "2024",
      vei: 2,
    },
    {
      id: "263300",
      name: "Semeru",
      country: "Indonesia",
      region: "Java",
      latitude: -8.108,
      longitude: 112.922,
      elevation: 3676,
      type: "Stratovolcano",
      status: "erupting",
      lastEruption: "2024",
      vei: 2,
    },
  ];
}

/**
 * GET handler for volcano data API
 * Returns cached data if available, otherwise fetches fresh data
 */
export async function GET(): Promise<NextResponse<VolcanoApiResponse>> {
  try {
    // Check cache
    const now = Date.now();
    if (cachedData && now - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        volcanoes: cachedData.volcanoes,
        lastUpdated: new Date(cachedData.timestamp).toISOString(),
        totalCount: cachedData.volcanoes.length,
      });
    }

    // Fetch fresh data
    const volcanoes = await fetchVolcanoData();

    // Update cache
    cachedData = {
      volcanoes,
      timestamp: now,
    };

    // Count by status for logging
    const statusCounts = volcanoes.reduce(
      (acc, v) => {
        acc[v.status] = (acc[v.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
    console.log("Volcano status counts:", statusCounts);

    return NextResponse.json({
      volcanoes,
      lastUpdated: new Date(now).toISOString(),
      totalCount: volcanoes.length,
    });
  } catch (error) {
    console.error("Error in volcano API:", error);
    return NextResponse.json(
      {
        volcanoes: getFallbackVolcanoData(),
        lastUpdated: new Date().toISOString(),
        totalCount: 5,
      },
      { status: 500 }
    );
  }
}
