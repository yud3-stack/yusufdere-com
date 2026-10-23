import "server-only";
import { generateRadarDigest, getGeminiConnection } from "./gemini";
import { collectRadarCandidates } from "./rss";
import { saveRadarDigest } from "./admin";
import { currentWeekStart } from "./week";

export async function compileWeeklyRadar() {
  if (!getGeminiConnection().ready) {
    return { data: null, error: "GEMINI_API_KEY eksik. Google AI Studio’dan ücretsiz anahtar ekle." };
  }

  const collected = await collectRadarCandidates(7);
  if (collected.items.length < 5) {
    const detail = collected.errors.slice(0, 3).join(" · ");
    return {
      data: null,
      error: detail
        ? `Yeterli kaynak okunamadı. ${detail}`
        : "Son 7 günden yeterli aday haber toplanamadı.",
    };
  }

  try {
    const generated = await generateRadarDigest(collected.items);
    const sourcesUsed = [...new Set(generated.digest.items.map(item => item.source))];
    return saveRadarDigest({
      weekStart: currentWeekStart(),
      digest: generated.digest,
      sourcesUsed,
      model: generated.model,
    });
  } catch (error) {
    console.error("[Radar compile]", {
      type: error instanceof Error ? error.name : "unknown",
    });
    const message = error instanceof Error ? error.message : "Derleme başarısız.";
    // Never leak API key material; keep message short and user-facing.
    if (/api key|permission|403|401/i.test(message)) {
      return { data: null, error: "Gemini isteği reddedildi. API anahtarını ve model adını kontrol et." };
    }
    if (/not found|no longer available|404/i.test(message)) {
      return {
        data: null,
        error:
          "Seçilen Gemini modeli bu anahtar için kapalı. .env.local içinde GEMINI_MODEL=gemini-flash-lite-latest yapıp sunucuyu yeniden başlat.",
      };
    }
    if (/high demand|overloaded|503/i.test(message)) {
      return { data: null, error: "Gemini şu an yoğun. Bir dakika sonra tekrar dene." };
    }
    if (/quota|rate|429/i.test(message)) {
      return { data: null, error: "Gemini ücretsiz kotası dolmuş olabilir. Biraz sonra tekrar dene." };
    }
    return { data: null, error: "Radar derlemesi tamamlanamadı. Kaynakları veya modeli kontrol edip tekrar dene." };
  }
}
