export async function quoteJson(url: URL, signal: AbortSignal) {
  const response = await fetch(url, {
    headers: { "User-Agent": "YusufDereQuotes/1.0 (https://www.yusufdere.com)", Accept: "application/json" },
    redirect: "error", cache: "no-store", signal: AbortSignal.any([signal, AbortSignal.timeout(6500)]),
  });
  if (!response.ok) throw new Error("Ücretsiz kaynağa şu an erişilemiyor.");
  const text = await response.text();
  if (text.length > 1_500_000) throw new Error("Kaynak yanıtı çok büyük.");
  return JSON.parse(text);
}
