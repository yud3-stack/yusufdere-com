"use client";

import { useActionState } from "react";
import { deletePost, type PostActionState } from "@/lib/posts/actions";

const emptyState: PostActionState = { error: null, message: null, status: "draft" };

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  const [state, action, pending] = useActionState(deletePost, emptyState);

  return (
    <form
      action={(formData) => {
        const confirmed = window.confirm(`'${title}' yazısını silmek istediğine emin misin?`);
        if (!confirmed) {
          return;
        }
        action(formData);
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="text-sm text-[#B45309] disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "Siliniyor..." : "Sil"}
      </button>
      {state.error ? (
        <p role="alert" className="mt-1 text-xs text-[#B45309]">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
