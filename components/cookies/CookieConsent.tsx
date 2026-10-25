"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { getAnalyticsConfig } from "@/lib/cookies/analytics";
import { useEntranceComplete } from "./useEntranceComplete";
import {
  closeCookiePreferences,
  getConsentUiServerState,
  getConsentUiState,
  openCookiePreferences,
  setConsentDraftAnalytics,
  subscribeConsent,
  writeConsent,
} from "@/lib/cookies/consent";

export function CookieConsent() {
  const state = useSyncExternalStore(subscribeConsent, getConsentUiState, getConsentUiServerState);
  const analyticsConfigured = Boolean(getAnalyticsConfig());
  const entranceComplete = useEntranceComplete();

  if (!state.open) return null;

  const settingsOpen = state.panel === "settings";
  if (!settingsOpen && !entranceComplete) return null;

  return (
    <div
      className={`cookie-notice${settingsOpen ? " cookie-notice-settings" : ""}`}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-notice-title"
      aria-describedby="cookie-notice-text"
    >
      <div className="cookie-notice-card">
        <div className="cookie-notice-copy">
          <p id="cookie-notice-title" className="cookie-notice-title">
            {settingsOpen ? "Çerez tercihleri" : "Çerezler"}
          </p>
          <p id="cookie-notice-text" className="cookie-notice-text">
            {analyticsConfigured
              ? "Gerekli çerezler siteyi çalıştırmak için kullanılır. Analytics yalnızca senin onayınla yüklenir."
              : "Gerekli çerezler siteyi çalıştırmak için kullanılır. Şu an analytics veya reklam çerezi bağlı değil; tercih altyapısı hazır."}{" "}
            <Link href="/privacy">Detaylı bilgi</Link>
          </p>

          {settingsOpen ? (
            <div className="cookie-categories">
              <div className="cookie-category">
                <div>
                  <p className="cookie-category-title">Gerekli</p>
                  <p className="cookie-category-text">
                    Admin oturumu ve temel güvenlik. Her zaman açık.
                  </p>
                </div>
                <span className="cookie-category-state" aria-hidden="true">
                  Zorunlu
                </span>
              </div>

              <div className="cookie-category">
                <div>
                  <p className="cookie-category-title">Analytics</p>
                  <p className="cookie-category-text">
                    {analyticsConfigured
                      ? "Ziyaret istatistikleri için kullanılır. Onaylamazsan script yüklenmez."
                      : "Sağlayıcı henüz yapılandırılmadı. Açık kalsan bile şu an script yüklenmez."}
                  </p>
                </div>
                <button
                  type="button"
                  className={`cookie-switch${state.draftAnalytics ? " is-on" : ""}`}
                  role="switch"
                  aria-checked={state.draftAnalytics}
                  aria-label="Analytics çerezleri"
                  onClick={() => setConsentDraftAnalytics(!state.draftAnalytics)}
                >
                  <span />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="cookie-notice-actions">
          {settingsOpen ? (
            <>
              <button type="button" className="button button-secondary" onClick={() => writeConsent(false)}>
                Yalnızca gerekli
              </button>
              <button
                type="button"
                className="button button-accent"
                onClick={() => writeConsent(state.draftAnalytics)}
              >
                Tercihleri kaydet
              </button>
              {state.record ? (
                <button type="button" className="button button-secondary" onClick={closeCookiePreferences}>
                  Kapat
                </button>
              ) : null}
            </>
          ) : (
            <>
              <button type="button" className="button button-secondary" onClick={() => writeConsent(false)}>
                Reddet
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => openCookiePreferences("settings")}
              >
                Ayarlar
              </button>
              <button type="button" className="button button-accent" onClick={() => writeConsent(true)}>
                Kabul et
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
