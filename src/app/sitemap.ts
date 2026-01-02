import { MetadataRoute } from "next";

/**
 * Generate sitemap for search engines
 * @returns Sitemap configuration array
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://viewvolcano.com";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}?ui=2`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}?ui=3`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}
