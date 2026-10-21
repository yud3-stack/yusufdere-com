import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { ProjectForm } from "@/components/admin/project-form";
import { getAdminProject } from "@/lib/projects/admin";

export const metadata: Metadata = {
  title: "Projeyi düzenle",
  robots: { index: false, follow: false },
};

export default async function EditProjectPage({
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

  const result = await getAdminProject(id);

  if (result.error) {
    return (
      <section className="admin-editor-page">
        <p role="alert" className="text-sm text-[#B45309]">
          {result.error}
        </p>
      </section>
    );
  }

  if (!result.project) {
    notFound();
  }

  return (
    <section className="admin-editor-page">
      <Link href="/admin/projects" className="text-sm text-[#6B7280]">
        Projeler
      </Link>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Projeyi düzenle</h1>
      <div className="mt-8">
        <ProjectForm project={result.project} initialMessage={saved === "1" ? "Proje kaydedildi." : null} />
      </div>
    </section>
  );
}

