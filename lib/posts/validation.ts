import { z } from "zod";
import type { ContentStatus } from "@/types/db";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const postSchema = z
  .object({
    title: z.string().min(1, "Başlık gerekli.").max(180, "Başlık çok uzun."),
    slug: z
      .string()
      .min(1, "Slug gerekli.")
      .max(180, "Slug çok uzun.")
      .regex(slugPattern, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
    excerpt: z.string().max(500, "Özet en fazla 500 karakter olabilir."),
    categoryId: z.union([z.uuid("Kategori geçersiz."), z.null()]),
    tags: z
      .array(z.string().min(1, "Etiket boş olamaz.").max(40, "Etiket çok uzun."))
      .max(20, "En fazla 20 etiket eklenebilir."),
    content: z.string().max(200_000, "İçerik çok uzun."),
    status: z.enum(["draft", "published"], { error: "Durum geçersiz." }),
  })
  .superRefine((value, context) => {
    if (value.status === "published" && value.content.trim().length === 0) {
      context.addIssue({
        code: "custom",
        message: "Yayınlamak için içerik gerekli.",
        path: ["content"],
      });
    }

    const seen = new Set<string>();

    for (const tag of value.tags) {
      const key = tag.toLocaleLowerCase("tr-TR");

      if (seen.has(key)) {
        context.addIssue({
          code: "custom",
          message: "Aynı etiket iki kez eklenemez.",
          path: ["tags"],
        });
        break;
      }

      seen.add(key);
    }
  });

export type PostInput = {
  title: string;
  slug: string;
  excerpt: string | null;
  categoryId: string | null;
  tags: string[];
  content: string;
  status: ContentStatus;
};

export function parsePostForm(formData: FormData) {
  const status = String(formData.get("status") ?? "");
  let tags: unknown = [];

  try {
    tags = JSON.parse(String(formData.get("tags") ?? "[]"));
  } catch {
    tags = null;
  }

  if (!Array.isArray(tags)) {
    return { data: null, error: "Etiketler geçersiz." };
  }

  const categoryId = String(formData.get("category_id") ?? "").trim();
  const parsed = postSchema.safeParse({
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    excerpt: String(formData.get("excerpt") ?? "").trim(),
    categoryId: categoryId || null,
    tags: tags.map((tag) => String(tag).trim()).filter(Boolean),
    content: String(formData.get("content") ?? ""),
    status,
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Form geçersiz." };
  }

  const input: PostInput = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    excerpt: parsed.data.excerpt || null,
    categoryId: parsed.data.categoryId,
    tags: parsed.data.tags,
    content: parsed.data.content,
    status: parsed.data.status,
  };

  return { data: input, error: null };
}

const categorySchema = z.object({
  name: z.string().trim().min(1, "Kategori adı gerekli.").max(80, "Kategori adı çok uzun."),
});

export function parseCategoryName(name: string) {
  const parsed = categorySchema.safeParse({ name });

  if (!parsed.success) {
    return { name: null, error: parsed.error.issues[0]?.message ?? "Kategori geçersiz." };
  }

  return { name: parsed.data.name, error: null };
}
