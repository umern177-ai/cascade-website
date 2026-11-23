"use client";

// On-page inline editing (owner request Nov 20): in edit mode (?edit=1 while
// logged in) every editable text block on the public page shows a pencil;
// click → edit in place → Save publishes instantly (server revalidation — no
// deployment). Outside edit mode this renders plain content: zero overhead
// for visitors.
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";

export default function Editable({
  path,
  fkey,
  value,
  as: Tag = "p",
  className,
  label,
  multiline = true,
}: {
  path: string;   // the page path the save applies to
  fkey: string;   // field key (lib/admin/page-fields.ts map)
  value: string;  // the current rendered copy
  as?: "p" | "h1" | "h2" | "h3" | "span" | "li" | "strong";
  className?: string;
  label: string;
  multiline?: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);

  function editMode(): boolean {
    if (typeof window === "undefined") return false;
    return window.location.search.includes("edit=1") && document.cookie.includes("cb_admin_open");
  }

  function start(): void {
    setDraft(value);
    setEditing(true);
    const ta = document.getElementById("editArea-" + keyId);
    void ta;
  }
  const keyId = fkey.replace(/[^a-zA-Z0-9]/g, "-");

  async function save(): Promise<void> {
    if (!draft.trim()) return; // empty = keep built-in
    setSaving(true);
    try {
      const res = await fetch("/api/admin/page-body", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, key: fkey, value: draft }),
      });
      const j = await res.json();
      if (!j.ok) { setSaving(false); return; }
      setEditing(false);
      setSaving(false);
      // instant publish: revalidate + refresh re-renders this page server-side
      router.refresh();
    } catch { setSaving(false); }
  }

  if (!editMode()) {
    return <Tag className={className}>{value}</Tag>;
  }

  if (editing) {
    return (
      <span className="adm-editwrap" style={{ display: "block" }}>
        <textarea
          id={"editArea-" + keyId}
          className="adm-input adm-inline-edit"
          value={draft}
          rows={multiline ? 3 : 1}
          onChange={(e) => setDraft(e.target.value)}
          autoFocus
        />
        <button type="button" className="adm-btn adm-btn-primary" disabled={saving} onClick={save}>
          {saving ? "Publishing…" : "Save & publish"}
        </button>
        <button type="button" className="adm-btn" onClick={() => setEditing(false)}>Cancel</button>
      </span>
    );
  }

  return (
    <Tag className={(className || "") + " adm-editable"} data-fkey={fkey} style={{ position: "relative" }}>
      {value}
      <button
        type="button"
        className="adm-edit-pencil"
        aria-label={label}
        onClick={start}
        title={`Edit: ${label}`}
      >
        <Pencil size={13} aria-hidden="true" />
      </button>
    </Tag>
  );
}
