"use client";

import { useActionState, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  createCategory,
  createDraftForImage,
  savePost,
  type PostActionState,
} from "@/lib/posts/actions";
import { slugify } from "@/lib/posts/slug";
import type { Category, ContentStatus, Post } from "@/types/db";
import { CoverField } from "@/components/admin/cover-field";
import { MarkdownEditor } from "@/components/admin/markdown-editor";
import { Markdown } from "@/components/content/markdown";

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
    if (!next) return;

    setTags(current => {
      const exists = current.some(
        tag => tag.toLocaleLowerCase("tr-TR") === next.toLocaleLowerCase("tr-TR"),
      );
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

    setCategoryOptions(current =>
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
          Özet
          <textarea
            name="excerpt"
            value={excerpt}
            onChange={event => setExcerpt(event.target.value)}
            rows={3}
          />
          <span className="admin-field-hint">
            {excerpt.trim().length} karakter. 160–200 karakter civarı iyi bir özettir. Boş
            bırakılabilir.
          </span>
        </label>
        <div>
          <label htmlFor="category_id" className="admin-field">
            Kategori
          </label>
          <select
            id="category_id"
            name="category_id"
            value={categoryId}
            onChange={event => setCategoryId(event.target.value)}
            className="admin-input"
          >
            <option value="">Kategori yok</option>
            {categoryOptions.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={categoryName}
              onChange={event => setCategoryName(event.target.value)}
              placeholder="Yeni kategori"
              aria-label="Yeni kategori"
              className="admin-input"
            />
            <button
              type="button"
              onClick={addCategory}
              disabled={addingCategory}
              className="admin-button"
            >
              {addingCategory ? "Ekleniyor..." : "Yeni kategori ekle"}
            </button>
          </div>
          {categoryError ? (
            <p role="alert" className="admin-error">
              {categoryError}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="tag-draft" className="admin-field">
            Etiketler
          </label>
          <div className="admin-chip-field">
            {tags.map(tag => (
              <span key={tag} className="admin-chip">
                {tag}
                <button
                  type="button"
                  aria-label={`${tag} etiketini sil`}
                  onClick={() => setTags(current => current.filter(item => item !== tag))}
                >
                  ×
                </button>
              </span>
            ))}
            <input
              id="tag-draft"
              value={tagDraft}
              onChange={event => setTagDraft(event.target.value)}
              onKeyDown={event => {
                if (event.key === "Enter" || event.key === ",") {
                  event.preventDefault();
                  addTag(tagDraft.replace(/,/g, ""));
                }
              }}
              onBlur={() => addTag(tagDraft)}
              placeholder="Enter veya virgül"
            />
          </div>
        </div>
        <CoverField initialPath={post?.cover_image ?? null} />
      </div>

      <div>
        <span className="admin-field">İçerik</span>
        <div className="mt-2">
          <MarkdownEditor
            value={content}
            onChange={setContent}
            postId={postId}
            ensureDraft={async markdown => {
              if (postId) return { id: postId };

              const formData = new FormData();
              formData.set("title", title);
              formData.set("slug", slug || slugify(title));
              formData.set("excerpt", excerpt);
              formData.set("category_id", categoryId);
              formData.set("tags", JSON.stringify(tags));
              formData.set("content", markdown);
              formData.set("status", "draft");
              const result = await createDraftForImage(formData);

              if ("id" in result) setPostId(result.id);
              return result;
            }}
            onDraftWithImage={async (id, markdown) => {
              const formData = new FormData(formRef.current ?? undefined);
              formData.set("id", id);
              formData.set("content", markdown);
              formData.set("status", "draft");
              formData.set("tags", JSON.stringify(tags));
              const result = await savePost(state, formData);

              if (result?.error) return result.error;
              router.replace(`/admin/posts/${id}/edit`);
              return null;
            }}
          />
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
