import Link from "next/link";
import { ArrowUpRight, FileText, FolderKanban, Plus, ArrowRight, PenLine } from "lucide-react";
import { getAdminContent } from "@/components/admin/content";
import { formatDate } from "@/lib/format";
import { PublicationSummary } from "@/components/admin/PublicationSummary";

export default async function AdminPage() {
  const { posts, projects } = await getAdminContent();
  const all = [
    ...(posts.data ?? []).map(post => ({ ...post, kind: "Yazı", href: `/admin/posts/${post.id}/edit` })),
    ...(projects.data ?? []).map(project => ({ ...project, kind: "Proje", href: `/admin/projects/${project.id}/edit` })),
  ];
  const complete = !posts.error && !projects.error;
  const published = all.filter(item => item.status === "published").length;
  const drafts = all.length - published;

  const recent = [...all].sort((a,b) => Date.parse(b.updated_at) - Date.parse(a.updated_at)).slice(0,5);
  const metrics = [
    { label: "Toplam yazı", value: posts.data?.length, href: "/admin/posts", note: "Blog arşivindeki tüm yazılar" },
    { label: "Toplam proje", value: projects.data?.length, href: "/admin/projects", note: "Geliştirdiğin tüm projeler" },
    { label: "Yayındaki içerik", value: complete ? published : undefined, href: "#yayin-durumu", note: "Okuyucularınla buluşan içerikler" },
    { label: "Taslak içerik", value: complete ? drafts : undefined, href: "#son-guncellemeler", note: "Üzerinde çalışmaya devam ettiklerin" },
  ];
  return <section className="admin-dashboard">
    <div className="admin-page-heading"><div><p className="admin-eyebrow">İÇERİK MERKEZİN</p><h1>Genel bakış</h1><p>Hoş geldin, Yusuf. Bir sonraki fikrine buradan başla.</p></div><div className="admin-actions"><Link href="/admin/posts/new" className="admin-button primary"><Plus size={17} />Yeni yazı</Link><Link href="/admin/projects/new" className="admin-button"><Plus size={17} />Yeni proje</Link></div></div>
    {posts.error || projects.error ? <p role="alert" className="admin-error">{[posts.error,projects.error].filter(Boolean).join(" ")} Yüklenemeyen veriler özetlere dahil edilmedi.</p> : null}
    <div className="admin-metrics">{metrics.map((item,i) => <Link className={`admin-metric ${i === 0 ? "featured" : ""}`} key={item.label} href={item.href}><div><h2>{item.label}</h2><span className="admin-metric-arrow"><ArrowUpRight size={17} /></span></div><strong>{item.value ?? "—"}</strong><p>{item.note}</p></Link>)}</div>
    <div className="admin-dashboard-grid">
      <section className="admin-card admin-recent" id="son-guncellemeler"><div className="admin-card-heading"><h2>Son güncellemeler</h2><span>İçerik akışın</span></div>{recent.length ? <ul className="admin-recent-list">{recent.map(item => <li key={item.href}><span className={`admin-content-icon ${item.kind === "Yazı" ? "post" : "project"}`}>{item.kind === "Yazı" ? <FileText size={20} /> : <FolderKanban size={20} />}</span><div><Link href={item.href}>{item.title}</Link><p>{item.kind} <span>·</span> {formatDate(item.updated_at)}</p></div><span className={`admin-status ${item.status}`}>{item.status === "published" ? "Yayında" : "Taslak"}</span><Link href={item.href} className="admin-edit-icon" aria-label={`${item.title} içeriğini düzenle`}><ArrowUpRight size={18} /></Link></li>)}</ul> : <p className="admin-empty">{complete ? "İlk yazını veya projeni ekleyerek başla." : "İçerikler şu an yüklenemedi."}</p>}</section>
      <section className="admin-card admin-publication" id="yayin-durumu"><div className="admin-card-heading"><h2>Yayın durumu</h2><span>Yazılar + projeler</span></div>{complete ? <><PublicationSummary published={published} total={all.length} /><div className="admin-chart-legend"><span><i />Yayında <strong>{published}</strong></span><span><i />Taslak <strong>{drafts}</strong></span></div></> : <p className="admin-empty">Yayın dağılımı yüklenemedi.</p>}</section>
      <section className="admin-card admin-distribution"><div className="admin-card-heading"><h2>İçerik dağılımı</h2><span>Yayında ve taslak</span></div>{[{name:"Yazılar",data:posts.data,href:"/admin/posts"},{name:"Projeler",data:projects.data,href:"/admin/projects"}].map(group => {const live=group.data?.filter(item=>item.status === "published").length ?? 0;const total=group.data?.length ?? 0;return <div className="admin-bar-group" key={group.name}><div><Link href={group.href}>{group.name}<ArrowUpRight size={14} /></Link><strong>{group.data ? total : "—"}</strong></div><div className="admin-bar" role="img" aria-label={group.data ? `${group.name}: ${live} yayında, ${total-live} taslak` : `${group.name} yüklenemedi`}><span style={{width:`${total ? live/total*100 : 0}%`}} /></div><p>{group.data ? `${live} yayında · ${total-live} taslak` : "Veri yüklenemedi"}</p></div>;})}</section>
      <section className="admin-card admin-quickstart"><span className="admin-quick-icon"><PenLine size={23} /></span><div><p className="admin-eyebrow">BİR SONRAKİ ADIM</p><h2>Yeni bir fikir, yeni bir sayfa.</h2><p>Öğrendiklerini yazıya dök veya geliştirdiğin bir projeyi paylaş.</p></div><Link href="/admin/posts/new">Yazmaya başla <ArrowRight size={18} /></Link></section>
    </div>
  </section>;
}

