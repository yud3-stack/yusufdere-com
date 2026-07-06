import { en, type Dictionary } from "@/dictionaries/en";
import { tr } from "@/dictionaries/tr";
import type { Locale } from "@/lib/locale";

export const dictionaries: Record<Locale, Dictionary> = {
  en,
  tr,
};

export function getDictionary(locale: Locale = "en") {
  return dictionaries[locale];
}

export type { Dictionary };
