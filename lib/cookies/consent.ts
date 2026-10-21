export const CONSENT_STORAGE_KEY = "yd_cookie_consent";
export const CONSENT_VERSION = 2;

export type CookieConsentRecord = {
  version: number;
  decidedAt: string;
  analytics: boolean;
};

export type ConsentUiState = {
  open: boolean;
  panel: "banner" | "settings";
  draftAnalytics: boolean;
  record: CookieConsentRecord | null;
};

const listeners = new Set<() => void>();
let forceOpen = false;
let forcePanel: ConsentUiState["panel"] = "banner";
let draftAnalytics: boolean | null = null;
let cachedUiState: ConsentUiState | null = null;

const SERVER_UI_STATE: ConsentUiState = {
  open: false,
  panel: "banner",
  draftAnalytics: false,
  record: null,
};

function emit() {
  cachedUiState = null;
  for (const listener of listeners) listener();
}

function sameRecord(a: CookieConsentRecord | null, b: CookieConsentRecord | null) {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.version === b.version && a.decidedAt === b.decidedAt && a.analytics === b.analytics;
}

function sameUiState(a: ConsentUiState, b: ConsentUiState) {
  return (
    a.open === b.open &&
    a.panel === b.panel &&
    a.draftAnalytics === b.draftAnalytics &&
    sameRecord(a.record, b.record)
  );
}

export function subscribeConsent(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function readConsent(): CookieConsentRecord | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CookieConsentRecord>;
    if (parsed.version !== CONSENT_VERSION || typeof parsed.decidedAt !== "string") {
      return null;
    }
    if (typeof parsed.analytics !== "boolean") return null;

    return {
      version: parsed.version,
      decidedAt: parsed.decidedAt,
      analytics: parsed.analytics,
    };
  } catch {
    return null;
  }
}

export function writeConsent(analytics: boolean): CookieConsentRecord {
  const record: CookieConsentRecord = {
    version: CONSENT_VERSION,
    decidedAt: new Date().toISOString(),
    analytics,
  };

  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  forceOpen = false;
  draftAnalytics = null;
  emit();
  return record;
}

export function hasAnalyticsConsent() {
  return readConsent()?.analytics === true;
}

export function getAnalyticsConsentServerSnapshot() {
  return false;
}

export function openCookiePreferences(panel: ConsentUiState["panel"] = "settings") {
  const current = readConsent();
  forceOpen = true;
  forcePanel = panel;
  draftAnalytics = current?.analytics ?? false;
  emit();
}

export function closeCookiePreferences() {
  forceOpen = false;
  draftAnalytics = null;
  emit();
}

export function setConsentDraftAnalytics(value: boolean) {
  draftAnalytics = value;
  emit();
}

export function getConsentUiState(): ConsentUiState {
  const record = readConsent();
  const next: ConsentUiState = {
    open: forceOpen || !record,
    panel: forceOpen ? forcePanel : "banner",
    draftAnalytics: draftAnalytics ?? record?.analytics ?? false,
    record,
  };

  if (cachedUiState && sameUiState(cachedUiState, next)) {
    return cachedUiState;
  }

  cachedUiState = next;
  return cachedUiState;
}

export function getConsentUiServerState(): ConsentUiState {
  return SERVER_UI_STATE;
}
