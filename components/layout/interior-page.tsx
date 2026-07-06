import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";

type InteriorPageProps = {
  children: React.ReactNode;
};

export function InteriorPage({ children }: InteriorPageProps) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-screen overflow-hidden">{children}</main>
      <SiteFooter />
    </>
  );
}
