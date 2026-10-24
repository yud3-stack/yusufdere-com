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
  await Promise.all([document.fonts.load(`300 64px ${sans}`), document.fonts.load(`400 26px ${sans}`)]);
  const canvas = document.createElement("canvas");
  canvas.width = QUOTE_IMAGE_SIZE.width;
  canvas.height = QUOTE_IMAGE_SIZE.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Görsel oluşturulamadı.");
  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = INK;

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
  drawText(ctx, input.author, sans, 639, 1110, 330, 70, 26, 300);
  if (input.authorDetail) drawText(ctx, input.authorDetail, sans, 639, 1182, 330, 64, 23, 300);
  ctx.fillStyle = "#66666b";
  if (input.sourceLabel) drawText(ctx, `Kaynak: ${input.sourceLabel}`, sans, 115, 1570, 850, 80, 22, 400);
  if (input.sourceNote) drawText(ctx, input.sourceNote, sans, 115, 1634, 850, 50, 18, 400);
  if (portrait && input.portraitCredit) drawText(ctx, `Fotoğraf: ${input.portraitCredit} · SB / kırpılmış`, sans, 115, 1680, 850, 50, 17, 400);
  ctx.fillStyle = INK;
  drawText(ctx, "yusufdere.com / günün sözü", sans, 115, 1750, 850, 50, 23, 400);

  const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(
    (value) => value ? resolve(value) : reject(new Error("Görsel oluşturulamadı.")), "image/png",
  ));
  return new File([blob], `yusufdere-gunun-sozu${input.date ? `-${input.date}` : ""}.png`, { type: "image/png" });
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
    return;
  }
  throw new Error("Metin paylaşım şablonuna sığmıyor.");
}
