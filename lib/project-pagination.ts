export function projectPage(total: number, anchor: number, size: number) {
  const pages = Math.max(1, Math.ceil(total / size));
  const page = Math.min(pages - 1, Math.max(0, Math.floor(anchor / size)));
  const start = page * size;
  return { page, pages, start, end: Math.min(total, start + size) };
}
