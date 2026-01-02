import type { Metadata } from "next";
import { Cormorant_Garamond, IBM_Plex_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Display font - Cormorant Garamond
 * Used for headlines, hero text, and dramatic typography
 */
const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/**
 * Body font - IBM Plex Sans
 * Used for body text, UI elements, and general content
 */
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

/**
 * Monospace font - JetBrains Mono
 * Used for data displays, coordinates, and technical information
 */
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Volcanic | Real-Time Volcano Tracker",
  description: "Monitor Earth's volcanic activity like never before. Track volcanoes worldwide with stunning 3D visualization.",
  keywords: ["volcano tracker", "volcanic activity", "eruptions", "seismic", "real-time", "3D visualization"],
  authors: [{ name: "Volcanic" }],
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Volcanic | Real-Time Volcano Tracker",
    description: "Monitor Earth's volcanic activity like never before.",
    type: "website",
    url: "https://viewvolcano.com",
  },
  metadataBase: new URL("https://viewvolcano.com"),
};

/**
 * Root layout component that wraps all pages
 * Applies global fonts and styles
 * @param children - Child components to render
 * @returns The root HTML structure with fonts applied
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${cormorantGaramond.variable} ${ibmPlexSans.variable} ${jetBrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
