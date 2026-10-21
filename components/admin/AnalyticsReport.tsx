import Link from "next/link";
import type { AnalyticsReport as Report } from "@/lib/analytics/report";

const integer = new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 });
function dayLabel(value: string) {
  return /^\d{8}$/.test(value) ? `${value.slice(6,8)}.${value.slice(4,6)}.${value.slice(0,4)}` : value;
}

export function AnalyticsMetrics({ report }: { report: Report | null }) {
  const metrics = [
    ["Kullanıcı (GA4)", report ? integer.format(report.users) : "—", "Seçili dönem için toplam kullanıcı"],
    ["Görüntülenme", report ? integer.format(report.views) : "—", "Public sayfaların açılma sayısı"],
    ["Oturum", report ? integer.format(report.sessions) : "—", "Seçili dönemdeki ziyaret oturumları"],
    ["Etkileşim oranı", report ? `%${(report.engagementRate*100).toLocaleString("tr-TR", {maximumFractionDigits:1})}` : "—", "GA4 etkileşimli oturum oranı"],
  ];
  return <div className="admin-metrics">{metrics.map(([label, value, note]) => <article className="admin-metric" key={label}><h2>{label}</h2><strong>{value}</strong><p>{note}</p></article>)}</div>;
}

export function AnalyticsTables({ report, postTitles }: { report: Report; postTitles: Record<string,string> }) {
  const maximum = Math.max(1, ...report.daily.map(day => day.views));
  return <div className="admin-analytics-reports">
    <section className="admin-card admin-activity"><div className="admin-card-heading"><h2>Günlük görüntülenme</h2><span>{report.timeZone ? `GA4 saat dilimi: ${report.timeZone}` : "GA4 raporu"}</span></div>
      {report.daily.length ? <><ol className="admin-activity-bars" aria-label="Günlere göre görüntülenmeler">{report.daily.map(day => <li key={day.date} title={`${dayLabel(day.date)}: ${integer.format(day.views)} görüntülenme`} aria-label={`${dayLabel(day.date)}: ${integer.format(day.views)} görüntülenme`}><span style={{height:`${day.views/maximum*100}%`}} /></li>)}</ol><details className="admin-activity-details"><summary>Günlük sayıları göster</summary><div className="admin-table-scroll"><table><caption className="sr-only">Günlük GA4 ölçümleri</caption><thead><tr><th scope="col">Tarih</th><th scope="col">Görüntülenme</th><th scope="col">Kullanıcı</th></tr></thead><tbody>{report.daily.map(day => <tr key={day.date}><td>{dayLabel(day.date)}</td><td>{integer.format(day.views)}</td><td>{integer.format(day.users)}</td></tr>)}</tbody></table></div></details></> : <p className="admin-empty">Seçili dönemde günlük veri bulunmuyor.</p>}
    </section>
    <section className="admin-card"><div className="admin-card-heading"><h2>Yazı performansı</h2><span>En fazla görüntülenen 20 yazı yolu</span></div><div className="admin-table-scroll"><table><caption className="sr-only">Blog detay sayfalarının görüntülenmeleri</caption><thead><tr><th scope="col">Yazı</th><th scope="col">Görüntülenme</th><th scope="col">Kullanıcı</th></tr></thead><tbody>{report.posts.map(post => <tr key={post.path}><th scope="row"><Link href={post.path}>{postTitles[post.path.replace(/\/$/, "")] || post.path}</Link></th><td>{integer.format(post.views)}</td><td>{integer.format(post.users)}</td></tr>)}</tbody></table></div>{!report.posts.length ? <p className="admin-empty">Seçili dönemde blog detayları için ölçüm bulunmuyor.</p> : null}</section>
    <section className="admin-card"><div className="admin-card-heading"><h2>Trafik kaynakları</h2><span>GA4 kanal grupları</span></div><div className="admin-table-scroll"><table><caption className="sr-only">Ziyaretlerin geldiği kanallar</caption><thead><tr><th scope="col">Kanal</th><th scope="col">Oturum</th><th scope="col">Kullanıcı</th></tr></thead><tbody>{report.sources.map(source => <tr key={source.name}><th scope="row">{source.name}</th><td>{integer.format(source.sessions)}</td><td>{integer.format(source.users)}</td></tr>)}</tbody></table></div>{!report.sources.length ? <p className="admin-empty">Seçili dönemde trafik kaynağı bulunmuyor.</p> : null}</section>
  </div>;
}
