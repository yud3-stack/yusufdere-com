"use client";

import Image from "next/image";
import { useState } from "react";
import {
  AudioLines,
  CalendarDays,
  Check,
  Minus,
  Square,
  X,
  Layers,
  Mic,
  SlidersHorizontal,
  Terminal,
  Volume2,
} from "lucide-react";
import {
  audioChannels,
  waveform,
  type ProjectVisualKind,
} from "@/data/project-showcase";

const icons = {
  audio: Volume2,
  api: Terminal,
  planner: CalendarDays,
  voice: Mic,
  generic: Layers,
};

export function ProjectVisual({
  title,
  kind,
  cover,
}: {
  title: string;
  kind: ProjectVisualKind;
  cover: string | null;
}) {
  const [failed, setFailed] = useState(false);
  const Icon = icons[kind];

  if (cover && !failed)
    return (
      <div className="project-artwork project-artwork-photo">
        <Image
          src={cover}
          alt={`${title} proje görseli`}
          fill
          sizes="(min-width: 1280px) 600px, (min-width: 900px) 50vw, 100vw"
          unoptimized={/^https?:/.test(cover)}
          priority
          onError={() => setFailed(true)}
        />
      </div>
    );

  return (
    <div
      className={`project-artwork project-artwork-${kind}`}
      role="img"
      aria-label={`${title} için kavramsal arayüz çizimi`}
    >
      <div className="project-art-orbit" aria-hidden="true" />
      <div className="project-art-stamp" aria-hidden="true">
        <Icon size={16} />
        <span>
          {kind === "generic"
            ? "Bir fikir, bir başlangıç."
            : "Fikirden çalışan ürüne."}
        </span>
      </div>
      <div className="project-window" aria-hidden="true">
        <div className="project-window-bar">
          <span className="project-window-dots">
            <i />
            <i />
            <i />
          </span>
          <span>{title}</span>
          <span className="project-window-controls">
            <Minus size={12} />
            <Square size={10} />
            <X size={12} />
          </span>
        </div>
        <div className="project-window-layout">
          <div className="project-window-rail">
            <span className="is-active">
              <Icon size={17} />
              <small>
                {kind === "audio"
                  ? "Sesler"
                  : kind === "api"
                    ? "İstekler"
                    : kind === "planner"
                      ? "İçerikler"
                      : "Ses üretimi"}
              </small>
            </span>
            <span>
              <Layers size={15} />
              <small>{kind === "audio" ? "Cihazlar" : "Çalışmalar"}</small>
            </span>
            <span>
              <SlidersHorizontal size={15} />
              <small>Bağlantı</small>
            </span>
          </div>
          <div className="project-window-content">
            {kind === "audio" ? (
              <>
                <div className="project-window-heading">
                  <span className="project-product-icon">
                    <AudioLines size={24} />
                  </span>
                  <div>
                    <strong>Uygulama sesleri</strong>
                    <span>Uygulama seslerini tek yerden yönet.</span>
                  </div>
                </div>
                <div className="project-audio-channels">
                  {audioChannels.map((channel) => (
                    <div className="project-audio-channel" key={channel.name}>
                      <div>
                        <span>
                          <Volume2 size={13} />
                          {channel.name}
                        </span>
                        <span>{channel.level}%</span>
                      </div>
                      <span className="project-audio-track">
                        <i style={{ width: `${channel.level}%` }} />
                      </span>
                    </div>
                  ))}
                </div>
                <div className="project-window-foot">
                  <span className="project-live-dot" /> WebSocket · Bağlantı
                  hazır
                </div>
              </>
            ) : null}
            {kind === "api" ? (
              <>
                <div className="project-window-heading">
                  <span className="project-product-icon">
                    <Terminal size={23} />
                  </span>
                  <div>
                    <strong>İstekten, içgörüye.</strong>
                    <span>API isteklerini incele ve yeniden dene.</span>
                  </div>
                </div>
                <div className="project-request-url">
                  <span>GET</span>
                  <code>/api/projects</code>
                  <span>↗</span>
                </div>
                <div className="project-request-meta">
                  <span>
                    <Check size={12} />
                    200 OK
                  </span>
                  <span>JSON</span>
                </div>
                <pre className="project-request-body">
                  {
                    '{\n  "status": "ready",\n  "projects": [\n    "WinSoundMixer",\n    "LLMVoice"\n  ]\n}'
                  }
                </pre>
              </>
            ) : null}
            {kind === "planner" ? (
              <>
                <div className="project-window-heading">
                  <span className="project-product-icon">
                    <CalendarDays size={23} />
                  </span>
                  <div>
                    <strong>Fikirlerini bir plana dönüştür.</strong>
                    <span>İçerik, planlama ve üretim.</span>
                  </div>
                </div>
                <div className="project-planner">
                  {["Fikirler", "Hazırlanıyor", "Planlandı"].map((label, i) => (
                    <div key={label}>
                      <span className="project-planner-label">{label}</span>
                      {Array.from({ length: i === 1 ? 2 : 3 }, (_, j) => (
                        <div className="project-planner-card" key={j}>
                          <i />
                          <b />
                          <span />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </>
            ) : null}
            {kind === "voice" ? (
              <>
                <div className="project-window-heading">
                  <span className="project-product-icon">
                    <Mic size={23} />
                  </span>
                  <div>
                    <strong>Kelimelerine bir ses ver.</strong>
                    <span>Yerel ses üretimi ve ses klonlama.</span>
                  </div>
                </div>
                <div className="project-waveform">
                  {waveform.map((height, i) => (
                    <i key={i} style={{ height: `${height}%` }} />
                  ))}
                </div>
                <div className="project-voice-input">
                  Bir cümleyle başlar.
                  <span>
                    Metinden sese <AudioLines size={15} />
                  </span>
                </div>
              </>
            ) : null}
            {kind === "generic" ? (
              <div className="project-generic-mark">
                <Layers size={64} strokeWidth={0.8} />
                <strong>{title}</strong>
                <span>Bir fikrin gerçeğe dönüşme hikâyesi.</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <span className="project-concept-label">Temsili uygulama görünümü</span>
    </div>
  );
}
