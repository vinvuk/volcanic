import { MetadataRoute } from "next";

/**
 * Generate PWA manifest for installable web app
 * Enables "Add to Home Screen" functionality
 * @returns Manifest configuration object
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Volcanic - Real-Time Volcano Tracker",
    short_name: "Volcanic",
    description:
      "Monitor Earth's volcanic activity like never before. Track 1,400+ volcanoes on an interactive 3D globe.",
    start_url: "/",
    display: "standalone",
    background_color: "#020206",
    theme_color: "#ff2200",
    orientation: "any",
    categories: ["education", "weather", "utilities"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
