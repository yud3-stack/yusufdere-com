import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import { uploadPostAsset } from "@/lib/storage/asset-upload";
import { assetUploadFailed } from "@/lib/storage/assets";

export async function POST(request: Request) {
  // Cookie-authenticated uploads must come from this site's own editor.
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Bu yükleme isteğine izin verilmiyor." }, { status: 403 });
  }

  const admin = await requireAdmin();
  if (!admin.ok) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const maxRequestBytes = 6 * 1024 * 1024;
  if (Number(request.headers.get("content-length")) > maxRequestBytes) {
    return NextResponse.json({ error: "Görsel 5 MB'dan küçük olmalıdır." }, { status: 413 });
  }

  try {
    const formData = await request.formData();
    const postId = String(formData.get("postId") ?? "").trim();
    const file = formData.get("file");
    if (!z.uuid().safeParse(postId).success || !(file instanceof File)) {
      return NextResponse.json({ error: assetUploadFailed }, { status: 400 });
    }

    // Reuse the existing ownership/RLS, MIME, file-signature and size checks.
    const uploaded = await uploadPostAsset(admin.supabase, postId, file);
    if (!uploaded.url) {
      return NextResponse.json({ error: uploaded.error ?? assetUploadFailed }, { status: 400 });
    }
    return NextResponse.json({ url: uploaded.url });
  } catch {
    return NextResponse.json({ error: assetUploadFailed }, { status: 500 });
  }
}
