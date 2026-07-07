import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getDictionary, type Dictionary } from "@/dictionaries";
import type { Locale } from "@/lib/locale";

type InteriorPageProps = {
  children: React.ReactNode;
  locale?: Locale;
  dictionary?: Dictionary;
};

export function InteriorPage({
  children,
  locale = "en",
  dictionary = getDictionary(locale),
}: InteriorPageProps) {
  return (
    <>
      <SiteHeader locale={locale} dictionary={dictionary} variant="inner" />
      <main className="min-h-screen overflow-hidden">{children}</main>
      <SiteFooter dictionary={dictionary} />
    </>
  );
}
