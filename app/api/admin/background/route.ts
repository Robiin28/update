import { NextRequest, NextResponse } from "next/server";
import { getFile, putFile } from "../../../lib/github";

const PATH = "app/data/education.json";

export async function GET() {
  const file = await getFile(PATH);
  if (!file) return NextResponse.json({ error: "education.json not found in repo" }, { status: 404 });
  return NextResponse.json({ background: JSON.parse(file.content), sha: file.sha });
}

export async function PUT(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (
    !body ||
    !Array.isArray(body.background?.education) ||
    !Array.isArray(body.background?.volunteering) ||
    !Array.isArray(body.background?.languages) ||
    typeof body.sha !== "string"
  ) {
    return NextResponse.json(
      { error: "Expected { background: { education: [], volunteering: [], languages: [] }, sha }" },
      { status: 400 }
    );
  }

  try {
    const content = JSON.stringify(body.background, null, 2) + "\n";
    const result = await putFile(PATH, content, "chore(admin): update background", body.sha);
    return NextResponse.json({ sha: result.sha });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
