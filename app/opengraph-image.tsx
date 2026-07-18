import { ImageResponse } from "next/og";

export const alt =
  "Rubik Solver: a 3D Rubik's Cube solver that runs in the browser";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A scrambled-looking face using the app's actual sticker colors
const FACE = [
  "#009e60",
  "#c41e3a",
  "#f5f5f5",
  "#ffd500",
  "#0051ba",
  "#009e60",
  "#ff5800",
  "#f5f5f5",
  "#c41e3a",
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#09090b",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "620px",
          }}
        >
          <div
            style={{
              fontSize: 26,
              color: "#34d399",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            Kociemba two-phase algorithm
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 64,
              fontWeight: 700,
              color: "#f4f4f5",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
            }}
          >
            Any scramble, solved in about twenty moves.
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 28,
              color: "#a1a1aa",
              lineHeight: 1.4,
            }}
          >
            A 3D Rubik&apos;s Cube solver that runs entirely in your browser.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            width: "320px",
            height: "320px",
            backgroundColor: "#18181b",
            borderRadius: "24px",
            padding: "16px",
            gap: "8px",
          }}
        >
          {FACE.map((color, i) => (
            <div
              key={i}
              style={{
                width: "90px",
                height: "90px",
                borderRadius: "12px",
                backgroundColor: color,
              }}
            />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
