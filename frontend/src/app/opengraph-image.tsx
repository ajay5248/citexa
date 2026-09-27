import { ImageResponse } from "next/og";

export const alt = "Citexa-AI: Get recommended by ChatGPT, Gemini and Perplexity";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #020617 0%, #0b1a3a 60%, #1e1b4b 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 36, fontWeight: 700, color: "#38bdf8" }}>Citexa-AI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.1 }}>
            When customers ask AI for a recommendation, is your business named?
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#cbd5e1" }}>
            AI visibility checks and fixes for ChatGPT, Gemini and Perplexity
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#94a3b8" }}>www.citexa.online</div>
      </div>
    ),
    size
  );
}
