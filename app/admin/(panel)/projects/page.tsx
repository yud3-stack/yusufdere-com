import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
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
  const projects = result.data ?? [];
  const published = projects.filter(project => project.status === "published").length;
  const drafts = projects.length - published;
  const featured = projects.filter(project => project.featured).length;

  return (
    <section className="admin-list-page">
      <div className="admin-page-heading">
        <div>
          <p className="admin-eyebrow">Portföy</p>
          <h1>Projeler</h1>
          <p className="admin-list-description">
            Geliştirdiğin projeleri ve öne çıkan çalışmaları yönet.
          </p>
        </div>
        <Link href="/admin/projects/new" className="admin-button primary">
          <Plus size={16} />
          Yeni proje
        </Link>
      </div>

      <div className="admin-status-strip">
        <div className="admin-status-card blue">
          <p>Toplam proje</p>
          <strong>{result.data ? projects.length : "—"}</strong>
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
          <p>Öne çıkan</p>
          <strong>{result.data ? featured : "—"}</strong>
        </div>
      </div>

      {result.error ? (
        <p role="alert" className="admin-error">
          {result.error}
        </p>
      ) : null}

      <div className="admin-toolbar">
        <p className="admin-toolbar-count">
          {result.data ? `${projects.length} proje` : "Projeler yükleniyor"}
        </p>
        <div className="admin-toolbar-actions">
          <Link href="/admin/projects/new" className="admin-button primary">
            <Plus size={15} />
            Proje ekle
          </Link>
        </div>
      </div>

      {result.data && projects.length === 0 ? (
        <div className="admin-table-card">
          <p className="admin-empty">Henüz proje bulunmuyor.</p>
        </div>
      ) : null}

      {projects.length > 0 ? (
        <div className="admin-table-card">
          <div className="admin-table-scroll">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Proje</th>
                  <th>Öne çıkan</th>
                  <th>Yayın</th>
                  <th>Güncelleme</th>
                  <th>Durum</th>
                  <th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(project => {
                  const cover = projectCoverImageUrl(project.cover_image);
                  return (
                    <tr key={project.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          {cover ? (
                            // Storage previews stay as plain images so a missing file does not break the list.
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={cover} alt="" className="admin-thumb" />
                          ) : (
                            <span className="admin-thumb placeholder">Kapak yok</span>
                          )}
                          <Link
                            href={`/admin/projects/${project.id}/edit`}
                            className="admin-table-title"
                          >
                            {project.title}
                          </Link>
                        </div>
                      </td>
                      <td>{project.featured ? "Evet" : "Hayır"}</td>
                      <td>
                        {project.published_at
                          ? formatDate(project.published_at)
                          : "—"}
                      </td>
                      <td>{formatDate(project.updated_at)}</td>
                      <td>
                        <span className={`admin-status ${project.status}`}>
                          {project.status === "published" ? "Yayında" : "Taslak"}
                        </span>
                      </td>
                      <td>
                        <div className="admin-table-actions">
                          <Link href={`/admin/projects/${project.id}/edit`}>
                            Düzenle
                          </Link>
                          <DeleteProjectButton
                            id={project.id}
                            title={project.title}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
