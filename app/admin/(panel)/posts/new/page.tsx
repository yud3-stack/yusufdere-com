import type { Metadata } from "next";
import Link from "next/link";
import { PostForm } from "@/components/admin/post-form";
import { getAdminEditor } from "@/lib/posts/admin";

export const metadata: Metadata = {
  title: "Yeni yazı",
  robots: { index: false, follow: false },
};

export default async function NewPostPage() {
  const editor = await getAdminEditor(null);

  return (
    <section className="admin-editor-page">
      <div className="admin-page-heading">
        <div>
          <Link href="/admin/posts" className="admin-field-hint">
            ← Yazılar
          </Link>
          <h1>Yeni yazı</h1>
          <p className="admin-list-description">
            Taslak olarak kaydedebilir veya doğrudan yayınlayabilirsin.
          </p>
        </div>
      </div>
      {editor.error ? (
        <p role="alert" className="admin-error">
          {editor.error}
        </p>
      ) : (
        <PostForm categories={editor.categories ?? []} />
      )}
    </section>
  );
}
