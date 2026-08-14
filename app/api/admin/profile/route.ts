import { NextRequest, NextResponse } from "next/server";
import { getFile, putFile } from "../../../lib/github";

export const dynamic = "force-dynamic";

const PATH = "app/data/profile.json";

export async function GET() {
  const file = await getFile(PATH);
  if (!file) return NextResponse.json({ error: "profile.json not found in repo" }, { status: 404 });
  return NextResponse.json({ profile: JSON.parse(file.content), sha: file.sha });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.profile !== "object" || typeof body.sha !== "string") {
    return NextResponse.json({ error: "Expected { profile: {}, sha }" }, { status: 400 });
  }

  try {
    const content = JSON.stringify(body.profile, null, 2) + "\n";
    const result = await putFile(PATH, content, "chore(admin): update profile", body.sha);
    return NextResponse.json({ sha: result.sha });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
