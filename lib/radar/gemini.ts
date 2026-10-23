import "server-only";
import { z } from "zod";
import type { RadarCandidate } from "./rss";

const digestSchema = z.object({
  summary: z.string().min(40).max(1200),
  items: z
    .array(
      z.object({
        title: z.string().min(3).max(200),
        why: z.string().min(20).max(400),
        url: z.string().url(),
        source: z.string().min(2).max(80),
      }),
    )
    .min(3)
    .max(8),
  followUps: z
    .array(
      z.object({
        title: z.string().min(3).max(200),
        url: z.string().url(),
        source: z.string().min(2).max(80),
      }),
    )
    .max(3)
    .default([]),
});

export type RadarDigestPayload = z.infer<typeof digestSchema>;

const DEFAULT_GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
  "gemini-flash-latest",
] as const;

export function getGeminiConnection() {
  const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  const configured = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODELS[0];
  const models = [configured, ...DEFAULT_GEMINI_MODELS.filter(model => model !== configured)];
  return {
    apiKeyConfigured: Boolean(apiKey),
    model: configured,
    models,
    ready: Boolean(apiKey),
  };
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model JSON döndürmedi.");
  }
  return JSON.parse(raw.slice(start, end + 1)) as unknown;
}

export async function generateRadarDigest(candidates: RadarCandidate[]): Promise<{
  digest: RadarDigestPayload;
  model: string;
}> {
  const connection = getGeminiConnection();
  if (!connection.ready) {
    throw new Error("GEMINI_API_KEY tanımlı değil.");
  }
  if (candidates.length < 5) {
    throw new Error("Derleme için yeterli aday haber bulunamadı.");
  }

  const allowed = new Map(candidates.map(item => [item.url.replace(/\/$/, "").toLowerCase(), item]));
  const catalog = candidates.map((item, index) => ({
    id: index + 1,
    title: item.title,
    url: item.url,
    source: item.sourceName,
    publishedAt: item.publishedAt,
  }));

  const prompt = `Sen Yusuf Dere için kişisel bir yazılım Radar editörüsün.
Görevin: aşağıdaki ADAY listesinden web geliştirme / yazılım ekosistemi için en önemli gelişmeleri seçmek.

Kurallar:
- Çıktı dili Türkçe olacak.
- Yalnızca listedeki url'leri kullan. Yeni link uydurma.
- Clickbait, iş ilanı, politik tartışma ve alakasız içerikleri ele.
- Next.js, React, TypeScript, web platformu, backend, developer tools konularını önceliklendir.
- summary: 2-3 cümlelik haftalık özet.
- items: 5-8 madde. Her maddede title, why (neden önemli, 1-2 cümle), url, source.
- followUps: okunursa iyi olur diye 0-3 ekstra link (items ile çakışmasın).
- Yalnızca geçerli JSON döndür. Markdown veya açıklama yazma.

JSON şema:
{"summary":"string","items":[{"title":"string","why":"string","url":"string","source":"string"}],"followUps":[{"title":"string","url":"string","source":"string"}]}

ADAYLAR:
${JSON.stringify(catalog)}`;

  let text = "";
  let usedModel = connection.model;
  let lastError = "Gemini isteği başarısız.";

  for (const model of connection.models) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-goog-api-key": process.env.GEMINI_API_KEY!.trim(),
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            responseMimeType: "application/json",
          },
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(60000),
      },
    );

    const payload = (await response.json()) as {
      error?: { message?: string };
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };

    if (!response.ok) {
      lastError = payload.error?.message || `Gemini HTTP ${response.status}`;
      const retryable =
        response.status === 404 ||
        response.status === 503 ||
        /no longer available|not found|high demand|overloaded/i.test(lastError);
      if (retryable) continue;
      throw new Error(lastError);
    }

    text = payload.candidates?.[0]?.content?.parts?.map(part => part.text ?? "").join("") ?? "";
    if (!text.trim()) {
      lastError = "Gemini boş yanıt döndürdü.";
      continue;
    }
    usedModel = model;
    break;
  }

  if (!text.trim()) {
    throw new Error(lastError);
  }

  const parsed = digestSchema.parse(extractJson(text));

  const filterAllowed = <T extends { url: string; title: string; source: string }>(rows: T[]) => {
    const out: T[] = [];
    const used = new Set<string>();
    for (const row of rows) {
      const key = row.url.replace(/\/$/, "").toLowerCase();
      const match = allowed.get(key);
      if (!match || used.has(key)) continue;
      used.add(key);
      out.push({ ...row, url: match.url, source: match.sourceName, title: row.title || match.title });
    }
    return out;
  };

  const items = filterAllowed(parsed.items);
  const followUps = filterAllowed(parsed.followUps).filter(
    item => !items.some(selected => selected.url.replace(/\/$/, "").toLowerCase() === item.url.replace(/\/$/, "").toLowerCase()),
  );

  if (items.length < 3) {
    throw new Error("Model geçerli kaynaklı yeterli madde üretmedi. Tekrar dene.");
  }

  return {
    model: usedModel,
    digest: {
      summary: parsed.summary.trim(),
      items,
      followUps: followUps.slice(0, 3),
    },
  };
}
