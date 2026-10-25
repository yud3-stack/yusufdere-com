import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { PostForm } from "@/components/admin/post-form";
import { getAdminEditor } from "@/lib/posts/admin";

export const metadata: Metadata = {
  title: "Yazıyı düzenle",
  robots: { index: false, follow: false },
};

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;

  if (!z.uuid().safeParse(id).success) {
    notFound();
  }

  const editor = await getAdminEditor(id);

  if (editor.error) {
    return (
      <section className="admin-editor-page">
        <p role="alert" className="admin-error">
          {editor.error}
        </p>
      </section>
    );
  }

  if (!editor.post) {
    notFound();
  }

  return (
    <section className="admin-editor-page">
      <div className="admin-page-heading">
        <div>
          <Link href="/admin/posts" className="admin-field-hint">
            ← Yazılar
          </Link>
          <h1>Yazıyı düzenle</h1>
          <p className="admin-list-description">{editor.post.title}</p>
        </div>
      </div>
      <PostForm
        post={editor.post}
        categories={editor.categories ?? []}
        initialMessage={saved === "1" ? "Yazı kaydedildi." : null}
      />
    </section>
  );
}
