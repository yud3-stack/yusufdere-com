"use client";

import { useActionState } from "react";
import { LoaderCircle, Radar } from "lucide-react";
import { compileRadarAction, type RadarActionState } from "@/lib/radar/actions";

const initial: RadarActionState = { ok: false, message: "" };

export function RadarCompileForm({ ready, label }: { ready: boolean; label: string }) {
  const [state, formAction, pending] = useActionState(compileRadarAction, initial);

  return (
    <div className="admin-radar-actions">
      <form action={formAction}>
        <button type="submit" className="admin-button primary" disabled={!ready || pending}>
          {pending ? <LoaderCircle size={16} className="admin-spin" aria-hidden="true" /> : <Radar size={16} />}
          {pending ? "Derleniyor…" : label}
        </button>
      </form>
      {state.message ? (
        <p role="status" className={state.ok ? "admin-radar-status ok" : "admin-radar-status error"}>
          {state.message}
        </p>
      ) : null}
      {!ready ? (
        <p className="admin-radar-status">GEMINI_API_KEY eklenince derleme açılır.</p>
      ) : null}
    </div>
  );
}
