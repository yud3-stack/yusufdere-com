export type QuoteShareInput = {
  text: string; author: string; authorDetail?: string;
  portraitSrc?: string; portraitCredit?: string;
  sourceLabel?: string; sourceNote?: string; date?: string;
};

export const QUOTE_IMAGE_SIZE = { width: 1080, height: 1920 } as const;
const INK = "#111111";
const PAPER = "#F4F4F6";

export async function renderQuoteShareImage(input: QuoteShareInput) {
  await document.fonts.ready;
  const sans = getComputedStyle(document.documentElement)
    .getPropertyValue("--font-sans").trim() || "sans-serif";
  await Promise.all([document.fonts.load(`300 64px ${sans}`), document.fonts.load(`400 26px ${sans}`), document.fonts.load(`500 29px ${sans}`), document.fonts.load(`600 28px ${sans}`)]);
  const canvas = document.createElement("canvas");
  canvas.width = QUOTE_IMAGE_SIZE.width;
  canvas.height = QUOTE_IMAGE_SIZE.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Görsel oluşturulamadı.");
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = INK;
  drawFacetedBackground(ctx);
  drawEditionHeader(ctx, sans);

  // Independent paths preserve the narrow paper gutter in the reference.
  ctx.beginPath();
  ctx.moveTo(374, 584);
  ctx.bezierCurveTo(226, 602, 115, 714, 115, 837);
  ctx.lineTo(115, 1091);
  ctx.lineTo(369, 1091);
  ctx.lineTo(369, 837);
  ctx.lineTo(252, 837);
  ctx.bezierCurveTo(263, 765, 308, 707, 374, 684);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(377, 837);
  ctx.lineTo(631, 837);
  ctx.lineTo(631, 1091);
  ctx.bezierCurveTo(631, 1220, 523, 1329, 374, 1344);
  ctx.lineTo(374, 1244);
  ctx.bezierCurveTo(441, 1221, 484, 1164, 494, 1091);
  ctx.lineTo(377, 1091);
  ctx.closePath();
  ctx.fill();

  let portrait: HTMLImageElement | undefined;
  if (input.portraitSrc) {
    try { portrait = await loadImage(input.portraitSrc); } catch { /* Initials fallback below. */ }
  }
  if (portrait) {
    const side = Math.min(portrait.naturalWidth, portrait.naturalHeight);
    ctx.save();
    ctx.filter = "grayscale(1) contrast(1.08)";
    ctx.drawImage(portrait, (portrait.naturalWidth - side) / 2, 0, side, side, 639, 837, 258, 254);
    ctx.restore();
  } else {
    ctx.fillStyle = "#dedee1";
    ctx.fillRect(639, 837, 258, 254);
    ctx.fillStyle = INK;
    ctx.font = `300 68px ${sans}`;
    ctx.textAlign = "center";
    ctx.fillText(input.author.split(/\s+/).map((word) => word[0]).slice(0, 3).join(""), 768, 984);
    ctx.textAlign = "left";
  }

  drawText(ctx, input.text, sans, 420, 516, 560, 290, 64, 300);
  const authorHeight = drawText(ctx, input.author, sans, 639, 1110, 330, 70, 26, 300);
  if (input.authorDetail) drawText(ctx, input.authorDetail, sans, 639, 1110 + authorHeight + 12, 330, 64, 23, 300);
  drawEditionFooter(ctx, sans, input, Boolean(portrait));

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
    (value) => value ? resolve(value) : reject(new Error("Görsel oluşturulamadı.")), "image/png",
  ));
  return new File([blob], `yusufdere-gunun-sozu${input.date ? `-${input.date}` : ""}.png`, { type: "image/png" });
}

// Fixed geometry keeps every daily edition consistent; no image request is needed.
function drawFacetedBackground(ctx: CanvasRenderingContext2D) {
  const rows = [
    [[-80, -70], [345, -45], [725, -65], [1150, -30]],
    [[-45, 420], [405, 235], [850, 490], [1140, 330]],
    [[-90, 850], [260, 720], [720, 825], [1160, 960]],
    [[-65, 1300], [435, 1395], [885, 1230], [1140, 1450]],
    [[-80, 1705], [310, 1635], [695, 1700], [1150, 1640]],
    [[-55, 2000], [390, 1990], [810, 2005], [1150, 1990]],
  ];
  const shades = ["#f8f8f8", "#ededee", "#e3e3e4", "#f4f4f5", "#fafafa", "#e9e9ea"];
  let face = 0;
  function triangle(points: number[][]) {
    const gradient = ctx.createLinearGradient(points[0][0], points[0][1], points[2][0], points[2][1]);
    gradient.addColorStop(0, shades[face % shades.length]);
    gradient.addColorStop(1, shades[(face + 2) % shades.length]);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    points.forEach(([x, y], index) => index ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
    ctx.closePath(); ctx.fill(); face++;
  }
  for (let row = 0; row < rows.length - 1; row++) {
    for (let column = 0; column < 3; column++) {
      const a = rows[row][column], b = rows[row][column + 1];
      const c = rows[row + 1][column], d = rows[row + 1][column + 1];
      if ((row + column) % 2) { triangle([a, b, c]); triangle([b, d, c]); }
      else { triangle([a, b, d]); triangle([a, d, c]); }
    }
  }
  // Soften the texture around the unchanged central composition for legibility.
  const veil = ctx.createRadialGradient(610, 920, 170, 610, 920, 780);
  veil.addColorStop(0, "rgba(244,244,246,0.9)");
  veil.addColorStop(1, "rgba(244,244,246,0)");
  ctx.fillStyle = veil;
  ctx.fillRect(0, 0, 1080, 1920);
}

function drawEditionHeader(ctx: CanvasRenderingContext2D, family: string) {
  ctx.fillStyle = INK;
  drawText(ctx, "YUSUF DERE", family, 115, 169, 240, 42, 29, 500);
  drawText(ctx, "/", family, 365, 169, 36, 42, 29, 400);
  ctx.fillStyle = "#E6EDC3";
  ctx.beginPath(); ctx.roundRect(416, 156, 245, 55, 7); ctx.fill();
  ctx.fillStyle = INK;
  drawText(ctx, "GÜNÜN SÖZÜ", family, 435, 169, 210, 40, 28, 600);
  ctx.fillStyle = INK;
}

function drawEditionFooter(ctx: CanvasRenderingContext2D, family: string, input: QuoteShareInput, hasPortrait: boolean) {
  const signature = "yusufdere.com";
  const x = 115;
  ctx.fillStyle = "#087c4b";
  ctx.fillRect(x, 1624, 62, 5);
  ctx.fillStyle = INK;
  drawText(ctx, signature, family, x, 1650, 400, 45, 29, 400);
  ctx.fillStyle = "#66666b";
  if (hasPortrait && input.portraitCredit) drawText(ctx, `Fotoğraf: ${input.portraitCredit} · SB / kırpılmış`, family, x, 1701, 850, 38, 16, 400);
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    const timer = setTimeout(() => reject(new Error("Portre yüklenemedi.")), 10000);
    image.crossOrigin = "anonymous";
    image.onload = () => { clearTimeout(timer); resolve(image); };
    image.onerror = () => { clearTimeout(timer); reject(new Error("Portre yüklenemedi.")); };
    image.src = src;
  });
}

function drawText(ctx: CanvasRenderingContext2D, text: string, family: string,
  x: number, y: number, width: number, height: number, initialSize: number, weight: number) {
  for (let size = initialSize; size >= 12; size--) {
    ctx.font = `${weight} ${size}px ${family}`;
    const lines: string[] = [];
    for (const paragraph of text.split("\n")) {
      let line = "";
      for (const word of paragraph.trim().split(/\s+/)) {
        const candidate = line ? `${line} ${word}` : word;
        if (line && ctx.measureText(candidate).width > width) { lines.push(line); line = word; }
        else line = candidate;
      }
      lines.push(line);
    }
    const lineHeight = Math.ceil(size * 1.12);
    if (lines.length * lineHeight > height || lines.some((line) => ctx.measureText(line).width > width)) continue;
    ctx.textBaseline = "top";
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
    return lines.length * lineHeight;
  }
  throw new Error("Metin paylaşım şablonuna sığmıyor.");
}
