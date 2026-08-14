import { NextRequest, NextResponse } from "next/server";
import { getFile, putFile } from "../../../lib/github";

const PATH = "app/data/experiences.json";

export async function GET() {
  const file = await getFile(PATH);
  if (!file) return NextResponse.json({ error: "experiences.json not found in repo" }, { status: 404 });
  return NextResponse.json({ experiences: JSON.parse(file.content), sha: file.sha });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || !Array.isArray(body.experiences) || typeof body.sha !== "string") {
    return NextResponse.json({ error: "Expected { experiences: [], sha }" }, { status: 400 });
  }

  try {
    const content = JSON.stringify(body.experiences, null, 2) + "\n";
    const result = await putFile(PATH, content, "chore(admin): update experiences", body.sha);
    return NextResponse.json({ sha: result.sha });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
