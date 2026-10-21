import type { Metadata } from "next";
import Link from "next/link";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { formatDate } from "@/lib/format";
import { getAdminProjects } from "@/lib/projects/admin";
import { projectCoverImageUrl } from "@/lib/storage/project-covers";

export const metadata: Metadata = {
  title: "Projeler",
  robots: { index: false, follow: false },
};

export default async function AdminProjectsPage() {
  const result = await getAdminProjects();

  return (
    <section className="admin-list-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Link href="/admin" className="text-sm text-[#6B7280]">
            Admin Paneli
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#111827]">Projeler</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="admin-button primary"
        >
          Yeni Proje
        </Link>
      </div>

      <p className="admin-list-description">Geliştirdiğin projeleri ve öne çıkan çalışmalarını yönet.{result.data ? ` Toplam ${result.data.length} proje.` : ""}</p>

      {result.error ? (
        <p role="alert" className="mt-8 text-sm text-[#B45309]">
          {result.error}
        </p>
      ) : null}

      {result.data && result.data.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-[#E5E7EB] bg-white px-5 py-10 text-sm text-[#6B7280]">
          Henüz proje bulunmuyor.
        </p>
      ) : null}

      {result.data && result.data.length > 0 ? (
        <ul className="mt-8 divide-y divide-[#E5E7EB] overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          {result.data.map((project) => {
            const cover = projectCoverImageUrl(project.cover_image);

            return (
              <li key={project.id} className="flex flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  {cover ? (
                    // Storage previews stay as plain images so a missing file does not break the list.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt=""
                      className="h-12 w-20 shrink-0 rounded-lg border border-[#E5E7EB] object-cover"
                    />
                  ) : (
                    <span className="inline-flex h-12 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-[#E5E7EB] text-[10px] text-[#9CA3AF]">
                      Kapak yok
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-[#111827]">{project.title}</p>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      {project.status === "published" ? "Yayında" : "Taslak"} ·{" "}
                      {project.featured ? "Öne çıkan" : "Öne çıkan değil"} · Yayın:{" "}
                      {project.published_at ? formatDate(project.published_at) : "—"} · Güncelleme:{" "}
                      {formatDate(project.updated_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link href={`/admin/projects/${project.id}/edit`} className="text-sm font-medium text-[#111827]">
                    Düzenle
                  </Link>
                  <DeleteProjectButton id={project.id} title={project.title} />
                </div>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

