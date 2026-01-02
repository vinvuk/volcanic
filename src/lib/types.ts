/**
 * Volcano data structure from Smithsonian GVP
 */
export interface Volcano {
  id: string;
  name: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  elevation: number;
  type: string;
  status: VolcanoStatus;
  lastEruption?: string;
  vei?: number;
  description?: string;
  tectonicSetting?: string;
  rockTypes?: string[];
}

/**
 * Volcano activity status levels
 */
export type VolcanoStatus =
  | "normal"      // Green - no unusual activity
  | "advisory"    // Yellow - elevated unrest
  | "watch"       // Orange - heightened/escalating unrest
  | "warning"     // Red - hazardous eruption imminent/underway
  | "erupting";   // Active eruption in progress

/**
 * Status configuration for visualization
 */
export const STATUS_CONFIG: Record<VolcanoStatus, {
  label: string;
  color: string;
  glowColor: string;
  description: string;
}> = {
  normal: {
    label: "Normal",
    color: "#22ff66",
    glowColor: "rgba(34, 255, 102, 0.5)",
    description: "Volcano is in typical background state",
  },
  advisory: {
    label: "Advisory",
    color: "#ffee00",
    glowColor: "rgba(255, 238, 0, 0.5)",
    description: "Elevated unrest above known background levels",
  },
  watch: {
    label: "Watch",
    color: "#ff9900",
    glowColor: "rgba(255, 153, 0, 0.6)",
    description: "Heightened or escalating unrest with increased potential",
  },
  warning: {
    label: "Warning",
    color: "#ff4444",
    glowColor: "rgba(255, 68, 68, 0.7)",
    description: "Hazardous eruption is imminent or underway",
  },
  erupting: {
    label: "Erupting",
    color: "#ff2200",
    glowColor: "rgba(255, 34, 0, 0.9)",
    description: "Active volcanic eruption in progress",
  },
};

/**
 * Volcano type categories
 */
export type VolcanoType =
  | "Stratovolcano"
  | "Shield"
  | "Caldera"
  | "Complex"
  | "Submarine"
  | "Cinder cone"
  | "Lava dome"
  | "Other";

/**
 * API response for volcano list
 */
export interface VolcanoApiResponse {
  volcanoes: Volcano[];
  lastUpdated: string;
  totalCount: number;
}
