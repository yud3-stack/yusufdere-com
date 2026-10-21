const wordsPerMinute = 210;

export function countWords(markdown: string) {
  const text = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[#>*_~|[\]()]/g, " ");

  if (!text.trim()) {
    return 0;
  }

  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingMinutes(markdown: string) {
  const words = countWords(markdown);

  if (words === 0) {
    return 0;
  }

  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function readingLabel(markdown: string) {
  const words = countWords(markdown);
  const minutes = readingMinutes(markdown);

  if (words === 0 || minutes === 0) {
    return "0 kelime";
  }

  return `${words.toLocaleString("tr-TR")} kelime · ~${minutes} dk okuma`;
}
