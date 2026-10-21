import type { Metadata } from "next";
import Link from "next/link";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { formatDate } from "@/lib/format";
import { getAdminPosts } from "@/lib/posts/admin";

export const metadata: Metadata = {
  title: "Yazılar",
  robots: { index: false, follow: false },
};

export default async function AdminPostsPage() {
  const result = await getAdminPosts();

  return (
    <section className="admin-list-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-[#6B7280]">
            Admin Paneli
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Yazılar</h1>
        </div>
        <Link
          href="/admin/posts/new"
          className="admin-button primary"
        >
          Yeni Yazı
        </Link>
      </div>

      <p className="admin-list-description">Yazılarını düzenle, taslaklarını geliştir ve yayına hazırla.{result.data ? ` Toplam ${result.data.length} yazı.` : ""}</p>

      {result.error ? (
        <p role="alert" className="mt-8 text-sm text-[#B45309]">
          {result.error}
        </p>
      ) : null}

      {result.data && result.data.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-5 py-10 text-sm text-[#6B7280]">
          Henüz yazı bulunmuyor.
        </p>
      ) : null}

      {result.data && result.data.length > 0 ? (
        <ul className="mt-8 divide-y divide-[#E5E7EB] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          {result.data.map((post) => (
            <li key={post.id} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="truncate font-medium text-[#111827]">{post.title}</p>
                <p className="mt-1 text-sm text-[#6B7280]">
                  {post.category_name ?? "Kategori yok"} · {post.status === "published" ? "Yayında" : "Taslak"} ·{" "}
                  Yayın: {post.published_at ? formatDate(post.published_at) : "—"} · Güncelleme:{" "}
                  {formatDate(post.updated_at)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/admin/posts/${post.id}/edit`} className="text-sm font-medium text-[#111827]">
                  Düzenle
                </Link>
                <DeletePostButton id={post.id} title={post.title} />
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

