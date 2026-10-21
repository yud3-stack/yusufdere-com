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
    <div className="flex flex-wrap gap-3">
      <button
        type="submit"
        name="status"
        value="draft"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-5 text-sm font-medium text-[#111827] disabled:cursor-wait disabled:opacity-70"
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
        className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FF9F1C] px-5 text-sm font-medium text-[#111827] disabled:cursor-wait disabled:opacity-70"
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

    if (!next) {
      return;
    }

    setTechnologies((current) => {
      const exists = current.some((item) => item.toLocaleLowerCase("tr-TR") === next.toLocaleLowerCase("tr-TR"));
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
        <label className="block text-sm font-medium text-[#111827]">
          Başlık
          <input
            name="title"
            value={title}
            onChange={(event) => {
              const value = event.target.value;
              setTitle(value);
              if (!slugEdited) {
                setSlug(slugify(value));
              }
            }}
            required
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#FF9F1C]"
          />
        </label>
        <label className="block text-sm font-medium text-[#111827]">
          Slug
          <input
            name="slug"
            value={slug}
            onChange={(event) => {
              setSlugEdited(true);
              setSlug(event.target.value);
            }}
            required
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 font-mono text-sm font-normal outline-none focus:border-[#FF9F1C]"
          />
        </label>
        <label className="block text-sm font-medium text-[#111827]">
          Kısa Açıklama
          <textarea
            name="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#FF9F1C]"
          />
          <span className="mt-2 block text-xs font-normal text-[#6B7280]">
            {description.trim().length} karakter. Kartlarda kullanılacak kısa özet için 160–220 karakter civarı yeterlidir.
          </span>
        </label>
        <div>
          <label htmlFor="technology-draft" className="block text-sm font-medium text-[#111827]">
            Teknolojiler
          </label>
          <div className="mt-2 flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2">
            {technologies.map((item) => (
              <span key={item} className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs">
                {item}
                <button
                  type="button"
                  aria-label={`${item} teknolojisini sil`}
                  onClick={() => setTechnologies((current) => current.filter((technology) => technology !== item))}
                  className="text-[#6B7280]"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="technology-draft"
              value={technologyDraft}
              onChange={(event) => setTechnologyDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTechnology(technologyDraft.replace(/,/g, ""));
                }
              }}
              onBlur={() => addTechnology(technologyDraft)}
              placeholder="Enter veya virgül"
              className="h-8 min-w-32 flex-1 text-sm outline-none"
            />
          </div>
        </div>
        <label className="block text-sm font-medium text-[#111827]">
          GitHub URL
          <input
            name="github_url"
            value={githubUrl}
            onChange={(event) => setGithubUrl(event.target.value)}
            placeholder="https://"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#FF9F1C]"
          />
        </label>
        <label className="block text-sm font-medium text-[#111827]">
          Canlı Demo URL
          <input
            name="live_url"
            value={liveUrl}
            onChange={(event) => setLiveUrl(event.target.value)}
            placeholder="https://"
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm font-normal outline-none focus:border-[#FF9F1C]"
          />
        </label>
        <CoverField initialPath={project?.cover_image ?? null} urlForPath={projectCoverImageUrl} />
        <label className="flex items-center gap-3 text-sm font-medium text-[#111827]">
          <input
            type="checkbox"
            checked={featured}
            onChange={(event) => setFeatured(event.target.checked)}
            className="h-4 w-4 accent-[#FF9F1C]"
          />
          Öne çıkan projelerde göster
        </label>
      </div>

      <div>
        <span className="block text-sm font-medium text-[#111827]">Detay İçeriği</span>
        <div className="mt-2">
          <MarkdownEditor value={content} onChange={setContent} allowImages={false} />
        </div>
        <div className="mt-8">
          <h2 className="text-sm font-medium text-[#111827]">Önizleme</h2>
          <div className="mt-3 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 sm:px-6">
            {content.trim() ? (
              <Markdown markdown={content} />
            ) : (
              <p className="text-sm text-[#6B7280]">Önizleme için içerik yaz.</p>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm text-[#6B7280]">Durum: {state.status === "published" ? "Yayında" : "Taslak"}</p>
      {state.error ? (
        <p role="alert" className="text-sm text-[#B45309]">
          {state.error}
        </p>
      ) : null}
      {state.message ? <p className="text-sm text-[#6B7280]">{state.message}</p> : null}
      <SaveButtons currentStatus={state.status} />
    </form>
  );
}



