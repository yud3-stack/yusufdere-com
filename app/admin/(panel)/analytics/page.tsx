import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChartNoAxesCombined } from "lucide-react";
import { AnalyticsConnection } from "@/components/admin/AnalyticsConnection";
import { AnalyticsMetrics, AnalyticsTables } from "@/components/admin/AnalyticsReport";
import { analyticsPeriod, analyticsPeriods } from "@/lib/analytics/report";
import { getGa4Connection, getGa4Report } from "@/lib/analytics/ga4";
import { getPublishedPosts } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "İstatistikler", robots: { index: false, follow: false } };

export default async function AnalyticsPage({ searchParams }: { searchParams: Promise<{ period?: string | string[] }> }) {
  const period = analyticsPeriod((await searchParams).period);
  const connection = getGa4Connection();
  const result = await getGa4Report(period);
  const posts = result.data ? await getPublishedPosts() : null;
  const titles = Object.fromEntries((posts?.data ?? []).map(post => [`/blog/${post.slug}`, post.title]));
  return <section className="admin-analytics-page">
    <div className="admin-page-heading"><div><p className="admin-eyebrow">ÖLÇ, ANLA, GELİŞTİR</p><h1>Ziyaret istatistikleri</h1><p>İçeriklerinin erişimi ve ölçülebilen ziyaretler, tek bir yerde.</p></div><a href="https://analytics.google.com/" target="_blank" rel="noopener noreferrer" className="admin-button">GA4’ü aç <ArrowUpRight size={16} /></a></div>
    <nav className="admin-periods" aria-label="İstatistik dönemi">{analyticsPeriods.map(days => <Link key={days} href={`/admin/analytics?period=${days}`} aria-current={period === days ? "page" : undefined}>Son {days} gün</Link>)}<span>Bugün dahil · GA4 mülkünün saat dilimi</span></nav>
    {result.error ? <p role="alert" className="admin-error">{result.error} Veriler yüklenemediği için sayılar gösterilmiyor.</p> : null}
    <AnalyticsMetrics report={result.data} />
    {!connection.ready ? <section className="admin-card admin-analytics-setup"><ChartNoAxesCombined size={28} /><div><h2>Gerçek veriler için GA4 bağlantısını tamamla.</h2><p>{connection.trackingConfigured ? "Site ölçümü yapılandırılmış. Toplanan verileri burada görmek için rapor erişimini tamamla." : "Ölçüm altyapısı hazır, ancak GA4 henüz bağlı değil. Kimlikler ve rapor erişimi eklendiğinde bu ekran gerçek verilerle çalışacak."}</p><ol><li>yusufdere.com için GA4 mülkü ve web veri akışı oluştur.</li><li>Ölçüm Kimliği ile sayısal Mülk Kimliği’ni yapılandır.</li><li>Gelişmiş ölçümde otomatik sayfa görüntülemelerini kapat; site, sayfa geçişlerini kendisi kaydeder.</li><li>Google Analytics Data API’yi aç ve yalnızca Görüntüleyici yetkili hizmet hesabını bağla.</li></ol><p>Özel anahtarı sohbetten veya panelden gönderme; yalnızca sunucu ortam değişkenlerinde sakla.</p></div></section> : null}
    {result.data ? <AnalyticsTables report={result.data} postTitles={titles} /> : null}
    {result.data?.limited ? <p className="admin-analytics-note">GA4 bu raporda veri eşiği veya gruplama uyguladığını bildirdi. Bazı ayrıntılar gösterilmeyebilir.</p> : null}
    <AnalyticsConnection connection={connection} />
    <p className="admin-analytics-note">Görüntülenme, yazının tamamen okunduğu anlamına gelmez. GA4 kullanıcı sayısı gerçek kişi sayısının birebir karşılığı değildir; günlük veya yazı bazındaki kullanıcılar toplanarak dönem toplamı hesaplanmaz. Onay vermeyen veya ölçümü engellenen ziyaretler eksik kalabilir. Raporlar gecikmeli güncellenebilir.</p>
  </section>;
}
