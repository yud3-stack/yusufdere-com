import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

// Adds this project only. Existing projects and their publication state stay intact.
// Preview: node --env-file=.env.local --env-file=.env.seed.local scripts/add-standart-culture.mjs
// Publish: append --write to the same command.
async function main() {
const write = process.argv.includes("--write");
const slug = "standart-culture";
const content = await readFile(new URL("../content/projects/standart-culture.md", import.meta.url), "utf8");
const cover = await readFile(new URL("../public/images/projects/standart-culture-cover.webp", import.meta.url));
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;
if (!url || !key) throw new Error("Supabase bağlantısı ve sunucu anahtarı gerekli.");
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data: existing, error: lookupError } = await client.from("projects").select("id,slug").eq("slug", slug).maybeSingle();
if (lookupError) throw new Error("Mevcut proje kontrol edilemedi.");
if (existing) {
  console.log(JSON.stringify({ action: "already-exists", slug, id: existing.id }));
  return;
}
const id = randomUUID();
const path = `projects/${id}/${randomUUID()}.webp`;
const project = {
  id,
  title: "StandArt Culture",
  slug,
  description: "Marka kimliğini ve projelerini öne çıkaran, Türkçe ve İngilizce web sitesi. İçerik yönetimi ve tasarım talep akışlarıyla birlikte geliştirdim.",
  content,
  technologies: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Supabase"],
  live_url: "https://www.standartculture.com/",
  github_url: null,
  cover_image: path,
  featured: true,
  status: "published",
  published_at: new Date().toISOString(),
};
if (!write) {
  console.log(JSON.stringify({ action: "preview", project, coverBytes: cover.length }, null, 2));
  return;
}
const { error: uploadError } = await client.storage.from("project-covers").upload(path, cover, { contentType: "image/webp", upsert: false });
if (uploadError) throw new Error("Kapak yüklenemedi; proje oluşturulmadı.");
const { error: insertError } = await client.from("projects").insert(project);
if (insertError) {
  await client.storage.from("project-covers").remove([path]);
  throw new Error("Proje kaydedilemedi; kapak yüklemesi geri alındı.");
}
const { data: saved, error: verifyError } = await client.from("projects").select("id,title,slug,cover_image,status").eq("id", id).single();
if (verifyError || saved.cover_image !== path || saved.status !== "published") throw new Error("Proje kaydı doğrulanamadı.");
const publicClient = createClient(url, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, { auth: { persistSession: false } });
const { data: visible, error: publicError } = await publicClient.from("projects").select("slug").eq("slug", slug).eq("status", "published").single();
const { data: coverUrl } = client.storage.from("project-covers").getPublicUrl(path);
const imageResponse = await fetch(coverUrl.publicUrl);
if (publicError || !visible || !imageResponse.ok) throw new Error("Public proje veya kapak erişimi doğrulanamadı.");
console.log(JSON.stringify({ action: "published", ...saved, publicRead: true, coverRead: true }));
}

await main();
