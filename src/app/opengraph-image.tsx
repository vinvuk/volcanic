import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Volcanic - Real-Time Volcano Tracker";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/**
 * Generate Open Graph image for social sharing
 * Creates a branded image with volcanic theme
 * @returns ImageResponse with the OG image
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
            style={{ filter: "drop-shadow(0 0 12px rgba(255,68,0,0.8))" }}
          >
            <defs>
              <linearGradient id="glow" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ff6b3d" }} />
                <stop offset="100%" style={{ stopColor: "#c41e00" }} />
              </linearGradient>
            </defs>
            <path
              d="M16 4 L28 28 L4 28 Z"
              fill="none"
              stroke="url(#glow)"
              strokeWidth="2"
              strokeLinejoin="round"
            />
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
