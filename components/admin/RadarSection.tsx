import { ArrowUpRight, Radar } from "lucide-react";
import { radarSources } from "@/data/radar-sources";
import { formatDate } from "@/lib/format";
import { getGeminiConnection } from "@/lib/radar/gemini";
import type { RadarDigestRow } from "@/lib/radar/admin";
import { RadarCompileForm } from "./RadarCompileForm";

export function RadarSection({
  digest,
  weekStart,
  loadError,
}: {
  digest: RadarDigestRow | null;
  weekStart: string;
  loadError: string | null;
}) {
  const gemini = getGeminiConnection();
  const weekLabel = formatDate(`${weekStart}T12:00:00.000Z`);

  return (
    <section className="admin-card admin-radar" id="radar">
      <div className="admin-card-heading">
        <h2>
          <Radar size={18} aria-hidden="true" />
          Radar
        </h2>
        <span>Haftalık yazılım brifingi · {weekLabel}</span>
      </div>

      <p className="admin-radar-lead">
        Seçili kaynaklardan son 7 günün başlıkları toplanır, Gemini ücretsiz modeliyle Türkçe özetlenir.
        Her maddenin orijinal linki vardır.
      </p>

      {loadError ? (
        <p role="alert" className="admin-error">
          {loadError}
        </p>
      ) : null}

      <RadarCompileForm
        ready={gemini.ready}
        label={digest ? "Bu haftayı yeniden derle" : "Bu haftayı derle"}
      />

      {digest ? (
        <>
          <p className="admin-radar-summary">{digest.summary}</p>
          <ol className="admin-radar-items">
            {digest.items.map(item => (
              <li key={item.url}>
                <div>
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.title}
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                  <p>{item.why}</p>
                  <span>{item.source}</span>
                </div>
              </li>
            ))}
          </ol>
          {digest.followUps.length ? (
            <div className="admin-radar-followups">
              <h3>Takip et</h3>
              <ul>
                {digest.followUps.map(item => (
                  <li key={item.url}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.title}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                    <span>{item.source}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="admin-radar-meta">
            Kaynaklar: {(digest.sourcesUsed.length ? digest.sourcesUsed : ["—"]).join(" · ")}
            {digest.model ? ` · ${digest.model}` : ""} · {formatDate(digest.updatedAt)}
          </p>
        </>
      ) : !loadError ? (
        <p className="admin-empty">
          Bu hafta henüz derleme yok. Kaynaklar hazır ({radarSources.length} feed). Gemini anahtarını ekleyip
          derlemeyi başlat.
        </p>
      ) : null}

      <details className="admin-radar-sources">
        <summary>Kullanılan kaynak listesi</summary>
        <ul>
          {radarSources.map(source => (
            <li key={source.id}>
              <span>{source.name}</span>
              <a href={source.feedUrl} target="_blank" rel="noopener noreferrer">
                feed
                <ArrowUpRight size={13} aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </details>
    </section>
  );
}
