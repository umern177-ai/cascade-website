// Shared auth guard for server actions that live outside app/admin/actions.ts.
import { isAuthed } from "@/lib/admin/auth";
import { redirect } from "next/navigation";

export async function requireAuth(): Promise<void> {
  if (!(await isAuthed())) redirect("/admin/login");
}
