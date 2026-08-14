// Uses Web Crypto (crypto.subtle) instead of Node's `crypto` module so this
// works in both the Edge middleware runtime and normal Node API routes.

export const ADMIN_COOKIE = "admin_session";
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

const encoder = new TextEncoder();

function secret(): string {
  const value = process.env.ADMIN_SECRET;
  if (!value) throw new Error("Missing required env var: ADMIN_SECRET");
  return value;
}

async function hmacHex(key: string, message: string): Promise<string> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(): Promise<string> {
  const payload = String(Date.now() + SESSION_TTL_MS);
  const signature = await hmacHex(secret(), payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmacHex(secret(), payload);
  if (!constantTimeEqual(signature, expected)) return false;

  const expiresAt = Number(payload);
  return Number.isFinite(expiresAt) && Date.now() < expiresAt;
}

export async function checkPassword(candidate: string): Promise<boolean> {
  const actual = process.env.ADMIN_PASSWORD;
  if (!actual) throw new Error("Missing required env var: ADMIN_PASSWORD");

  // Compare fixed-length HMACs (not the raw strings) so unequal lengths
  // can't leak timing information.
  const [a, b] = await Promise.all([hmacHex(secret(), candidate), hmacHex(secret(), actual)]);
  return constantTimeEqual(a, b);
}
