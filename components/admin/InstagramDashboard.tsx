import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SocialIcon } from "@/components/layout/SocialIcon";
import { getInstagramConnection, getInstagramOverview } from "@/lib/instagram/report";
import { formatCount } from "@/lib/instagram/metrics";

export function InstagramMetricPending() {
  return <Link href="/admin/instagram" className="admin-metric"><div><h2>Instagram</h2><ArrowUpRight size={17} /></div><strong>—</strong><p>Hesap özeti yükleniyor…</p></Link>;
}

export async function InstagramDashboardMetric() {
  const ready = getInstagramConnection().ready;
  const result = ready ? await getInstagramOverview(6) : null;
  return <Link href="/admin/instagram" className="admin-metric"><div><h2>Instagram</h2><span className="admin-metric-arrow"><ArrowUpRight size={17} /></span></div><strong>{formatCount(result?.data?.profile.followersCount)}</strong><p>{result?.data?.profile.username ? `@${result.data.profile.username}` : ready ? "Hesap bilgisi alınamadı" : "Token eklenince burada görünür"}</p></Link>;
}

export async function InstagramDashboardCard() {
  const ready = getInstagramConnection().ready;
  const result = ready ? await getInstagramOverview(6) : null;
  const data = result?.data;
  return <section className="admin-card admin-quickstart"><span className="admin-quick-icon"><SocialIcon kind="instagram" size={23} /></span><div><p className="admin-eyebrow">INSTAGRAM</p><h2>{data?.profile.username ? `@${data.profile.username}` : "Instagram hesabın"}</h2><p>{data ? (data.warnings[0] || `Son ${data.media.length} gönderide ${formatCount(data.recentTotals.likes)} beğeni · ${formatCount(data.recentTotals.comments)} yorum.`) : (result?.error || "Hesap bağlantısını ve ayrıntılı istatistikleri görüntüle.")}</p></div><Link href="/admin/instagram">Instagram’ı aç <ArrowRight size={18} /></Link></section>;
}
