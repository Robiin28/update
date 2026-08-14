const GITHUB_API = "https://api.github.com";

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function repoConfig() {
  return {
    owner: env("GITHUB_OWNER"),
    repo: env("GITHUB_REPO"),
    branch: process.env.GITHUB_BRANCH || "main",
    token: env("GITHUB_TOKEN"),
  };
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

export class GitHubFileError extends Error {}

export async function getFile(path: string): Promise<{ content: string; sha: string } | null> {
  const { owner, repo, branch, token } = repoConfig();
  const res = await fetch(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(branch)}`,
    { headers: headers(token), cache: "no-store" }
  );

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new GitHubFileError(`Failed to read ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return {
    content: Buffer.from(data.content, "base64").toString("utf-8"),
    sha: data.sha,
  };
}

export async function putFile(
  path: string,
  content: string,
  message: string,
  sha?: string
): Promise<{ sha: string }> {
  const { owner, repo, branch, token } = repoConfig();
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new GitHubFileError(`Failed to write ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { sha: data.content.sha };
}

export async function putBinaryFile(
  path: string,
  base64Content: string,
  message: string
): Promise<{ sha: string; path: string }> {
  const { owner, repo, branch, token } = repoConfig();
  const existing = await getFile(path).catch(() => null);

  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...headers(token), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: base64Content,
      branch,
      ...(existing ? { sha: existing.sha } : {}),
    }),
  });

  if (!res.ok) {
    throw new GitHubFileError(`Failed to upload ${path}: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  return { sha: data.content.sha, path };
}
