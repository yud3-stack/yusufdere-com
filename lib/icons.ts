import type { ComponentType } from "react";
import {
  Activity,
  AppWindow,
  Bike,
  BookOpen,
  Bot,
  Camera,
  Car,
  Code2,
  Coffee,
  ExternalLink,
  Globe,
  Headphones,
  ImageIcon,
  Keyboard,
  Laptop,
  Monitor,
  Mouse,
  Package,
  PenLine,
  Smartphone,
  Sparkles,
  Terminal,
} from "lucide-react";

export const supportedIconKeys = [
  "laptop",
  "phone",
  "headphones",
  "camera",
  "code",
  "app",
  "globe",
  "sparkles",
  "book",
  "monitor",
  "keyboard",
  "mouse",
  "terminal",
  "bot",
  "package",
  "coffee",
  "car",
  "motorcycle",
  "pen",
  "image",
  "external-link",
  "activity",
] as const;

export type IconKey = (typeof supportedIconKeys)[number];
export type IconComponent = ComponentType<{ className?: string }>;

const iconMap: Record<IconKey, IconComponent> = {
  laptop: Laptop,
  phone: Smartphone,
  headphones: Headphones,
  camera: Camera,
  code: Code2,
  app: AppWindow,
  globe: Globe,
  sparkles: Sparkles,
  book: BookOpen,
  monitor: Monitor,
  keyboard: Keyboard,
  mouse: Mouse,
  terminal: Terminal,
  bot: Bot,
  package: Package,
  coffee: Coffee,
  car: Car,
  motorcycle: Bike,
  pen: PenLine,
  image: ImageIcon,
  "external-link": ExternalLink,
  activity: Activity,
};

const iconAliases: Record<string, IconKey> = {
  iphone: "phone",
  mobile: "phone",
  smartphone: "phone",
  macbook: "laptop",
  computer: "laptop",
  pc: "laptop",
  vscode: "code",
  "vs-code": "code",
  "visual-studio-code": "code",
  earbuds: "headphones",
  airpods: "headphones",
  buds: "headphones",
  ai: "bot",
  chatgpt: "bot",
  assistant: "bot",
  "sony-camera": "camera",
  dslr: "camera",
  harpe: "mouse",
  mousepad: "mouse",
  motorbike: "motorcycle",
  bike: "motorcycle",
  writing: "pen",
  journal: "pen",
  photo: "image",
  gallery: "image",
  spark: "sparkles",
};

export function normalizeIconKey(value: string | null | undefined): IconKey {
  const normalized = value?.trim().toLowerCase();

  if (!normalized) {
    return "package";
  }

  if (isSupportedIconKey(normalized)) {
    return normalized;
  }

  return iconAliases[normalized] || "package";
}

export function resolveIcon(value: string | null | undefined): IconComponent {
  return iconMap[normalizeIconKey(value)];
}

function isSupportedIconKey(value: string): value is IconKey {
  return supportedIconKeys.includes(value as IconKey);
}
