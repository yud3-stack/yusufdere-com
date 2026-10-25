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
      <div className="admin-page-heading">
        <div>
          <Link href="/admin/projects" className="admin-field-hint">
            ← Projeler
          </Link>
          <h1>Yeni proje</h1>
          <p className="admin-list-description">
            Taslak olarak kaydedebilir veya doğrudan yayınlayabilirsin.
          </p>
        </div>
      </div>
      <ProjectForm />
    </section>
  );
}
