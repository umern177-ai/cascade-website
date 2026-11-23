"use client";

// Sticky banner shown while on-page editing is ON (?edit=1 + admin session):
// explains the pencil icons, exits the mode, links to the full page editor.
// Pushes the page down so content is never hidden behind the bar.
import Link from "next/link";
import { useEffect } from "react";
import { Pencil, X } from "lucide-react";

export default function EditBar({ path }: { path: string }) {
  useEffect(() => {
    const prev = document.body.style.paddingTop;
    document.body.style.paddingTop = "96px";
    return () => { document.body.style.paddingTop = prev; };
  }, []);
  return (
    <div className="adm editbar" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 4000, pointerEvents: "none" }}>
      <div style={{ background: "#1c2333", color: "#fff", padding: "10px 18px", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap", pointerEvents: "auto" }}>
        <strong style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Pencil size={15} aria-hidden="true" /> Editing mode
        </strong>
        <span style={{ fontSize: 13, color: "#c3cadc", margin: 0 }}>
          Click a pencil, edit, then <b>Save &amp; publish</b> — changes go live instantly.
        </span>
        <Link href={`/admin/pages/edit?path=${encodeURIComponent(path)}`} className="adm-btn" style={{ padding: "5px 12px" }}>
          Full editor
        </Link>
        <Link href={path} className="adm-btn" style={{ padding: "5px 12px" }}>
          <X size={13} aria-hidden="true" /> Exit editing
        </Link>
        <span style={{ marginLeft: "auto", fontSize: 12, color: "#9aa4bd" }}>Admin session — changes publish without deployment</span>
      </div>
    </div>
  );
}
