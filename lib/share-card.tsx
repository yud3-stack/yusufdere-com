/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

type StoryShareImageProps = {
  logoUrl: string;
  contentTypeLabel: string;
  title: string;
  description: string;
  locale?: "en" | "tr";
};

const storySize = {
  width: 1080,
  height: 1920,
};

export function createStoryShareImage({
  logoUrl,
  contentTypeLabel,
  title,
  description,
}: StoryShareImageProps) {
  const safeTitle = truncateText(title, 105);
  const safeDescription = truncateText(description, 210);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 78% 12%, rgba(255,255,255,0.09), transparent 30%), radial-gradient(circle at 12% 88%, rgba(255,255,255,0.06), transparent 28%), #050505",
          color: "#f7f7f5",
          padding: "96px",
          position: "relative",
          fontFamily:
            "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 48,
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 44,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 96,
            right: 96,
            top: 560,
            height: 1,
            background: "rgba(255,255,255,0.12)",
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              width: 112,
              height: 112,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 28,
              background: "#ffffff",
              border: "1px solid rgba(255,255,255,0.76)",
              boxShadow:
                "0 24px 80px rgba(0,0,0,0.34), inset 0 0 0 1px rgba(0,0,0,0.08)",
            }}
          >
            <img
              src={logoUrl}
              alt="Yusuf Dere"
              width={84}
              height={84}
              style={{
                display: "block",
                objectFit: "contain",
                filter: "brightness(0) contrast(1.6)",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 999,
              padding: "14px 22px",
              color: "rgba(247,247,245,0.68)",
              fontSize: 25,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            {contentTypeLabel}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 42,
            maxWidth: 820,
            marginTop: 180,
          }}
        >
          <div
            style={{
              display: "flex",
              color: "rgba(247,247,245,0.56)",
              fontSize: 30,
              letterSpacing: 7,
              textTransform: "uppercase",
            }}
          >
            YusufDere.com
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 96,
              lineHeight: 1,
              letterSpacing: -2,
              fontWeight: 500,
            }}
          >
            {safeTitle}
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 770,
              color: "rgba(247,247,245,0.72)",
              fontSize: 38,
              lineHeight: 1.45,
            }}
          >
            {safeDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 36,
            color: "rgba(247,247,245,0.64)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "#f7f7f5",
              }}
            >
              Yusuf Dere
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 24,
              }}
            >
              Building the life I imagined.
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            yusufdere.com
          </div>
        </div>
      </div>
    ),
    storySize,
  );
}

function truncateText(value: string, maxLength: number) {
  const trimmed = value.trim();

  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, maxLength - 1).trimEnd()}…`;
}
