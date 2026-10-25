"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { CoverField } from "@/components/admin/cover-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Markdown } from "@/components/content/markdown";
import { saveProject, type ProjectActionState } from "@/lib/projects/actions";
import { slugify } from "@/lib/posts/slug";
import { projectCoverImageUrl } from "@/lib/storage/project-covers";
import type { ContentStatus, Project } from "@/types/db";

function SaveButtons({ currentStatus }: { currentStatus: ContentStatus }) {
  const { pending, data } = useFormStatus();
  const submitting = String(data?.get("status") ?? "");

  return (
    <div className="admin-actions">
      <button
        type="submit"
        name="status"
        value="draft"
        disabled={pending}
        className="admin-button"
      >
        {pending && submitting === "draft"
          ? "Kaydediliyor..."
          : currentStatus === "published"
            ? "Taslağa al"
            : "Taslak Kaydet"}
      </button>
      <button
        type="submit"
        name="status"
        value="published"
        disabled={pending}
        className="admin-button primary"
      >
        {pending && submitting === "published"
          ? "Kaydediliyor..."
          : currentStatus === "published"
            ? "Kaydet"
            : "Yayınla"}
      </button>
    </div>
  );
}

export function ProjectForm({
  project,
  initialMessage,
}: {
  project?: Project;
  initialMessage?: string | null;
}) {
  const [state, formAction] = useActionState(saveProject, {
    error: null,
    message: initialMessage ?? null,
    status: project?.status ?? "draft",
  } satisfies ProjectActionState);
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
  const [description, setDescription] = useState(project?.description ?? "");
  const [technologies, setTechnologies] = useState<string[]>(project?.technologies ?? []);
  const [technologyDraft, setTechnologyDraft] = useState("");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [liveUrl, setLiveUrl] = useState(project?.live_url ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [content, setContent] = useState(project?.content ?? "");

  function addTechnology(value: string) {
    const next = value.trim();
    if (!next) return;

    setTechnologies(current => {
      const exists = current.some(
        item => item.toLocaleLowerCase("tr-TR") === next.toLocaleLowerCase("tr-TR"),
      );
      return exists ? current : [...current, next];
    });
    setTechnologyDraft("");
  }

  return (
    <form action={formAction} className="admin-editor-form space-y-6">
      {project ? <input type="hidden" name="id" value={project.id} /> : null}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="technologies" value={JSON.stringify(technologies)} />
      {featured ? <input type="hidden" name="featured" value="1" /> : null}

      <div className="grid gap-5">
        <label className="admin-field">
          Başlık
          <input
            name="title"
            value={title}
            onChange={event => {
              const value = event.target.value;
              setTitle(value);
              if (!slugEdited) setSlug(slugify(value));
            }}
            required
          />
        </label>
        <label className="admin-field">
          Slug
          <input
            name="slug"
            value={slug}
            onChange={event => {
              setSlugEdited(true);
              setSlug(event.target.value);
            }}
            required
            className="font-mono"
          />
        </label>
        <label className="admin-field">
          Kısa Açıklama
          <textarea
            name="description"
            value={description}
            onChange={event => setDescription(event.target.value)}
            rows={3}
          />
          <span className="admin-field-hint">
            {description.trim().length} karakter. Kartlarda kullanılacak kısa özet için 160–220
            karakter civarı yeterlidir.
          </span>
        </label>
        <div>
          <label htmlFor="technology-draft" className="admin-field">
            Teknolojiler
          </label>
          <div className="admin-chip-field">
            {technologies.map(item => (
              <span key={item} className="admin-chip">
                {item}
                <button
                  type="button"
                  aria-label={`${item} teknolojisini sil`}
                  onClick={() =>
                    setTechnologies(current => current.filter(technology => technology !== item))
                  }
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="technology-draft"
              value={technologyDraft}
              onChange={event => setTechnologyDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTechnology(technologyDraft.replace(/,/g, ""));
                }
              }}
              onBlur={() => addTechnology(technologyDraft)}
              placeholder="Enter veya virgül"
            />
          </div>
        </div>
        <label className="admin-field">
          GitHub URL
          <input
            name="github_url"
            value={githubUrl}
            onChange={event => setGithubUrl(event.target.value)}
            placeholder="https://"
          />
        </label>
        <label className="admin-field">
          Canlı Demo URL
          <input
            name="live_url"
            value={liveUrl}
            onChange={event => setLiveUrl(event.target.value)}
            placeholder="https://"
          />
        </label>
        <CoverField
          initialPath={project?.cover_image ?? null}
          urlForPath={projectCoverImageUrl}
        />
        <label className="admin-field" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="checkbox"
            checked={featured}
            onChange={event => setFeatured(event.target.checked)}
            style={{ width: 16, height: 16, margin: 0, minHeight: 0 }}
          />
          Öne çıkan projelerde göster
        </label>
      </div>

      <div>
        <span className="admin-field">Detay İçeriği</span>
        <div className="mt-2">
          <MarkdownEditor value={content} onChange={setContent} allowImages={false} />
        </div>
        <div className="mt-8">
          <h2 className="admin-field">Önizleme</h2>
          <div className="admin-md-preview">
            {content.trim() ? (
              <Markdown markdown={content} className="admin-md-preview-body" />
            ) : (
              <p className="admin-empty" style={{ padding: 0 }}>
                Önizleme için içerik yaz.
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="admin-field-hint">
        Durum: {state.status === "published" ? "Yayında" : "Taslak"}
      </p>
      {state.error ? (
        <p role="alert" className="admin-error">
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="admin-field-hint" style={{ color: "var(--admin-green)" }}>
          {state.message}
        </p>
      ) : null}
      <SaveButtons currentStatus={state.status} />
    </form>
  );
}
