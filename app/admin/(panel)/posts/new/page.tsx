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
      <Link href="/admin/posts" className="text-sm text-[#6B7280]">
        Yazılar
      </Link>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Yeni yazı</h1>
      {editor.error ? (
        <p role="alert" className="mt-6 text-sm text-[#B45309]">
          {editor.error}
        </p>
      ) : (
        <div className="mt-8">
          <PostForm categories={editor.categories ?? []} />
        </div>
      )}
    </section>
  );
}

