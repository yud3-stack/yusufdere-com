import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { formatDate } from "@/lib/format";
import { getAdminPosts } from "@/lib/posts/admin";

export const metadata: Metadata = {
  title: "Yazılar",
  robots: { index: false, follow: false },
};

function wasUpdatedThisWeek(updatedAt: string) {
  return Date.now() - Date.parse(updatedAt) < 7 * 24 * 60 * 60 * 1000;
}

export default async function AdminPostsPage() {
  const result = await getAdminPosts();
  const posts = result.data ?? [];
  const published = posts.filter(post => post.status === "published").length;
  const drafts = posts.length - published;

  return (
    <section className="admin-list-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">İçerik</p>
          <h1>Yazılar</h1>
          <p className="admin-list-description">
            Yazılarını düzenle, taslaklarını geliştir ve yayına hazırla.
          </p>
        </div>
        <Link href="/admin/posts/new" className="admin-button primary">
          <Plus size={16} />
          Yeni yazı
        </Link>
      </div>

      <div className="admin-status-strip">
        <div className="admin-status-card blue">
          <p>Toplam yazı</p>
          <strong>{result.data ? posts.length : "—"}</strong>
        </div>
        <div className="admin-status-card green">
          <p>Yayında</p>
          <strong>{result.data ? published : "—"}</strong>
        </div>
        <div className="admin-status-card orange">
          <p>Taslak</p>
          <strong>{result.data ? drafts : "—"}</strong>
        </div>
        <div className="admin-status-card yellow">
          <p>Bu hafta güncellenen</p>
          <strong>
            {result.data
              ? posts.filter(
                  post =>
                    wasUpdatedThisWeek(post.updated_at),
                ).length
              : "—"}
          </strong>
        </div>
      </div>

      {result.error ? (
        <p role="alert" className="admin-error">
          {result.error}
        </p>
      ) : null}

      <div className="admin-toolbar">
        <p className="admin-toolbar-count">
          {result.data ? `${posts.length} yazı` : "Yazılar yükleniyor"}
        </p>
        <div className="admin-toolbar-actions">
          <Link href="/admin/posts/new" className="admin-button primary">
            <Plus size={15} />
            Yazı ekle
          </Link>
        </div>
      </div>

      {result.data && posts.length === 0 ? (
        <div className="admin-table-card">
          <p className="admin-empty">Henüz yazı bulunmuyor.</p>
        </div>
      ) : null}

      {posts.length > 0 ? (
        <div className="admin-table-card">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Yazı</th>
                  <th>Kategori</th>
                  <th>Yayın</th>
                  <th>Güncelleme</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="admin-table-title"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td>{post.category_name ?? "—"}</td>
                    <td>
                      {post.published_at ? formatDate(post.published_at) : "—"}
                    </td>
                    <td>{formatDate(post.updated_at)}</td>
                    <td>
                      <span className={`admin-status ${post.status}`}>
                        {post.status === "published" ? "Yayında" : "Taslak"}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table-actions">
                        <Link href={`/admin/posts/${post.id}/edit`}>Düzenle</Link>
                        <DeletePostButton id={post.id} title={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
