export type ProjectVisualKind =
  "audio" | "api" | "planner" | "voice" | "generic";

export const projectsEditorial = {
  eyebrow: "FİKİRDEN ÜRÜNE / PROJELER",
  title: ["Düşündüm,", "geliştirdim,"],
  emphasis: "hayata geçirdim.",
  description: "Gerçek ihtiyaçlardan yola çıkarak geliştirdiğim uygulamalar, araçlar ve ürünler.",
  signature: "Building the life I imagined.",
} as const;

export const projectPresentations: Readonly<
  Record<
    string,
    {
      kind: ProjectVisualKind;
      category: string;
      tagline: string;
      intro: string;
    }
  >
> = {
  "standart-culture": {
    kind: "generic",
    category: "Web / Marka sitesi",
    tagline: "İki dilli marka ve proje sitesi",
    intro: "Marka kimliğini ve projelerini öne çıkaran, Türkçe ve İngilizce web sitesi.",
  },
  winsoundmixer: {
    kind: "audio",
    category: "Masaüstü / Windows",
    tagline: "Windows uygulamaları için ses kontrolü",
    intro: "Uygulamaların sesini ve oynatma cihazlarını tek yerden yönet.",
  },
  requestlab: {
    kind: "api",
    category: "Web / Geliştirici araçları",
    tagline: "API kayıt ve tekrar oynatma aracı",
    intro: "API isteklerini kaydet, incele ve test ortamında yeniden çalıştır.",
  },
  reklampilot: {
    kind: "planner",
    category: "Web / İçerik ve reklam yönetimi",
    tagline: "İçerik ve reklam yönetimi",
    intro:
      "İçerik planlama ve reklam yönetimini tek bir çalışma alanında birleştir.",
  },
  llmvoice: {
    kind: "voice",
    category: "Yapay zekâ / Ses üretimi",
    tagline: "Yerel ses üretimi",
    intro:
      "Metinlerini yerel çalışan ses üretimi ve ses klonlama araçlarıyla sese dönüştür.",
  },
};

export const audioChannels = [
  { name: "Sistem", level: 72 },
  { name: "Tarayıcı", level: 46 },
  { name: "Müzik", level: 85 },
] as const;

export const waveform = [
  14, 24, 18, 38, 52, 28, 67, 84, 46, 31, 62, 96, 74, 44, 57, 83, 48, 27, 64,
  79, 42, 22, 51, 69, 38, 18, 33, 49, 25, 13,
] as const;
