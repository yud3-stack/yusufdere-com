import { z } from "zod";
import type { ContentStatus } from "@/types/db";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function optionalHttpUrl(value: string, label: string) {
  if (!value) {
    return { url: null as string | null, error: null as string | null };
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return { url: null, error: `${label} http veya https olmalıdır.` };
    }

    return { url: url.toString(), error: null };
  } catch {
    return { url: null, error: `${label} geçerli bir adres olmalıdır.` };
  }
}

const projectSchema = z
  .object({
    title: z.string().min(1, "Başlık gerekli.").max(180, "Başlık çok uzun."),
    slug: z
      .string()
      .min(1, "Slug gerekli.")
      .max(180, "Slug çok uzun.")
      .regex(slugPattern, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
    description: z.string().max(500, "Açıklama en fazla 500 karakter olabilir."),
    technologies: z
      .array(z.string().min(1, "Teknoloji boş olamaz.").max(40, "Teknoloji adı çok uzun."))
      .max(20, "En fazla 20 teknoloji eklenebilir."),
    githubUrl: z.string(),
    liveUrl: z.string(),
    content: z.string().max(200_000, "İçerik çok uzun."),
    featured: z.boolean(),
    status: z.enum(["draft", "published"], { error: "Durum geçersiz." }),
  })
  .superRefine((value, context) => {
    const seen = new Set<string>();

    for (const technology of value.technologies) {
      const key = technology.toLocaleLowerCase("tr-TR");

      if (seen.has(key)) {
        context.addIssue({
          code: "custom",
          message: "Aynı teknoloji iki kez eklenemez.",
          path: ["technologies"],
        });
        break;
      }

      seen.add(key);
    }
  });

export type ProjectInput = {
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  githubUrl: string | null;
  liveUrl: string | null;
  content: string | null;
  featured: boolean;
  status: ContentStatus;
};

export function parseProjectForm(formData: FormData) {
  const status = String(formData.get("status") ?? "");
  let technologies: unknown = [];

  try {
    technologies = JSON.parse(String(formData.get("technologies") ?? "[]"));
  } catch {
    technologies = null;
  }

  if (!Array.isArray(technologies)) {
    return { data: null, error: "Teknolojiler geçersiz." };
  }

  const parsed = projectSchema.safeParse({
    title: String(formData.get("title") ?? "").trim(),
    slug: String(formData.get("slug") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    technologies: technologies.map((item) => String(item).trim()).filter(Boolean),
    githubUrl: String(formData.get("github_url") ?? "").trim(),
    liveUrl: String(formData.get("live_url") ?? "").trim(),
    content: String(formData.get("content") ?? ""),
    featured: formData.get("featured") === "1",
    status,
  });

  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Form geçersiz." };
  }

  const github = optionalHttpUrl(parsed.data.githubUrl, "GitHub adresi");

  if (github.error) {
    return { data: null, error: github.error };
  }

  const live = optionalHttpUrl(parsed.data.liveUrl, "Canlı demo adresi");

  if (live.error) {
    return { data: null, error: live.error };
  }

  const input: ProjectInput = {
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    technologies: parsed.data.technologies,
    githubUrl: github.url,
    liveUrl: live.url,
    content: parsed.data.content.trim() ? parsed.data.content : null,
    featured: parsed.data.featured,
    status: parsed.data.status,
  };

  return { data: input, error: null };
}
