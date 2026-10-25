"use client";

import { useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { coverFileError, coverImageUrl } from "@/lib/storage/covers";

export function CoverField({
  initialPath,
  urlForPath = coverImageUrl,
}: {
  initialPath: string | null;
  urlForPath?: (path: string | null) => string | null;
}) {
  const { pending, data } = useFormStatus();
  const [fileName, setFileName] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const savedUrl = urlForPath(initialPath);
  const previewUrl = objectUrl ?? (removed ? null : savedUrl);
  const submittedFile = data?.get("cover_file");
  const uploading =
    pending && submittedFile instanceof File && submittedFile.size > 0;

  function setPreview(nextUrl: string | null) {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    objectUrlRef.current = nextUrl;
    setObjectUrl(nextUrl);
  }

  return (
    <div>
      <span className="admin-field">Kapak görseli</span>
      <p className="admin-field-hint">JPG, PNG, WebP veya AVIF. En fazla 5 MB.</p>
      <div className="mt-3 max-w-md">
        {previewUrl ? (
          // Local previews use blob URLs, which next/image does not accept.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewUrl}
            alt="Kapak görseli önizlemesi"
            className="admin-cover-preview"
          />
        ) : (
          <div className="admin-cover-empty">Kapak görseli yok</div>
        )}
      </div>
      {fileName ? <p className="admin-field-hint">{fileName}</p> : null}
      <div className="mt-3 flex flex-wrap gap-3">
        <label className="admin-button">
          {previewUrl ? "Değiştir" : "Dosya seç"}
          <input
            ref={inputRef}
            name="cover_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            disabled={pending}
            className="sr-only"
            onChange={event => {
              const file = event.target.files?.[0];
              if (!file) return;

              const validationError = coverFileError(file);
              if (validationError) {
                event.target.value = "";
                setError(validationError);
                setFileName(null);
                setPreview(null);
                return;
              }

              setError(null);
              setRemoved(false);
              setFileName(file.name);
              setPreview(URL.createObjectURL(file));
            }}
          />
        </label>
        {previewUrl ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setPreview(null);
              setFileName(null);
              setRemoved(true);
              setError(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="admin-button"
          >
            Kaldır
          </button>
        ) : null}
      </div>
      <input
        type="hidden"
        name="remove_cover"
        value={removed && !objectUrl ? "1" : "0"}
      />
      {uploading ? <p className="admin-field-hint">Görsel yükleniyor...</p> : null}
      {error ? (
        <p role="alert" className="admin-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
