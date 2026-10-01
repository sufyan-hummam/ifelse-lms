import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 14,
          background: "#080b12",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6FA0FF",
          fontFamily: "monospace",
          fontWeight: 800,
          borderRadius: 6,
          border: "1px solid rgba(111, 160, 255, 0.4)",
        }}
      >
        {"<I>"}
      </div>
    ),
    {
      ...size,
    }
  );
}
