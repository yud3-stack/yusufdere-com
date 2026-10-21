import type { Metadata } from "next";
import Link from "next/link";
import { ProjectForm } from "@/components/admin/project-form";

export const metadata: Metadata = {
  title: "Yeni proje",
  robots: { index: false, follow: false },
};

export default function NewProjectPage() {
  return (
    <section className="admin-editor-page">
      <Link href="/admin/projects" className="text-sm text-[#6B7280]">
        Projeler
      </Link>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Yeni proje</h1>
      <div className="mt-8">
        <ProjectForm />
      </div>
    </section>
  );
}

