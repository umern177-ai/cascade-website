// Users & roles (/admin/users) — Admin Panel Upgrade Phase 6 (section 8).
// Admin sees everyone; only OWNER (shared-password login, role admin) can
// manage users. Add user with a role, change password bio, delete.
import Link from "next/link";
import { listUsers, addUser, deleteUser, setUserBio, changeUserPassword, ensureUsersSeeded, AdminRole } from "@/lib/admin/users";
import { Users } from "lucide-react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function addUserAction(form: FormData): void {
  void form;
  redirect("/admin/users");
}

async function realAddAction(form: FormData): Promise<void> {
  "use server";
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const role = String(form.get("role") || "writer") as AdminRole;
  const bio = String(form.get("bio") || "").trim();
  if (!name || !email || password.length < 6) redirect("/admin/users?e=input");
  const res = await addUser(name, email, password, role, bio);
  if (!res.ok) redirect("/admin/users?e=" + encodeURIComponent(res.error ?? ""));
  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ saved?: string; deleted?: string; e?: string }> }) {
  const sp = await searchParams;
  await ensureUsersSeeded();
  const users = await listUsers();

  async function remove(form: FormData): Promise<void> {
    "use server";
    const id = String(form.get("id") || "");
    await deleteUser(id);
    revalidatePath("/admin/users");
    redirect("/admin/users?deleted=1");
  }
  async function saveBio(form: FormData): Promise<void> {
    "use server";
    const id = String(form.get("id") || "");
    await setUserBio(id, String(form.get("bio") || ""));
    revalidatePath("/admin/users");
    redirect("/admin/users?saved=bio");
  }
  async function resetPw(form: FormData): Promise<void> {
    "use server";
    const id = String(form.get("id") || "");
    const pw = String(form.get("newpassword") || "");
    if (pw.length >= 6) await changeUserPassword(id, pw);
    revalidatePath("/admin/users");
    redirect("/admin/users?saved=pw");
  }

  return (
    <>
      <header className="adm-page-head">
        <div><h1>Users &amp; roles</h1><p>Admin: everything · SEO manager: all except users/schema code · Writer: edit, no publish · Sales: inquiries only.</p></div>
        <Users aria-hidden="true" />
      </header>

      {sp.saved && <div className="adm-alert">Saved {sp.saved === "bio" ? "bio" : sp.saved === "pw" ? "password" : ""}.</div>}
      {sp.deleted && <div className="adm-alert">User deleted.</div>}
      {sp.e === "input" && <div className="adm-alert adm-alert-err">Name, email and a 6+ character password are required.</div>}
      {sp.e && sp.e !== "input" && <div className="adm-alert adm-alert-err">{decodeURIComponent(sp.e)}</div>}

      <div className="adm-panel">
        <h2>Add a team member</h2>
        <form action={realAddAction} className="adm-form">
          <div className="adm-grid4">
            <div><label className="adm-label">Name</label><input className="adm-input" name="name" required /></div>
            <div><label className="adm-label">Email (login)</label><input className="adm-input" type="email" name="email" required /></div>
            <div><label className="adm-label">Password (6+)</label><input className="adm-input" type="password" name="password" required minLength={6} /></div>
            <div>
              <label className="adm-label">Role</label>
              <select className="adm-input" name="role" defaultValue="writer">
                <option value="admin">Admin</option>
                <option value="seo-manager">SEO Manager</option>
                <option value="writer">Content Writer</option>
                <option value="sales">Sales</option>
              </select>
            </div>
          </div>
          <label className="adm-label">Bio (shown on blog posts by this author)</label>
          <input className="adm-input" name="bio" />
          <button className="adm-btn adm-btn-primary" type="submit" style={{ marginTop: 12 }}>Add user</button>
        </form>
      </div>

      <div className="adm-panel">
        <h2>{`Team (${users.length})`}</h2>
        <table className="adm-table">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Bio</th><th>Password</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td><b>{u.name}</b></td>
                <td>{u.email}</td>
                <td><span className="adm-chip">{u.role}</span></td>
                <td>
                  <form action={saveBio} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input type="hidden" name="id" value={u.id} />
                    <input className="adm-input" name="bio" defaultValue={u.bio ?? ""} placeholder="Author bio" />
                    <button className="adm-btn" type="submit">Save bio</button>
                  </form>
                </td>
                <td>
                  <form action={resetPw} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <input type="hidden" name="id" value={u.id} />
                    <input className="adm-input" type="password" name="newpassword" placeholder="New password" style={{ width: 140 }} />
                    <button className="adm-btn" type="submit">Reset</button>
                  </form>
                </td>
                <td className="adm-row-actions">
                  <form action={remove}>
                    <input type="hidden" name="id" value={u.id} />
                    <button className="adm-btn adm-danger" type="submit">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="adm-hint">Log in with email + password from now on — the owner shared password keeps working on the login screen too.</p>
      </div>
      <div className="adm-panel"><Link className="adm-link" href="/admin/login">Try the login screen ↗</Link></div>
    </>
  );
}
