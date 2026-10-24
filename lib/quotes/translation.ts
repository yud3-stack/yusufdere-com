import { plainText } from "./discovery.ts";
import { quoteJson } from "./remote.ts";

const stopwords = new Set("a an the is are be been being to of and or for as in on at it its that this with by his her their we you our my can will would should could do does did have has had".split(" "));
function words(text: string) {
  return new Set((text.toLowerCase().match(/[a-z]+/g) ?? []).filter((word) => word.length > 2 && !stopwords.has(word)));
}
export function translationPasses(original: string, turkish: string, back: string): boolean {
  if (turkish.length < 10 || turkish.length > 320 || turkish.toLowerCase() === original.toLowerCase()) return false;
  if (!/[çğıöşü]|\b(bir|ve|için|olan|olarak|ile|bu|da|de)\b/i.test(turkish)) return false;
  const numbers = (text: string) => (text.match(/\d+/g) ?? []).sort().join(",");
  if (numbers(original) !== numbers(turkish) || numbers(original) !== numbers(back)) return false;
  const negative = (text: string) => /\b(not|no|never|cannot|without)\b|n't\b/i.test(text);
  if (negative(original) !== negative(back)) return false;
  const expected = words(original);
  const actual = words(back);
  if (!expected.size) return false;
  return [...expected].filter((word) => actual.has(word)).length / expected.size >= 0.65;
}

async function translate(text: string, pair: string, signal: AbortSignal) {
  if (Buffer.byteLength(text, "utf8") > 500) throw new Error("Ücretsiz çeviri için metin fazla uzun.");
  const url = new URL("https://api.mymemory.translated.net/get");
  url.search = new URLSearchParams({ q: text, langpair: pair, mt: "1" }).toString();
  const result = await quoteJson(url, signal);
  if (Number(result.responseStatus) !== 200 || result.quotaFinished || typeof result.responseData?.translatedText !== "string")
    throw new Error("Ücretsiz çeviri kotası veya servis şu an uygun değil.");
  const translated = plainText(result.responseData.translatedText);
  if (/MYMEMORY WARNING|USED ALL AVAILABLE|QUERY LENGTH LIMIT|INVALID LANGUAGE|PLEASE SELECT/i.test(translated))
    throw new Error("Ücretsiz çeviri servisi metin döndürmedi.");
  return translated;
}

export async function translateQuote(original: string, signal: AbortSignal): Promise<string> {
  const turkish = await translate(original, "en|tr", signal);
  const back = await translate(turkish, "tr|en", signal);
  if (!translationPasses(original, turkish, back)) throw new Error("Çeviri kontrolleri geçmedi; elle inceleme gerekiyor.");
  return turkish;
}
