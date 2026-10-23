import "server-only";

type GraphErrorBody = {
  error?: { message?: string; type?: string; code?: number; error_subcode?: number };
};

export class InstagramApiError extends Error {
  status: number | null;
  code: number | null;

  constructor(message: string, status: number | null = null, code: number | null = null) {
    super(message);
    this.name = "InstagramApiError";
    this.status = status;
    this.code = code;
  }
}

export function getInstagramToken() {
  const value = process.env.INSTAGRAM_ACCESS_TOKEN?.trim() ?? "";
  if (!value || value === "paste_token_here") return "";
  return value;
}

export function getInstagramApiBase() {
  return (process.env.INSTAGRAM_API_BASE?.trim() || "https://graph.instagram.com").replace(/\/$/, "");
}

export async function instagramGet<T extends Record<string, unknown>>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const token = getInstagramToken();
  if (!token) {
    throw new InstagramApiError("Instagram access token is not configured.", null, null);
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }

  const url = `${getInstagramApiBase()}/${path.replace(/^\//, "")}${query.size ? `?${query}` : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "User-Agent": "yusufdere-admin-instagram/1.0",
    },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const text = await response.text();
  let payload: (T & GraphErrorBody) | null = null;
  try {
    payload = text ? (JSON.parse(text) as T & GraphErrorBody) : null;
  } catch {
    throw new InstagramApiError(`Meta API returned HTTP ${response.status}.`, response.status, null);
  }

  if (!response.ok || payload?.error) {
    const details = payload?.error;
    throw new InstagramApiError(
      details?.message || `Meta API returned HTTP ${response.status}.`,
      response.status,
      typeof details?.code === "number" ? details.code : null,
    );
  }

  if (!payload) {
    throw new InstagramApiError("Meta API returned an empty response.", response.status, null);
  }

  return payload;
}
