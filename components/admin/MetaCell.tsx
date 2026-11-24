"use client";

// Inline meta cell (Phase 5): click to edit, Enter or blur saves through the
// admin meta API. Green when inside the recommended length.
import { useState } from "react";

export default function MetaCell({ path, field, value }: { path: string; field: "title" | "description"; value: string }) {
  const [v, setV] = useState(value);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const best =
    field === "title" ? (v.trim().length >= 30 && v.trim().length <= 70 ? "#e2f2e7" : undefined) : v.trim().length >= 90 && v.trim().length <= 165 ? "#e2f2e7" : undefined;

  async function save(): Promise<void> {
    setEditing(false);
    setSaving(true);
    try {
      await fetch("/api/admin/meta", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, field, value: v.trim() }),
      });
    } finally {
      setSaving(false);
    }
  }

  if (editing) {
    return (
      <input
        className="adm-input"
        style={{ background: best }}
        autoFocus
        value={v}
        onChange={(e) => setV(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") void save();
        }}
      />
    );
  }
  return (
    <div
      className="adm-input"
      style={{ background: best, cursor: "pointer", minHeight: 30, padding: "5px 10px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
      title="Click to edit"
      onClick={() => setEditing(true)}
    >
      {v || <span style={{ color: "#a1a1a1" }}>— click to add —</span>}
      {saving && <span className="adm-hint-inline" style={{ marginLeft: 8 }}>saving…</span>}
    </div>
  );
}
