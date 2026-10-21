"use client";

import { markdown } from "@codemirror/lang-markdown";
import { Compartment, Prec } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import CodeMirror, { type ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { readingLabel } from "@/lib/posts/reading";
import { uploadInlineImage } from "@/lib/storage/asset-actions";
import { assetFileError, markdownImage } from "@/lib/storage/assets";

type EnsureDraft = (markdown: string) => Promise<{ id: string } | { error: string }>;

const editorTheme = EditorView.theme({
  "&": {
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "14px",
  },
  ".cm-content": {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
    padding: "16px 0",
  },
  ".cm-gutters": {
    backgroundColor: "#ffffff",
    color: "#9CA3AF",
    borderRight: "1px solid #E5E7EB",
  },
  ".cm-activeLine": {
    backgroundColor: "#FAFAF9",
  },
  "&.cm-focused": {
    outline: "none",
  },
});

function selectedText(view: EditorView) {
  const range = view.state.selection.main;
  return view.state.sliceDoc(range.from, range.to);
}

function replaceSelection(view: EditorView, insert: string, anchor: number, head = anchor) {
  const range = view.state.selection.main;
  view.dispatch({
    changes: { from: range.from, to: range.to, insert },
    selection: { anchor: range.from + anchor, head: range.from + head },
  });
  view.focus();
}

function wrapSelection(view: EditorView, before: string, after: string, placeholder: string) {
  const current = selectedText(view);
  const inner = current || placeholder;
  replaceSelection(view, `${before}${inner}${after}`, before.length, before.length + inner.length);
}

function prefixSelection(view: EditorView, prefix: string, placeholder: string) {
  const current = selectedText(view) || placeholder;
  replaceSelection(view, `${prefix}${current}`, prefix.length, prefix.length + current.length);
}

function applyFormat(view: EditorView, kind: string) {
  if (kind === "h2") {
    prefixSelection(view, "## ", "Başlık");
    return;
  }

  if (kind === "h3") {
    prefixSelection(view, "### ", "Başlık");
    return;
  }

  if (kind === "bold") {
    wrapSelection(view, "**", "**", "metin");
    return;
  }

  if (kind === "italic") {
    wrapSelection(view, "*", "*", "metin");
    return;
  }

  if (kind === "link") {
    const current = selectedText(view) || "metin";
    const insert = `[${current}](https://)`;
    replaceSelection(view, insert, current.length + 3, current.length + 11);
    return;
  }

  if (kind === "bullet") {
    prefixSelection(view, "- ", "madde");
    return;
  }

  if (kind === "number") {
    prefixSelection(view, "1. ", "madde");
    return;
  }

  if (kind === "quote") {
    prefixSelection(view, "> ", "alıntı");
    return;
  }

  if (kind === "inline-code") {
    wrapSelection(view, "`", "`", "kod");
    return;
  }

  if (kind === "code-block") {
    const current = selectedText(view);
    const insert = `\`\`\`\n${current}\n\`\`\``;
    const cursor = current ? insert.length : 4;
    replaceSelection(view, insert, cursor);
    return;
  }

  if (kind === "table") {
    const insert = "| Başlık | Başlık |\n| --- | --- |\n|  |  |";
    replaceSelection(view, insert, 2, 8);
  }
}

type EditorHandlers = {
  ensureDraft?: EnsureDraft;
  onChange: (value: string) => void;
  onDraftWithImage?: (id: string, markdown: string) => Promise<string | null>;
  postId: string;
  upload: (file: File, position?: number, imageAlt?: string, imageCaption?: string) => Promise<void>;
  setError: (message: string | null) => void;
};

function imageDropHandlers(handlers: { current: EditorHandlers | null }) {
  return EditorView.domEventHandlers({
    paste(event) {
      const image = [...(event.clipboardData?.items ?? [])].find((item) => item.type.startsWith("image/"));
      const fileFromClipboard = image?.getAsFile();

      if (!fileFromClipboard) {
        return false;
      }

      event.preventDefault();
      void handlers.current?.upload(fileFromClipboard);
      return true;
    },
    dragover(event) {
      const hasFile = [...(event.dataTransfer?.items ?? [])].some((item) => item.kind === "file");

      if (!hasFile) {
        return false;
      }

      event.preventDefault();
      return true;
    },
    drop(event, view) {
      const files = [...(event.dataTransfer?.files ?? [])];

      if (files.length === 0) {
        return false;
      }

      event.preventDefault();
      const image = files.find((item) => item.type.startsWith("image/"));

      if (!image) {
        handlers.current?.setError("Bu dosya türü desteklenmiyor.");
        return true;
      }

      const position = view.posAtCoords({ x: event.clientX, y: event.clientY }) ?? undefined;
      void handlers.current?.upload(image, position);
      return true;
    },
  });
}

const tools = [
  ["h2", "H2"],
  ["h3", "H3"],
  ["bold", "Bold"],
  ["italic", "Italic"],
  ["link", "Link"],
  ["bullet", "Bullet List"],
  ["number", "Numbered List"],
  ["quote", "Quote"],
  ["inline-code", "Inline Code"],
  ["code-block", "Code Block"],
  ["table", "Table"],
] as const;

export function MarkdownEditor({
  value,
  onChange,
  postId = "",
  ensureDraft,
  onDraftWithImage,
  allowImages = true,
}: {
  value: string;
  onChange: (value: string) => void;
  postId?: string;
  ensureDraft?: EnsureDraft;
  onDraftWithImage?: (id: string, markdown: string) => Promise<string | null>;
  allowImages?: boolean;
}) {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const handlers = useRef<EditorHandlers | null>(null);
  const uploading = useRef(false);
  const events = useMemo(() => new Compartment(), []);
  const [imageOpen, setImageOpen] = useState(false);
  const [alt, setAlt] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function currentView() {
    return editorRef.current?.view ?? null;
  }

  const uploadFile = useCallback(async (fileToUpload: File, position?: number, imageAlt = "Görsel", imageCaption = "") => {
    if (uploading.current) {
      return;
    }

    const validationError = assetFileError(fileToUpload);

    if (validationError) {
      setError(validationError);
      return;
    }

    const view = currentView();

    if (!view) {
      return;
    }

    uploading.current = true;
    setError(null);
    setMessage("Görsel yükleniyor...");

    try {
      const markdownNow = view.state.doc.toString();
      let id = handlers.current?.postId ?? "";
      let created = false;

      if (!id) {
        const draft = await handlers.current?.ensureDraft?.(markdownNow);

        if (!draft) {
          setError("Görsel yüklenirken bir hata oluştu.");
          return;
        }

        if ("error" in draft) {
          setError(draft.error);
          return;
        }

        id = draft.id;
        created = true;
      }

      const formData = new FormData();
      formData.set("postId", id);
      formData.set("file", fileToUpload);
      const uploaded = await uploadInlineImage(formData);

      if ("error" in uploaded) {
        setError(uploaded.error ?? "Görsel yüklenirken bir hata oluştu.");
        return;
      }

      const snippet = markdownImage(uploaded.url, imageAlt, imageCaption);
      const pos = position ?? view.state.selection.main.head;
      const previous = pos > 0 ? view.state.sliceDoc(pos - 1, pos) : "\n";
      const prefix = previous === "\n" ? "" : "\n\n";
      const insert = `${prefix}${snippet}\n`;
      view.dispatch({
        changes: { from: pos, to: pos, insert },
        selection: { anchor: pos + insert.length },
      });
      const markdown = view.state.doc.toString();
      handlers.current?.onChange(markdown);
      view.focus();

      if (created) {
        const saveError = await handlers.current?.onDraftWithImage?.(id, markdown);

        if (saveError) {
          setError(saveError);
        }
      }

      setImageOpen(false);
      setFile(null);
      setAlt("");
      setCaption("");
    } finally {
      uploading.current = false;
      setMessage(null);
    }
  }, []);

  useEffect(() => {
    handlers.current = {
      ensureDraft,
      onChange,
      onDraftWithImage,
      postId,
      upload: uploadFile,
      setError,
    };
  }, [ensureDraft, onChange, onDraftWithImage, postId, uploadFile]);

  const extensions = useMemo(
    () => [
      markdown(),
      EditorView.lineWrapping,
      editorTheme,
      Prec.high(
        keymap.of([
          { key: "Mod-b", run: (view) => (applyFormat(view, "bold"), true) },
          { key: "Mod-i", run: (view) => (applyFormat(view, "italic"), true) },
          { key: "Mod-k", run: (view) => (applyFormat(view, "link"), true) },
        ]),
      ),
      events.of([]),
    ],
    [events],
  );

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tools.map(([kind, label]) => (
          <button
            key={kind}
            type="button"
            onClick={() => {
              const view = currentView();
              if (view) {
                applyFormat(view, kind);
              }
            }}
            className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-[#111827]"
          >
            {label}
          </button>
        ))}
        {allowImages ? (
          <button
            type="button"
            onClick={() => {
              const view = currentView();
              setAlt(view ? selectedText(view) : "");
              setImageOpen((open) => !open);
              setError(null);
            }}
            className="inline-flex h-9 items-center rounded-lg border border-[#E5E7EB] bg-white px-3 text-xs font-medium text-[#111827]"
          >
            Image
          </button>
        ) : null}
      </div>
      {allowImages && imageOpen ? (
        <div className="mt-3 grid gap-3 rounded-xl border border-[#E5E7EB] bg-white p-3 sm:grid-cols-2">
          <label className="text-sm text-[#111827] sm:col-span-2">
            Dosya
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              className="mt-1 block w-full text-sm"
              onChange={(event) => {
                const next = event.target.files?.[0] ?? null;
                setFile(next);
                if (next) {
                  const validationError = assetFileError(next);
                  setError(validationError);
                }
              }}
            />
          </label>
          <label className="text-sm text-[#111827]">
            Alt metin
            <input
              value={alt}
              onChange={(event) => setAlt(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#FF9F1C]"
            />
          </label>
          <label className="text-sm text-[#111827]">
            Açıklama
            <input
              value={caption}
              onChange={(event) => setCaption(event.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#FF9F1C]"
            />
          </label>
          <p className="text-xs text-[#6B7280] sm:col-span-2">Alt metin ekran okuyucular için faydalıdır.</p>
          <div className="sm:col-span-2">
            <button
              type="button"
              disabled={!file || Boolean(message)}
              onClick={() => {
                if (file) {
                  void uploadFile(file, undefined, alt, caption);
                }
              }}
              className="inline-flex h-10 items-center rounded-lg bg-[#FF9F1C] px-4 text-sm font-medium text-[#111827] disabled:opacity-70"
            >
              Ekle
            </button>
          </div>
        </div>
      ) : null}
      <div className="mt-3 overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
        <CodeMirror
          ref={editorRef}
          value={value}
          height="680px"
          theme="light"
          extensions={extensions}
          basicSetup={{ foldGutter: false }}
          onChange={onChange}
          onCreateEditor={(view) => {
            if (!allowImages) {
              return;
            }

            view.dispatch({ effects: events.reconfigure(imageDropHandlers(handlers)) });
          }}
        />
      </div>
      <p className="mt-2 text-xs text-[#9CA3AF]">{readingLabel(value)}</p>
      {message ? <p className="mt-2 text-sm text-[#6B7280]">{message}</p> : null}
      {error ? (
        <p role="alert" className="mt-2 text-sm text-[#B45309]">
          {error}
        </p>
      ) : null}
    </div>
  );
}


