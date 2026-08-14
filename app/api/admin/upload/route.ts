import { NextRequest, NextResponse } from "next/server";
import { putBinaryFile } from "../../../lib/github";

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "application/pdf": "pdf",
};

const SAFE_FOLDER = /^[a-z0-9-]+$/;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.slug !== "string" || typeof body.dataUrl !== "string") {
    return NextResponse.json({ error: "Expected { slug, dataUrl }" }, { status: 400 });
  }

  const folder = typeof body.folder === "string" && SAFE_FOLDER.test(body.folder) ? body.folder : "projects";

  const match = /^data:([a-zA-Z0-9.+-]+\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(body.dataUrl);
  if (!match) {
    return NextResponse.json({ error: "dataUrl must be a base64-encoded data URL" }, { status: 400 });
  }
  const [, mime, base64] = match;
  const ext = EXT_BY_MIME[mime];
  if (!ext) {
    return NextResponse.json({ error: `Unsupported file type: ${mime}` }, { status: 400 });
  }

  const safeSlug = body.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 60) || "file";
  const filename = `${safeSlug}-${Date.now()}.${ext}`;
  const repoPath = `public/${folder}/${filename}`;

  try {
    await putBinaryFile(repoPath, base64, `chore(admin): upload file for ${safeSlug}`);
    return NextResponse.json({ path: `/${folder}/${filename}` });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
