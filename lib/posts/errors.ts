type WriteError = {
  code?: string;
  message?: string;
};

export function mapWriteError(error: WriteError) {
  const message = error.message ?? "";

  if (error.code === "23505" && (message.includes("posts_slug") || message.includes("projects_slug"))) {
    return "Bu slug zaten kullanılıyor.";
  }

  if (error.code === "23505" && message.includes("categories_slug")) {
    return "Bu kategori zaten var.";
  }

  if (error.code === "23505") {
    return "Bu kayıt zaten var.";
  }

  if (error.code === "23503") {
    return "Seçilen kategori bulunamadı.";
  }

  if (error.code === "42501" || /row-level security/i.test(message)) {
    return "Bu işlem için yetkin yok.";
  }

  return "İşlem tamamlanamadı.";
}
