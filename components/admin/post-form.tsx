"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { createCategory, createDraftForImage, savePost, type PostActionState } from "@/lib/posts/actions";
import { slugify } from "@/lib/posts/slug";
import type { Category, ContentStatus, Post } from "@/types/db";
import { CoverField } from "@/components/admin/cover-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Markdown } from "@/components/content/markdown";

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

export function PostForm({
  post,
  categories,
  initialMessage,
}: {
  post?: Post;
  categories: Category[];
  initialMessage?: string | null;
}) {
  const [state, formAction] = useActionState(savePost, {
    error: null,
    message: initialMessage ?? null,
    status: post?.status ?? "draft",
  } satisfies PostActionState);
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugEdited, setSlugEdited] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [categoryId, setCategoryId] = useState(post?.category_id ?? "");
  const [categoryOptions, setCategoryOptions] = useState(categories);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [addingCategory, setAddingCategory] = useState(false);
  const [tags, setTags] = useState<string[]>(post?.tags ?? []);
  const [tagDraft, setTagDraft] = useState("");
  const [content, setContent] = useState(post?.content ?? "");
  const [postId, setPostId] = useState(post?.id ?? "");
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  function addTag(value: string) {
    const next = value.trim();

    if (!next) {
      return;
    }

    setTags((current) => {
      const exists = current.some((tag) => tag.toLocaleLowerCase("tr-TR") === next.toLocaleLowerCase("tr-TR"));
      return exists ? current : [...current, next];
    });
    setTagDraft("");
  }

  async function addCategory() {
    setAddingCategory(true);
    setCategoryError(null);
    const result = await createCategory(categoryName);
    setAddingCategory(false);

    if ("error" in result) {
      setCategoryError(result.error);
      return;
    }

    setCategoryOptions((current) =>
      [...current, result.category].sort((a, b) => a.name.localeCompare(b.name, "tr")),
    );
    setCategoryId(result.category.id);
    setCategoryName("");
  }

  return (
    <form ref={formRef} action={formAction} className="admin-editor-form space-y-6">
      {postId ? <input type="hidden" name="id" value={postId} /> : null}
      <input type="hidden" name="content" value={content} />
      <input type="hidden" name="tags" value={JSON.stringify(tags)} />

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
          Özet
          <textarea
            name="excerpt"
            value={excerpt}
            onChange={(event) => setExcerpt(event.target.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 text-sm font-normal outline-none focus:border-[#FF9F1C]"
          />
          <span className="mt-2 block text-xs font-normal text-[#6B7280]">
            {excerpt.trim().length} karakter. 160–200 karakter civarı iyi bir özettir. Boş bırakılabilir.
          </span>
        </label>
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-[#111827]">
            Kategori
          </label>
          <select
            id="category_id"
            name="category_id"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm outline-none focus:border-[#FF9F1C]"
          >
            <option value="">Kategori yok</option>
            {categoryOptions.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={categoryName}
              onChange={(event) => setCategoryName(event.target.value)}
              placeholder="Yeni kategori"
              aria-label="Yeni kategori"
              className="h-11 flex-1 rounded-xl border border-[#E5E7EB] bg-white px-3 text-sm outline-none focus:border-[#FF9F1C]"
            />
            <button
              type="button"
              onClick={addCategory}
              disabled={addingCategory}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-4 text-sm font-medium text-[#111827] disabled:cursor-wait disabled:opacity-70"
            >
              {addingCategory ? "Ekleniyor..." : "Yeni kategori ekle"}
            </button>
          </div>
          {categoryError ? (
            <p role="alert" className="mt-2 text-sm text-[#B45309]">
              {categoryError}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tag-draft" className="block text-sm font-medium text-[#111827]">
            Etiketler
          </label>
          <div className="mt-2 flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#F3F4F6] px-2.5 py-1 text-xs">
                {tag}
                <button
                  type="button"
                  aria-label={`${tag} etiketini sil`}
                  onClick={() => setTags((current) => current.filter((item) => item !== tag))}
                  className="text-[#6B7280]"
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="tag-draft"
              value={tagDraft}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag(tagDraft.replace(/,/g, ""));
                }
              }}
              onBlur={() => addTag(tagDraft)}
              placeholder="Enter veya virgül"
              className="h-8 min-w-32 flex-1 text-sm outline-none"
            />
          </div>
        </div>
        <CoverField initialPath={post?.cover_image ?? null} />
      </div>

      <div>
        <span className="block text-sm font-medium text-[#111827]">İçerik</span>
        <div className="mt-2">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            postId={postId}
            ensureDraft={async (markdown) => {
              if (postId) {
                return { id: postId };
              }

              const formData = new FormData();
              formData.set("title", title);
              formData.set("slug", slug || slugify(title));
              formData.set("excerpt", excerpt);
              formData.set("category_id", categoryId);
              formData.set("tags", JSON.stringify(tags));
              formData.set("content", markdown);
              formData.set("status", "draft");
              const result = await createDraftForImage(formData);

              if ("id" in result) {
                setPostId(result.id);
              }

              return result;
            }}
            onDraftWithImage={async (id, markdown) => {
              const formData = new FormData(formRef.current ?? undefined);
              formData.set("id", id);
              formData.set("content", markdown);
              formData.set("status", "draft");
              formData.set("tags", JSON.stringify(tags));
              const result = await savePost(state, formData);

              if (result?.error) {
                return result.error;
              }

              router.replace(`/admin/posts/${id}/edit`);
              return null;
            }}
          />
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
      {state.message ? <p className="text-sm text-[#047857]">{state.message}</p> : null}
      <SaveButtons currentStatus={state.status} />
    </form>
  );
}



