import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export const alt = "IF/ELSE Intelligence LMS — Applied AI Engineering";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

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
          backgroundColor: "#080b12",
          backgroundImage:
            "radial-gradient(circle at 50% 30%, rgba(47, 91, 208, 0.15) 0%, transparent 60%)",
          color: "#E8EDF7",
          padding: "48px 64px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Brand Tag */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              borderRadius: 9999,
              backgroundColor: "rgba(47, 91, 208, 0.15)",
              border: "1px solid rgba(111, 160, 255, 0.3)",
              color: "#6FA0FF",
              fontFamily: "monospace",
              fontSize: 14,
              letterSpacing: "0.1em",
              marginBottom: 32,
              textTransform: "uppercase",
            }}
          >
            <span>{"<IF/E>"}</span>
            <span>INTELLIGENCE LMS</span>
          </div>

          {/* Heading */}
          <h1
            style={{
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              marginBottom: 16,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>Beyond Binaries</span>
          </h1>

          {/* Subheading */}
          <p
            style={{
              fontSize: 24,
              color: "#8B97AD",
              maxWidth: 720,
              margin: 0,
              marginBottom: 40,
              lineHeight: 1.4,
            }}
          >
            Enterprise applied AI engineering curricula. Production RAG, Autonomous Agent
            Architectures, and Computer Vision pipelines.
          </p>

          {/* Telemetry pill row */}
          <div
            style={{
              display: "flex",
              gap: 16,
              fontFamily: "monospace",
              fontSize: 14,
              color: "#6FA0FF",
            }}
          >
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                backgroundColor: "#0F1522",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              [RAG_ENGINEERING]
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                backgroundColor: "#0F1522",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              [AGENTIC_STATE_MACHINES]
            </div>
            <div
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                backgroundColor: "#0F1522",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              [VERIFIABLE_CREDENTIALS]
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
