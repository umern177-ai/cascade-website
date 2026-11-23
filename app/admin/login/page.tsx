// Admin login — one shared team password (env ADMIN_PASSWORD). This page sits
// OUTSIDE the protected layout, so the auth gate can redirect here safely.
import { loginAction } from "../actions";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/admin/auth";
import { Lock } from "lucide-react";

export const metadata = { robots: { index: false, follow: false }, title: "Admin login" };

export default async function AdminLogin({ searchParams }: { searchParams: Promise<{ e?: string }> }) {
  if (await isAuthed()) redirect("/admin/");
  const { e } = await searchParams;
  return (
    <main className="adm adm-login" data-adm>
      <form action={loginAction} className="adm-login-card">
        <div className="adm-login-brand">
          <Lock size={20} aria-hidden="true" />
          <div>
            <strong>Cascade Admin</strong>
            <small>Sign in to manage the website</small>
          </div>
        </div>
        {e && <div className="adm-alert adm-alert-err">Wrong password — try again.</div>}
        <label className="adm-label" htmlFor="password">Password</label>
        <input className="adm-input" type="password" id="password" name="password" autoComplete="current-password" required />
        <button className="adm-btn adm-btn-primary" type="submit">Log in</button>
        <p className="adm-hint">Password is set by <code>ADMIN_PASSWORD</code> in the environment (localhost default: <code>cascade-admin</code>).</p>
      </form>
    </main>
  );
}
