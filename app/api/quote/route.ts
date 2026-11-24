// Quote form endpoint (brief 5): server-side validation, honeypot + time-trap
// (checked client-side too), simple rate limiting.
// Admin Panel Upgrade Phase 1: every submission is SAVED FIRST (inquiries
// store — durable via the admin store / Vercel Blob), THEN emailed. If the
// email fails the inquiry is still in /admin/inquiries — no lead is lost.
import { NextResponse } from "next/server";
import { addInquiry, markEmailFailure, markEmailSent, Inquiry } from "@/lib/admin/leads";

function rateLimitOk(ip: string): boolean {
  const map = ((globalThis as unknown as { __quoteHits?: Map<string, { count: number; reset: number }> }).__quoteHits ??= new Map());
  const now = Date.now();
  const h = map.get(ip);
  if (!h || h.reset < now) {
    map.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  h.count += 1;
  return h.count <= 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "local";
  if (!rateLimitOk(ip)) {
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

  const inquiry: Omit<Inquiry, "id" | "status" | "notes"> = {
    receivedAt: new Date().toISOString(),
    tripType: get("tripTypeRadio"),
    fullName: get("fullName"),
    email,
    phone: get("phone"),
    pickupLocation: get("pickupLocation"),
    pickupTime: get("pickupTime"),
    dropoff: get("dropoff"),
    dropoffTime: get("dropoffTime"),
    stops: get("stops") || undefined,
    tripDate,
    passengers,
    category: get("categoryRadio") || undefined,
    details: get("details") || undefined,
    // tracking — where the visitor came from
    pageUrl: get("pageUrl") || req.headers.get("referer") || undefined,
    referrer: req.headers.get("referer") || undefined,
    utm: Object.fromEntries(new URL(req.url).searchParams.entries()),
    ip,
  };

  // 1) SAVE FIRST — the lead exists even if every later step fails.
  const id = await addInquiry(inquiry);

  // 2) Email via Resend once the API key is configured (brief Section 5).
  const resendKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.QUOTE_TO_EMAIL || process.env.QUOTE_FROM_EMAIL;
  if (resendKey && toEmail) {
    try {
      const body = {
        from: process.env.QUOTE_FROM_EMAIL || "quotes@cascadecharterbus.com",
        to: toEmail,
        reply_to: email,
        subject: `New quote request — ${inquiry.fullName} — ${inquiry.tripDate}`,
        text:
          `Inquiry ${id}\nName: ${inquiry.fullName}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\n` +
          `Trip type: ${inquiry.tripType}\nDate: ${inquiry.tripDate}\nPassengers: ${inquiry.passengers}\n` +
          `Pick-up: ${inquiry.pickupLocation} @ ${inquiry.pickupTime}\nDrop-off: ${inquiry.dropoff} @ ${inquiry.dropoffTime}\n` +
          `Stops: ${inquiry.stops || ""}\nCategory: ${inquiry.category || ""}\nDetails: ${inquiry.details || ""}\n` +
          `Came from: ${inquiry.pageUrl || inquiry.referrer || ""}\nReferrer: ${inquiry.referrer}\nUTM: ${JSON.stringify(inquiry.utm)}\n` +
          `\nView in admin: /admin/inquiries/\n`,
      };
      const r = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...body, text: body.text + `\n\n---\nSent by the website quote form.` }),
      });
      if (r.ok) {
        await markEmailSent(id);
      } else {
        const t = await r.text();
        console.error("Resend error:", r.status, t.slice(0, 300));
        await markEmailFailure(id, `HTTP ${r.status}`);
      }
    } catch (e) {
      console.error("Resend exception:", e);
      await markEmailFailure(id, e instanceof Error ? e.message.slice(0, 200) : "unknown");
    }
  }

  return NextResponse.json({ ok: true, id });
}
