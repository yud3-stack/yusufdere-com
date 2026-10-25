import Link from "next/link";
import { Suspense } from "react";
import {
  InstagramDashboardCard,
  InstagramDashboardMetric,
  InstagramMetricPending,
} from "@/components/admin/InstagramDashboard";
import {
  ArrowUpRight,
  FileText,
  FolderKanban,
  Plus,
  ArrowRight,
  PenLine,
} from "lucide-react";
import { getAdminContent } from "@/components/admin/content";
import { RadarSection } from "@/components/admin/RadarSection";
import { formatDate } from "@/lib/format";
import { PublicationSummary } from "@/components/admin/PublicationSummary";
import { getLatestRadarDigest } from "@/lib/radar/admin";

export default async function AdminPage() {
  const { posts, projects } = await getAdminContent();
  const radar = await getLatestRadarDigest();
  const all = [
    ...(posts.data ?? []).map(post => ({
      ...post,
      kind: "Yazı" as const,
      href: `/admin/posts/${post.id}/edit`,
    })),
    ...(projects.data ?? []).map(project => ({
      ...project,
      kind: "Proje" as const,
      href: `/admin/projects/${project.id}/edit`,
    })),
  ];
  const complete = !posts.error && !projects.error;
  const published = all.filter(item => item.status === "published").length;
  const drafts = all.length - published;
  const recent = [...all]
    .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
    .slice(0, 5);

  const postCount = posts.data?.length ?? 0;
  const projectCount = projects.data?.length ?? 0;
  const publishedShare = all.length ? Math.round((published / all.length) * 100) : 0;

  const chartHeights = [42, 58, 47, 72, 64, 81, 69, 88];
  const chartLabels = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz", "Bug"];

  const mix = [
    { label: "Yayındaki yazılar", value: posts.data?.filter(p => p.status === "published").length ?? 0, color: "var(--admin-blue)" },
    { label: "Taslak yazılar", value: posts.data?.filter(p => p.status !== "published").length ?? 0, color: "var(--admin-orange)" },
    { label: "Yayındaki projeler", value: projects.data?.filter(p => p.status === "published").length ?? 0, color: "var(--admin-green)" },
    { label: "Taslak projeler", value: projects.data?.filter(p => p.status !== "published").length ?? 0, color: "var(--admin-purple)" },
  ];
  const mixTotal = mix.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <section className="admin-dashboard">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">İçerik merkezi</p>
          <h1>Genel bakış</h1>
          <p>Yazılar, projeler ve yayın durumun tek ekranda.</p>
        </div>
        <div className="admin-actions">
          <Link href="/admin/posts/new" className="admin-button primary">
            <Plus size={17} />
            Yeni yazı
          </Link>
          <Link href="/admin/projects/new" className="admin-button">
            <Plus size={17} />
            Yeni proje
          </Link>
        </div>
      </div>

      {posts.error || projects.error ? (
        <p role="alert" className="admin-error">
          {[posts.error, projects.error].filter(Boolean).join(" ")} Yüklenemeyen
          veriler özetlere dahil edilmedi.
        </p>
      ) : null}

      <div className="admin-metrics">
        <Link className="admin-metric featured" href="/admin/posts">
          <div>
            <h2>Toplam yazı</h2>
            <span className="admin-metric-arrow">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <strong>{posts.data ? postCount : "—"}</strong>
          <span className="admin-delta up">Blog arşivi</span>
        </Link>
        <Link className="admin-metric" href="/admin/projects">
          <div>
            <h2>Toplam proje</h2>
            <span className="admin-metric-arrow">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <strong>{projects.data ? projectCount : "—"}</strong>
          <p>Geliştirdiğin çalışmalar</p>
        </Link>
        <Link className="admin-metric" href="#yayin-durumu">
          <div>
            <h2>Yayında</h2>
            <span className="admin-metric-arrow">
              <ArrowUpRight size={16} />
            </span>
          </div>
          <strong>{complete ? published : "—"}</strong>
          <span className={`admin-delta ${publishedShare >= 50 ? "up" : "down"}`}>
            %{complete ? publishedShare : "—"} oran
          </span>
        </Link>
        <Suspense fallback={<InstagramMetricPending />}>
          <InstagramDashboardMetric />
        </Suspense>
      </div>

      <RadarSection
        digest={radar.data}
        weekStart={radar.weekStart}
        loadError={radar.error}
      />

      <div className="admin-dashboard-grid">
        <section className="admin-card admin-chart-card">
          <div className="admin-card-heading">
            <h2>Haftalık aktivite</h2>
            <span>İçerik tempo göstergesi</span>
          </div>
          <div className="admin-bar-chart" role="img" aria-label="Haftalık aktivite çubuk grafiği">
            {chartHeights.map((height, index) => (
              <div key={chartLabels[index]}>
                <span style={{ height: `${height}%` }} />
                <small>{chartLabels[index]}</small>
              </div>
            ))}
          </div>
        </section>

        <section className="admin-card" id="yayin-durumu">
          <div className="admin-card-heading">
            <h2>Yayın durumu</h2>
            <span>Yazılar + projeler</span>
          </div>
          {complete ? (
            <>
              <PublicationSummary published={published} total={all.length} />
              <div className="admin-chart-legend">
                <span>
                  <i />
                  Yayında <strong>{published}</strong>
                </span>
                <span>
                  <i />
                  Taslak <strong>{drafts}</strong>
                </span>
              </div>
            </>
          ) : (
            <p className="admin-empty">Yayın dağılımı yüklenemedi.</p>
          )}
        </section>

        <div className="admin-stat-pair">
          <section className="admin-card admin-stat-tile">
            <p className="admin-eyebrow">Yazılar</p>
            <strong>{posts.data ? postCount : "—"}</strong>
            <p>
              {posts.data
                ? `${posts.data.filter(p => p.status === "published").length} yayında · ${posts.data.filter(p => p.status !== "published").length} taslak`
                : "Veri yüklenemedi"}
            </p>
          </section>
          <section className="admin-card admin-stat-tile">
            <p className="admin-eyebrow">Projeler</p>
            <strong>{projects.data ? projectCount : "—"}</strong>
            <p>
              {projects.data
                ? `${projects.data.filter(p => p.status === "published").length} yayında · ${projects.data.filter(p => p.status !== "published").length} taslak`
                : "Veri yüklenemedi"}
            </p>
          </section>
        </div>

        <section className="admin-card">
          <div className="admin-card-heading">
            <h2>İçerik karışımı</h2>
            <span>Dağılım</span>
          </div>
          {complete && mixTotal > 0 ? (
            <div className="admin-donut-wrap">
              <div
                className="admin-donut"
                style={{
                  ["--p1" as string]: (mix[0].value / mixTotal) * 100,
                  ["--p2" as string]: (mix[1].value / mixTotal) * 100,
                  ["--p3" as string]: (mix[2].value / mixTotal) * 100,
                  ["--p4" as string]: (mix[3].value / mixTotal) * 100,
                }}
                role="img"
                aria-label="İçerik karışımı pasta grafiği"
              />
              <ul className="admin-donut-legend">
                {mix.map(item => (
                  <li key={item.label}>
                    <span>
                      <i style={{ background: item.color }} />
                      {item.label}
                    </span>
                    <strong>{item.value}</strong>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="admin-empty">Dağılım için yeterli veri yok.</p>
          )}
        </section>

        <section className="admin-card admin-recent" id="son-guncellemeler">
          <div className="admin-card-heading">
            <h2>Son güncellemeler</h2>
            <span>İçerik akışı</span>
          </div>
          {recent.length ? (
            <ul className="admin-recent-list">
              {recent.map(item => (
                <li key={item.href}>
                  <span
                    className={`admin-content-icon ${item.kind === "Yazı" ? "post" : "project"}`}
                  >
                    {item.kind === "Yazı" ? (
                      <FileText size={18} />
                    ) : (
                      <FolderKanban size={18} />
                    )}
                  </span>
                  <div>
                    <Link href={item.href}>{item.title}</Link>
                    <p>
                      {item.kind} · {formatDate(item.updated_at)}
                    </p>
                  </div>
                  <span className={`admin-status ${item.status}`}>
                    {item.status === "published" ? "Yayında" : "Taslak"}
                  </span>
                  <Link
                    href={item.href}
                    className="admin-edit-icon"
                    aria-label={`${item.title} içeriğini düzenle`}
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="admin-empty">
              {complete
                ? "İlk yazını veya projeni ekleyerek başla."
                : "İçerikler şu an yüklenemedi."}
            </p>
          )}
        </section>

        <Suspense
          fallback={
            <section className="admin-card admin-quickstart">
              <p>Instagram özeti yükleniyor…</p>
            </section>
          }
        >
          <InstagramDashboardCard />
        </Suspense>

        <section className="admin-card admin-quickstart">
          <span className="admin-quick-icon">
            <PenLine size={22} />
          </span>
          <div>
            <p className="admin-eyebrow">Bir sonraki adım</p>
            <h2>Yeni bir fikir, yeni bir sayfa.</h2>
            <p>Öğrendiklerini yazıya dök veya geliştirdiğin bir projeyi paylaş.</p>
          </div>
          <Link href="/admin/posts/new">
            Yazmaya başla <ArrowRight size={17} />
          </Link>
        </section>
      </div>
    </section>
  );
}
