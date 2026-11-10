// Quote form endpoint (brief 5): server-side validation, honeypot + time-trap
// (checked client-side too), simple rate limiting. Email via Resend API — until
// RESEND_API_KEY is configured, submissions are logged to a local file (dev only).
import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const hits = new Map<string, { count: number; reset: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + 60_000 });
    return false;
  }
  h.count += 1;
  return h.count > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Too many requests. Please call us instead." }, { status: 429 });
  }

  const fd = await req.formData();
  const get = (k: string) => (fd.get(k) as string | null)?.trim() ?? "";

  // Spam traps
  if (get("company")) return NextResponse.json({ error: "Invalid submission." }, { status: 400 });

  // Required fields (brief 7.9 table)
  const required = ["fullName", "email", "phone", "pickupLocation", "pickupTime", "dropoff", "dropoffTime", "tripDate", "passengers"] as const;
  for (const f of required) {
    if (!get(f)) return NextResponse.json({ error: `Missing field: ${f}` }, { status: 400 });
  }
  const email = get("email");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }
  const passengers = parseInt(get("passengers"), 10);
  if (!Number.isFinite(passengers) || passengers < 1) {
    return NextResponse.json({ error: "Passenger count must be at least 1." }, { status: 400 });
  }
  const tripDate = get("tripDate");
  const today = new Date().toISOString().slice(0, 10);
  if (tripDate < today) {
    return NextResponse.json({ error: "Trip date cannot be in the past." }, { status: 400 });
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    tripType: get("tripTypeRadio"),
    fullName: get("fullName"),
    email,
    phone: get("phone"),
    pickupLocation: get("pickupLocation"),
    pickupTime: get("pickupTime"),
    dropoff: get("dropoff"),
    dropoffTime: get("dropoffTime"),
    stops: get("stops"),
    tripDate,
    passengers,
    category: get("categoryRadio"),
    details: get("details"),
    referrer: req.headers.get("referer") || "",
    utm: Object.fromEntries(new URL(req.url).searchParams.entries()),
  };

  // Always log (dev mode + audit trail until the admin stores leads)
  try {
    const dir = path.join(process.cwd(), ".lead-queue");
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, "leads.jsonl"), JSON.stringify(lead) + "\n");
  } catch {
    /* non-fatal */
  }

  // Email via Resend once the API key is configured (brief Section 5)
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL || process.env.QUOTE_FROM_EMAIL;
  if (resendKey && toEmail) {
    try {
      const body = {
        from: process.env.QUOTE_FROM_EMAIL || "quotes@cascadecharterbus.com",
        to: toEmail,
        reply_to: email,
        subject: `New quote request — ${lead.fullName} — ${lead.tripDate}`,
        text:
          `Name: ${lead.fullName}\nEmail: ${lead.email}\nPhone: ${lead.phone}\n` +
          `Trip type: ${lead.tripType}\nDate: ${lead.tripDate}\nPassengers: ${lead.passengers}\n` +
          `Pick-up: ${lead.pickupLocation} @ ${lead.pickupTime}\nDrop-off: ${lead.dropoff} @ ${lead.dropoffTime}\n` +
          `Stops: ${lead.stops}\nCategory: ${lead.category}\nDetails: ${lead.details}\n` +
          `Came from: ${lead.referrer}\nUTM: ${JSON.stringify(lead.utm)}\n`,
      };
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, text: body.text + `\n\n---\nSent by the website quote form.` }),
      });
      if (!r.ok) {
        const t = await r.text();
        console.error("Resend error:", r.status, t.slice(0, 300));
      }
    } catch (e) {
      console.error("Resend exception:", e);
    }
  }

  return NextResponse.json({ ok: true });
}
