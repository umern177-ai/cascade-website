// Admin authentication (localhost / staging): one shared password, HMAC-signed
// session cookie. No account database — the owner sets who can log in by
// sharing the password (ADMIN_PASSWORD env), exactly like a WordPress admin
// login for one trusted team.
import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "cb_admin";

function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "cascade-admin";
}

function secret(): string {
  return "cb-admin-v1:" + adminPassword();
}

function sign(value: string): string {
  return crypto.createHmac("sha256", secret()).update(value).digest("base64url");
}

function makeToken(): string {
  const payload = String(Date.now());
  return payload + "." + sign(payload);
}

function verifyToken(token: string | undefined): boolean {
  if (!token) return false;
  const [payload, mac] = token.split(".");
  if (!payload || !mac) return false;
  if (sign(payload) !== mac) return false;
  // 30-day session
  return Date.now() - Number(payload) < 30 * 24 * 60 * 60 * 1000;
}

export function checkPassword(input: string): boolean {
  return input.length > 0 && input === adminPassword();
}

export async function createSession(): Promise<void> {
  const jar = await cookies();
  // Secure flag is env-controlled so the same cookie works on the http://
  // localhost/Vercel-preview admin and on https production (set
  // ADMIN_COOKIE_SECURE=1 on the production domain).
  const secure = process.env.ADMIN_COOKIE_SECURE === "1";
  jar.set(SESSION_COOKIE, makeToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
  // lightweight mirror the edge middleware can read (ADMIN_ONLY site-closed
  // mode lets logged-in admins preview the closed site)
  jar.set("cb_admin_open", "1", {
    httpOnly: false,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  jar.delete("cb_admin_open");
}

export async function isAuthed(): Promise<boolean> {
  const jar = await cookies();
  return verifyToken(jar.get(SESSION_COOKIE)?.value);
}
