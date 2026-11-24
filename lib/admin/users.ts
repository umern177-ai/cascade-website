// Users & roles (Admin Panel Upgrade Phase 6, section 8): a small list of
// password-hashed users stored in the durable store. Roles gate the admin —
// WRITER cannot publish, SALES sees only inquiries, SEO manager sees all but
// users/schema-code, ADMIN everything. Forgot-password/2FA come later.
import "server-only";
import crypto from "node:crypto";
import { readFile, writeFile, logHistory } from "@/lib/admin/store";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type AdminRole = "admin" | "seo-manager" | "writer" | "sales";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  salt: string;
  hash: string;
  bio?: string;
};

const FILE = "users.json";

export function hashPassword(password: string, salt?: string): { salt: string; hash: string } {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, s, 32).toString("hex");
  return { salt: s, hash };
}

export function verifyPassword(password: string, salt: string, hash: string): boolean {
  const candidate = crypto.scryptSync(password, salt, 32).toString("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
  } catch {
    return false;
  }
}

async function loadUsers(): Promise<AdminUser[]> {
  const list = await readFile<AdminUser[]>(FILE, []);
  return list ?? [];
}

// Seed the owner (ADMIN_PASSWORD env) as admin on first run.
export async function ensureUsersSeeded(): Promise<void> {
  const users = await loadUsers();
  if (users.length === 0) {
    const ownerPassword = process.env.ADMIN_PASSWORD || "cascade-admin";
    const { salt, hash } = hashPassword(ownerPassword);
    const { saveUsers } = await moduleSelf();
    await saveUsers([{ id: "u-owner", name: "Owner", email: "owner@cascadecharterbus.com", role: "admin", salt, hash }]);
  }
}

// avoids a circular import; kept local by design
function moduleSelf(): Promise<{ saveUsers: (u: AdminUser[]) => Promise<void> }> {
  return import("@/lib/admin/users").then((m) => ({ saveUsers: m.saveUsers }));
}

export async function saveUsers(list: AdminUser[]): Promise<void> {
  await writeFile(FILE, list);
}

export async function findUserByEmail(email: string): Promise<AdminUser | undefined> {
  return (await loadUsers()).find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
}

export async function listUsers(): Promise<AdminUser[]> {
  return loadUsers();
}

export async function addUser(name: string, email: string, password: string, role: AdminRole, bio?: string): Promise<{ ok: boolean; error?: string }> {
  const users = await loadUsers();
  if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, error: "That email already has a user." };
  if (!["admin", "seo-manager", "writer", "sales"].includes(role)) return { ok: false, error: "Unknown role." };
  const { salt, hash } = hashPassword(password);
  users.push({ id: "u" + Date.now().toString(36), name, email, role, salt, hash, bio });
  await saveUsers(users);
  await logHistory("user", "/admin/users", `Added ${role} ${name} (${email})`);
  return { ok: true };
}

export async function deleteUser(id: string): Promise<void> {
  const users = await loadUsers();
  await saveUsers(users.filter((u) => u.id !== id));
  await logHistory("user", "/admin/users", "Deleted user " + id);
}

export async function changeUserPassword(id: string, password: string): Promise<void> {
  const users = await loadUsers();
  const u = users.find((x) => x.id === id);
  if (u) {
    const { salt, hash } = hashPassword(password);
    u.salt = salt;
    u.hash = hash;
    await saveUsers(users);
    await logHistory("user", "/admin/users", `Password changed for ${u.email}`);
  }
}

export async function setUserBio(id: string, bio: string): Promise<void> {
  const users = await loadUsers();
  const u = users.find((x) => x.id === id);
  if (u) {
    u.bio = bio || undefined;
    await saveUsers(users);
    await logHistory("user", "/admin/users", `Bio updated for ${u.email}`);
  }
}

/* ---------- role gates (section 8) ---------- */

export type SessionUser = { sub: string; name: string; email: string; role: AdminRole };

// permission matrix — single source for sidebar + guards
export const ROLE_PERMS: Record<AdminRole, { canPublish: boolean; canRedirects: boolean; canSchema: boolean; canUsers: boolean; canBlog: boolean; canPages: boolean; canInquiries: boolean; canSettings: boolean }> = {
  admin: { canPublish: true, canRedirects: true, canSchema: true, canUsers: true, canBlog: true, canPages: true, canInquiries: true, canSettings: true },
  "seo-manager": { canPublish: true, canRedirects: true, canSchema: true, canUsers: false, canBlog: true, canPages: true, canInquiries: true, canSettings: true },
  writer: { canPublish: false, canRedirects: false, canSchema: false, canUsers: false, canBlog: true, canPages: true, canInquiries: true, canSettings: false },
  sales: { canPublish: false, canRedirects: false, canSchema: false, canUsers: false, canBlog: false, canPages: false, canInquiries: true, canSettings: false },
};

export async function currentUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const role = jar.get(SESSION_ROLE_COOKIE)?.value as AdminRole | undefined;
  const name = jar.get(SESSION_NAME_COOKIE)?.value;
  const email = jar.get(SESSION_EMAIL_COOKIE)?.value;
  if (!role || !SESSION_ROLE_COOKIE) return null;
  return { sub: email || "user", name: name || "User", email: email || "", role };
}

export async function requireRole(perm: keyof (typeof ROLE_PERMS)["admin"]): Promise<void> {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  if (!ROLE_PERMS[user.role][perm]) redirect("/admin/");
}

export const SESSION_ROLE_COOKIE = "cb_admin_role";
export const SESSION_NAME_COOKIE = "cb_admin_name";
export const SESSION_EMAIL_COOKIE = "cb_admin_email";

// Login rate limiting (in-memory)
const attempts = new Map<string, { count: number; until: number }>();
export function loginThrottled(key: string): boolean {
  const t = Date.now();
  const a = attempts.get(key);
  if (a && a.until > t) return true;
  if (a && a.until <= t) attempts.delete(key);
  return false;
}
export function recordFailedLogin(key: string): void {
  const t = Date.now();
  const a = attempts.get(key) ?? { count: 0, until: 0 };
  a.count += 1;
  if (a.count >= 5) {
    a.until = t + 15 * 60_000;
    a.count = 0;
  }
  attempts.set(key, a);
}

export function userRoleOf(role: string | undefined): AdminRole {
  if (role === "seo-manager" || role === "writer" || role === "sales") return role;
  return "admin";
}

export async function setCurrentUser(user: { id: string; name: string; email: string; role: AdminRole }): Promise<void> {
  const jar = await cookies();
  jar.set(SESSION_ROLE_COOKIE, user.role, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
  jar.set(SESSION_NAME_COOKIE, user.name, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
  jar.set(SESSION_EMAIL_COOKIE, user.email, { httpOnly: false, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60 });
}
