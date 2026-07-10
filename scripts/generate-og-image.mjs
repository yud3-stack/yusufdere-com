import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "public", "images", "og");
const outputPath = path.join(outputDir, "yusufdere-og.png");

const width = 1200;
const height = 630;

async function loadSharp() {
  try {
    const { default: sharp } = await import("sharp");
    return sharp;
  } catch (error) {
    throw new Error(
      [
        "The OG image generator needs the local sharp package.",
        "It is installed with this project through Next.js optional dependencies.",
        "Run npm install, then run npm run generate:og again.",
      ].join("\n"),
      { cause: error },
    );
  }
}

function svg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="background" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#050505"/>
      <stop offset="0.48" stop-color="#0A0A0B"/>
      <stop offset="1" stop-color="#111111"/>
    </linearGradient>
    <radialGradient id="coastGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(990 190) rotate(142) scale(470 300)">
      <stop offset="0" stop-color="#D6D0C4" stop-opacity="0.2"/>
      <stop offset="0.42" stop-color="#8B8F97" stop-opacity="0.08"/>
      <stop offset="1" stop-color="#111111" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lowerGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(865 555) rotate(-24) scale(410 145)">
      <stop offset="0" stop-color="#B0A48F" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#050505" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lineFade" x1="120" y1="0" x2="1080" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.18" stop-color="#FFFFFF" stop-opacity="0.2"/>
      <stop offset="0.82" stop-color="#FFFFFF" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="28"/>
    </filter>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#background)"/>
  <rect width="${width}" height="${height}" fill="url(#coastGlow)"/>
  <rect width="${width}" height="${height}" fill="url(#lowerGlow)"/>

  <path d="M760 174C845 120 968 121 1082 152" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>
  <path d="M720 230C842 178 954 181 1110 223" stroke="#FFFFFF" stroke-opacity="0.07" stroke-width="1"/>
  <path d="M682 498C776 458 895 442 1058 470" stroke="#FFFFFF" stroke-opacity="0.08" stroke-width="1"/>

  <circle cx="1010" cy="210" r="132" fill="#FFFFFF" opacity="0.035" filter="url(#softBlur)"/>
  <circle cx="895" cy="500" r="92" fill="#C4B69B" opacity="0.045" filter="url(#softBlur)"/>

  <rect x="58" y="58" width="1084" height="514" rx="34" stroke="#FFFFFF" stroke-opacity="0.12"/>
  <rect x="82" y="82" width="1036" height="466" rx="24" stroke="#FFFFFF" stroke-opacity="0.055"/>

  <line x1="120" y1="445" x2="1080" y2="445" stroke="url(#lineFade)" stroke-width="1"/>

  <g transform="translate(124 114)">
    <rect x="0" y="0" width="64" height="64" rx="18" fill="#FFFFFF" fill-opacity="0.045" stroke="#FFFFFF" stroke-opacity="0.14"/>
    <text x="32" y="40" text-anchor="middle" fill="#F7F7F2" font-family="Geist, Inter, Arial, sans-serif" font-size="23" font-weight="700" letter-spacing="1">YD</text>
  </g>

  <text x="124" y="274" fill="#FAFAF7" font-family="Geist, Inter, Arial, sans-serif" font-size="88" font-weight="500" letter-spacing="-1">Yusuf Dere</text>
  <text x="128" y="334" fill="#E8E4DA" font-family="Geist, Inter, Arial, sans-serif" font-size="34" font-weight="400">Building the life I imagined.</text>
  <text x="128" y="390" fill="#A9A9A2" font-family="Geist, Inter, Arial, sans-serif" font-size="24" font-weight="400">Software, products, notes and photography from Samsun.</text>

  <g transform="translate(128 480)">
    <circle cx="8" cy="8" r="4" fill="#E8E4DA" opacity="0.7"/>
    <text x="28" y="15" fill="#B7B7B0" font-family="Geist, Inter, Arial, sans-serif" font-size="20" font-weight="400">yusufdere.com</text>
  </g>

  <g transform="translate(861 472)" opacity="0.62">
    <text x="0" y="0" fill="#B7B7B0" font-family="Geist, Inter, Arial, sans-serif" font-size="16" font-weight="500" letter-spacing="3">SAMSUN / TURKIYE</text>
    <line x1="0" y1="24" x2="214" y2="24" stroke="#FFFFFF" stroke-opacity="0.16"/>
  </g>
</svg>`;
}

const sharp = await loadSharp();

await mkdir(outputDir, { recursive: true });

await sharp(Buffer.from(svg()))
  .resize(width, height, { fit: "cover" })
  .flatten({ background: "#050505" })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputPath);

console.log(`Generated ${path.relative(rootDir, outputPath)}`);
