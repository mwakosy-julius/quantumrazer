/**
 * Auth.js reads AUTH_URL / NEXTAUTH_URL and calls `new URL(...)` (see next-auth/lib/env.js).
 * Values without a protocol (e.g. `localhost:3000`) or other invalid strings throw "Invalid URL"
 * and break credentials sign-in. Clear bad values so request host is used instead.
 */
export function clearInvalidAuthUrlEnv(): void {
  for (const key of ["AUTH_URL", "NEXTAUTH_URL"] as const) {
    const raw = process.env[key];
    if (raw == null || raw === "") continue;
    const trimmed = raw.trim();
    if (!trimmed) {
      delete process.env[key];
      continue;
    }
    try {
      const u = new URL(trimmed);
      if (!u.protocol.startsWith("http")) throw new Error("not http(s)");
    } catch {
      console.warn(
        `[auth] Ignoring invalid ${key}="${raw}". Use an absolute URL, e.g. http://localhost:3000`,
      );
      delete process.env[key];
    }
  }
}
