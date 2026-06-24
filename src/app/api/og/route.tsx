import { ImageResponse } from "next/og";

export const runtime = "edge";

const size = {
  width: 1200,
  height: 630,
};
const displayDomain = "wendanswertoday.org";

function cleanText(value: string | null, fallback: string) {
  return (value ?? fallback).slice(0, 120);
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = cleanText(searchParams.get("title"), "LinkedIn Games Answers Today");
  const subtitle = cleanText(
    searchParams.get("subtitle"),
    "Spoiler-safe hints, answers, solvers, and archives.",
  );

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#f8fafc",
          color: "#0f172a",
          display: "flex",
          fontFamily: "Arial, Helvetica, sans-serif",
          height: "100%",
          justifyContent: "center",
          padding: 56,
          width: "100%",
        }}
      >
        <div
          style={{
            background: "#ffffff",
            border: "2px solid #d8e2f0",
            borderRadius: 32,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "space-between",
            padding: 52,
            width: "100%",
          }}
        >
          <div style={{ alignItems: "center", display: "flex", justifyContent: "space-between" }}>
            <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
              <div
                style={{
                  alignItems: "center",
                  background: "#2563eb",
                  borderRadius: 22,
                  color: "#ffffff",
                  display: "flex",
                  fontSize: 36,
                  fontWeight: 900,
                  height: 84,
                  justifyContent: "center",
                  width: 84,
                }}
              >
                W
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ color: "#2563eb", fontSize: 28, fontWeight: 900 }}>
                  WendAnswerToday.org
                </div>
                <div style={{ color: "#64748b", fontSize: 22 }}>Unofficial LinkedIn Games help</div>
              </div>
            </div>
            <div
              style={{
                background: "#dcfce7",
                border: "1px solid #86efac",
                borderRadius: 999,
                color: "#166534",
                fontSize: 24,
                fontWeight: 800,
                padding: "14px 22px",
              }}
            >
              Updated today
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div
              style={{
                color: "#0f172a",
                fontSize: 68,
                fontWeight: 950,
                lineHeight: 1.05,
                maxWidth: 920,
              }}
            >
              {title}
            </div>
            <div style={{ color: "#475569", fontSize: 32, lineHeight: 1.35, maxWidth: 950 }}>
              {subtitle}
            </div>
          </div>

          <div style={{ alignItems: "center", display: "flex", gap: 16 }}>
            {["Hints", "Solver", "Archive"].map((item) => (
              <div
                key={item}
                style={{
                  background: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: 16,
                  color: "#1d4ed8",
                  fontSize: 24,
                  fontWeight: 800,
                  padding: "14px 20px",
                }}
              >
                {item}
              </div>
            ))}
            <div style={{ color: "#64748b", fontSize: 24, marginLeft: "auto" }}>{displayDomain}</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
