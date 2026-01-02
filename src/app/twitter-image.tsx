import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Volcanic - Real-Time Volcano Tracker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Generate Twitter card image for social sharing
 * Creates a branded image with volcanic theme
 * @returns ImageResponse with the Twitter card image
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#020206",
          backgroundImage:
            "radial-gradient(circle at 50% 120%, #1a0a0a 0%, #020206 50%)",
        }}
      >
        {/* Glow effect */}
        <div
          style={{
            position: "absolute",
            bottom: -100,
            width: 600,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(255,34,0,0.3) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Volcano icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 32 32"
            style={{ filter: "drop-shadow(0 0 20px rgba(255,68,0,0.5))" }}
          >
            <defs>
              <linearGradient id="lava" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ff4400" }} />
                <stop offset="50%" style={{ stopColor: "#ff2200" }} />
                <stop offset="100%" style={{ stopColor: "#cc1100" }} />
              </linearGradient>
              <linearGradient id="mountain" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#4a4a52" }} />
                <stop offset="100%" style={{ stopColor: "#2a2a32" }} />
              </linearGradient>
            </defs>
            <path d="M16 8 L26 26 L6 26 Z" fill="url(#mountain)" />
            <ellipse cx="16" cy="9" rx="4" ry="1.5" fill="#1a1a1e" />
            <ellipse cx="16" cy="6" rx="3" ry="2" fill="url(#lava)" opacity="0.9" />
            <circle cx="14" cy="4" r="1" fill="#ff4400" />
            <circle cx="18" cy="3" r="0.8" fill="#ff6600" />
            <circle cx="16" cy="2" r="1.2" fill="#ff2200" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "#f5f5f0",
            letterSpacing: "-0.02em",
            marginBottom: 16,
          }}
        >
          Volcanic
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: "#a0a0a8",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            marginBottom: 40,
          }}
        >
          Real-Time Volcano Tracker
        </div>

        {/* Features */}
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 20,
            color: "#707078",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#ff2200",
              }}
            />
            <span>1,400+ Volcanoes</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#ff9900",
              }}
            />
            <span>3D Globe</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                backgroundColor: "#22ff66",
              }}
            />
            <span>Live Eruptions</span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "#505058",
          }}
        >
          viewvolcano.com
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
