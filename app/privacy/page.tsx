import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { PageIntro } from "@/components/layout/PageIntro";
import { analyticsProviderLabel, getAnalyticsConfig } from "@/lib/cookies/analytics";
import { site } from "@/data/site";
import { getSiteUrl } from "@/lib/site";
import { defaultSocialImage } from "@/lib/social";

const title = "Gizlilik ve Çerezler";
const description =
  "YusufDere.com’da hangi verilerin işlendiği, hangi çerezlerin kullanıldığı ve tercihlerin nasıl yönetildiği.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: `${getSiteUrl()}/privacy` },
  openGraph: {
    title,
    description,
    url: `${getSiteUrl()}/privacy`,
    type: "website",
    images: [defaultSocialImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultSocialImage.url],
  },
};

export default function PrivacyPage() {
  const analytics = getAnalyticsConfig();
  const providerName = analyticsProviderLabel(analytics);

  return (
    <div className="privacy-page">
      <Container>
        <PageIntro
          eyebrow="BİLGİLENDİRME"
          title="Gizlilik ve çerezler."
          description="Bu sayfa sitenin güncel çerez ve tercih sistemini anlatır. Analytics yalnızca açık onaydan sonra yüklenir."
        />
      </Container>

      <section className="about-section">
        <Container>
          <h2>Bu site ne için var?</h2>
          <div className="about-prose">
            <p>
              YusufDere.com kişisel bir marka alanıdır. Burada yazılar, projeler ve iletişim bilgileri
              yayınlanır. Amaç ziyaretçiyi izlemek değil; içeriği okunabilir ve hızlı tutmaktır.
            </p>
          </div>
        </Container>
      </section>

      <section className="about-section">
        <Container>
          <h2>Çerez kategorileri</h2>
          <div className="about-prose">
            <p>
              Tercihler cihazındaki yerel depolamada saklanır ve sunucuya gönderilmez. Banner üzerinden
              kabul, ret veya kategori bazlı ayar yapabilirsin.
            </p>
          </div>
          <div className="privacy-cards">
            <article className="focus-card">
              <h3>Gerekli</h3>
              <p>
                Admin oturumu ve temel güvenlik için gereken çerezler. Bunlar site yönetimini mümkün kılar
                ve kapatılamaz.
              </p>
            </article>
            <article className="focus-card">
              <h3>Tercih kaydı</h3>
              <p>
                Çerez kararın tarayıcında tutulur. Böylece her ziyarette aynı soruyu tekrar sormayız.
                Temizlersen panel yeniden açılır.
              </p>
            </article>
            <article className="focus-card">
              <h3>Analytics</h3>
              <p>
                {providerName
                  ? `Şu an yapılandırılmış sağlayıcı: ${providerName}. Script yalnızca analytics onayı varsa yüklenir.`
                  : "Şu an analytics sağlayıcısı yapılandırılmamış. Onay versen bile script yüklenmez; env ile Plausible, Umami veya GA4 bağlanabilir."}
              </p>
            </article>
          </div>
        </Container>
      </section>

      <section className="about-section">
        <Container>
          <h2>Tercihlerini nasıl yönetirsin?</h2>
          <div className="about-prose">
            <p>
              İlk ziyarette altta çerez paneli görünür. <strong>Kabul et</strong> analytics’e izin verir,{" "}
              <strong>Reddet</strong> yalnızca gerekli çerezleri bırakır, <strong>Ayarlar</strong> ile
              kategorileri tek tek seçebilirsin.
            </p>
            <p>
              Daha sonra footer’daki <strong>Çerez tercihleri</strong> bağlantısından paneli yeniden
              açabilirsin. Onayı geri çekersen analytics script’i bir sonraki yüklemede gelmez.
            </p>
          </div>
        </Container>
      </section>

      <section className="about-section">
        <Container>
          <h2>İletişim</h2>
          <div className="about-prose">
            <p>
              Gizlilik veya çerezler hakkında bir sorun varsa{" "}
              <a href={`mailto:${site.email}`}>{site.email}</a> adresine yazabilirsin.
            </p>
            <p>
              Genel içerik için <Link href="/about">Hakkımda</Link> sayfasına, projelere bakmak için{" "}
              <Link href="/projects">Projeler</Link> sayfasına dönebilirsin.
            </p>
          </div>
        </Container>
      </section>
    </div>
  );
}
