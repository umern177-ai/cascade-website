// Redirect rules — Admin Panel Upgrade Phase 4 (section 6.1/6.2/6.6).
// Rules live in data/admin/redirects.json (+ Blob) and are APPLIED AT RUNTIME
// by the node middleware (middleware.ts), so a saved rule is live in seconds —
// no build/deploy. Each rule carries: from, to, type (301/302/307/410),
// status (active/inactive), note, hits, last_hit.
import "server-only";
import { AdminRedirect, getRedirects, saveRedirects } from "@/lib/admin/store";
import { pageCatalog } from "@/lib/admin/page-catalog";

export type RuntimeRule = AdminRedirect & {
  id: string;
  from: string;
  to: string;
  type: 301 | 302 | 307 | 410;
  note?: string;
  match?: "exact" | "wildcard";
  status?: "active" | "inactive";
  hits?: number;
  last_hit?: string;
};

export type { AdminRedirect };

const DEFAULT_RULES: RuntimeRule[] = [];

export async function listRules(): Promise<RuntimeRule[]> {
  return (await getRedirects()) as unknown as RuntimeRule[] ?? DEFAULT_RULES;
}

export async function listActiveRules(): Promise<RuntimeRule[]> {
  return (await listRules()).filter((r) => (r.status ?? "active") === "active");
}

// URL key normalization shared with the middleware: lowercase, trailing slash
// trimmed ("/X/" and "/x" collapse to "/x").
export function ruleKey(pathname: string): string {
  try {
    pathname = decodeURI(pathname);
  } catch {
    /* keep raw */
  }
  return pathname.toLowerCase().replace(/\/+$/, "") || "/";
}

export function matchRule(rules: RuntimeRule[], pathname: string): RuntimeRule | undefined {
  const key = ruleKey(pathname);
  // exact rules win; then wildcard (pattern) rules
  const exact = rules.find((r) => !(r as RuntimeRule).match && ruleKey(r.from) === key);
  if (exact) return exact;
  const wild = rules.find((r) => (r as RuntimeRule).match === "wildcard" && wildcardMatches(r.from, key));
  if (wild) return wild;
  return undefined;
}

function wildcardMatches(pattern: string, key: string): boolean {
  const p = pattern.toLowerCase().replace(/\/+$/, "");
  const i = p.indexOf("*");
  if (i < 0) return p === key;
  const head = p.slice(0, i);
  const tail = p.slice(i + 1).replace(/\/+$/, "");
  return key.startsWith(head) && (tail === "" || key.endsWith(tail));
}

// Build the redirect target preserving the query string (section 6.1) and
// filling * in wildcard targets.
export function targetFor(rule: RuntimeRule, pathname: string, search: string): string {
  const type = rule.type;
  if (type === 410) return ""; // 410 has no target
  let to = rule.to;
  if ((rule as RuntimeRule).match === "wildcard" && to.includes("*")) {
    const pattern = rule.from;
    const p = pattern.toLowerCase().replace(/\/+$/, "");
    const key = ruleKey(pathname);
    const i = p.indexOf("*");
    const middle = key.startsWith(p.slice(0, i)) ? key.slice(p.slice(0, i).length) : "";
    to = to.replace(/\*/, middle);
  }
  return to + (search ? (to.includes("?") ? "&" : "?") + search.replace(/^\?/, "") : "");
}

// Follow the chain (up to 5 hops) — used by the "Test a URL" tool and by the
// loop/chain checks on save.
export async function resolveChain(url: string, maxHops = 5): Promise<Array<{ step: number; url: string; rule?: RuntimeRule; final: boolean; status?: number }>> {
  const rules = await listActiveRules();
  const steps: Array<{ step: number; url: string; rule?: RuntimeRule; final: boolean; status?: number }> = [];
  let current = url;
  for (let hop = 0; hop < maxHops; hop++) {
    const rule = matchRule(rules, current);
    if (!rule) {
      steps.push({ step: hop, url: current, final: true });
      return steps;
    }
    const to = targetFor(rule, current, "");
    steps.push({ step: hop, url: current, rule, final: false, status: rule.type });
    const base = current.split("?")[0];
    current = to.startsWith("http") ? to : to && to.startsWith("/") ? to : base + to;
    if (hop === maxHops - 1) {
      steps.push({ step: hop + 1, url: current, final: true, status: undefined });
    }
  }
  return steps;
}

// Safety checks used when adding/saving rules (section 6.3). Returns a warning
// list; empty = clean.
export async function checkRule(from: string, to: string, type: number): Promise<{ warnings: string[]; blocked: string[] }> {
  const warnings: string[] = [];
  const blocked: string[] = [];
  const rules = await listActiveRules();
  if (type !== 410 && ruleKey(from) === ruleKey(to)) blocked.push("Source and target are the same URL.");
  const chain = await resolveChain(to || from);
  const finalUrl = chain[chain.length - 1]?.url || "";
  if (type !== 410) {
    const hops = chain.filter((c) => c.rule).length;
    if (hops >= 1 && ruleKey(finalUrl) === ruleKey(from)) blocked.push("This creates a LOOP back to the source URL.");
    if (hops >= 2) warnings.push("This adds a CHAIN (the target itself redirects). Fix the chain: point this rule at the final URL " + finalUrl + " instead.");
  }
  if (rules.some((r) => ruleKey(r.from) === ruleKey(from))) warnings.push("A rule for this source already exists (the new save overwrites it).");
  const known = new Set((await pageCatalog()).map((c) => c.path));
  if (ruleKey(known.has(ruleKey(from)) ? from : "/") === ruleKey(from) && known.has(ruleKey(from))) {
    warnings.push("This is a live published page — redirecting will hide it.");
  }
  return { warnings, blocked };
}

// Save with hit stat preservation.
export function normalizeFrom(from: string): string {
  const t = from.trim();
  return t.startsWith("/") ? t : "";
}

export async function saveRule(rule: RuntimeRule): Promise<void> {
  const rules = await listRules();
  const i = rules.findIndex((r) => ruleKey(r.from) === ruleKey(rule.from));
  const active = rule.status ?? "active";
  if (i >= 0) {
    const old = rules[i];
    rules[i] = { ...rule, status: active, hits: old.hits, last_hit: old.last_hit };
  } else {
    rules.push({ ...rule, status: active, hits: 0 });
  }
  await saveRedirects(rules);
}

export async function toggleRule(from: string): Promise<void> {
  const rules = await listRules();
  const r = rules.find((x) => ruleKey(x.from) === ruleKey(from));
  if (r) r.status = (r.status ?? "active") === "active" ? "inactive" : "active";
  await saveRedirects(rules);
}

export async function deleteRule(from: string): Promise<void> {
  const rules = await listRules();
  await saveRedirects(rules.filter((r) => ruleKey(r.from) !== ruleKey(from)));
}

export async function bumpHits(from: string): Promise<void> {
  const rules = await listRules();
  const r = rules.find((x) => ruleKey(x.from) === ruleKey(from));
  if (r) {
    r.hits = (r.hits ?? 0) + 1;
    r.last_hit = new Date().toISOString();
    // write-through every hit; JSON is small at current rule counts
    await saveRedirects(rules);
  }
}
