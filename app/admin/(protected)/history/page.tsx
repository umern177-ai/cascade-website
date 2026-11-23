// History log — every admin save is appended here by lib/admin/store
// (logHistory). Newest first. Read-only: the log is the record, not the tool.
import Link from "next/link";
import { getHistory, HISTORY_KIND_LABELS, HistoryEntry } from "@/lib/admin/store";
import { History } from "lucide-react";

export const dynamic = "force-dynamic";

function row(entry: HistoryEntry) {
  const when = new Date(entry.at);
  const date = when.toLocaleString("en-US", {
    year: "numeric", month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true,
  });
  return (
    <tr key={entry.id}>
      <td className="adm-muted" style={{ whiteSpace: "nowrap" }}>{date}</td>
      <td><span className="adm-chip">{HISTORY_KIND_LABELS[entry.kind] ?? entry.kind}</span></td>
      <td>
        {entry.path.startsWith("/") && !entry.path.startsWith("/admin") ? (
          <Link href={entry.path} className="adm-link" target="_blank">{entry.path}</Link>
        ) : (
          <code>{entry.path}</code>
        )}
      </td>
      <td>{entry.summary}</td>
    </tr>
  );
}

export default async function AdminHistoryPage() {
  const entries = await getHistory();

  return (
    <>
      <header className="adm-page-head">
        <div>
          <h1>History log</h1>
          <p>Every change made from the admin — newest first. Shows what was saved, on which page, and when.</p>
        </div>
        <History aria-hidden="true" />
      </header>

      <div className="adm-panel">
        <h2>{`Changes (${entries.length}${entries.length >= 500 ? "+, older entries roll off" : ""})`}</h2>
        {entries.length === 0 ? (
          <p className="adm-hint">No changes yet — save something in the admin and it will appear here.</p>
        ) : (
          <table className="adm-table">
            <thead>
              <tr><th>When</th><th>What</th><th>Page</th><th>Details</th></tr>
            </thead>
            <tbody>{entries.map(row)}</tbody>
          </table>
        )}
      </div>
    </>
  );
}
