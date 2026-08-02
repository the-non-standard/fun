import { NextResponse } from "next/server";
import { Resend } from "resend";

export const runtime = "nodejs";

type OrderPayload = {
  style: string;
  styleName: string;
  people: number;
  artName: string;
  addons: { name: string; price: number }[];
  premium: {
    tshirt: boolean;
    tshirtSize: string | null;
    hires: boolean;
    rush: boolean;
  };
  customer: { name: string; email: string; notes: string };
  total: number;
};

const money = (n: number) => `$${n}`;

function buildHtml(o: OrderPayload, hasPhoto: boolean) {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 14px 6px 0;color:#6b7280">${label}</td><td style="padding:6px 0;color:#111;font-weight:600">${value}</td></tr>`;
  const premium = [
    o.premium.tshirt ? `T-shirt (${o.premium.tshirtSize})` : null,
    o.premium.hires ? "Hi-res file" : null,
    o.premium.rush ? "24h rush" : null,
  ]
    .filter(Boolean)
    .join(", ");

  return `
  <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:auto;background:#0f0d1a;border-radius:16px;overflow:hidden">
    <div style="background:linear-gradient(100deg,#ffb020,#ff2d95 60%,#8b2fff);padding:22px 26px">
      <div style="font-size:22px;font-weight:800;letter-spacing:1px;color:#0a0510">WANTED LEVEL — NEW ORDER</div>
      <div style="color:#1a0a18;font-weight:600">${o.artName}</div>
    </div>
    <div style="padding:22px 26px;background:#ffffff">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${row("Name on art", o.artName)}
        ${row("Style", o.styleName)}
        ${row("People", String(o.people))}
        ${row("Add-ons", o.addons.map((a) => `${a.name} (+${money(a.price)})`).join(", ") || "none")}
        ${row("Premium", premium || "none")}
        ${row("Total (est.)", `<span style="color:#16a34a">${money(o.total)}</span>`)}
        ${row("Photo", hasPhoto ? "Attached ✓" : "⚠ not attached")}
      </table>
      <hr style="border:none;border-top:1px solid #eee;margin:18px 0" />
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        ${row("Customer", o.customer.name || "—")}
        ${row("Email", `<a href="mailto:${o.customer.email}">${o.customer.email}</a>`)}
        ${row("Notes", o.customer.notes || "—")}
      </table>
    </div>
    <div style="padding:14px 26px;background:#0f0d1a;color:#9a94ad;font-size:12px">
      Reply to this email to confirm the order and arrange payment.
    </div>
  </div>`;
}

export async function POST(request: Request) {
  let order: OrderPayload;
  let photo: File | null = null;

  try {
    const form = await request.formData();
    const raw = form.get("order");
    if (typeof raw !== "string") throw new Error("missing order");
    order = JSON.parse(raw) as OrderPayload;
    const p = form.get("photo");
    if (p instanceof File && p.size > 0) photo = p;
  } catch {
    return NextResponse.json({ error: "Invalid order data." }, { status: 400 });
  }

  // Basic validation
  if (
    !order?.artName?.trim() ||
    !/\S+@\S+\.\S+/.test(order?.customer?.email ?? "")
  ) {
    return NextResponse.json(
      { error: "Missing a name or a valid email." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ORDER_TO_EMAIL;
  const from = process.env.ORDER_FROM_EMAIL || "WANTED LEVEL <onboarding@resend.dev>";

  // Always log so the order is recoverable from server logs even if email is
  // not yet configured (visible in your Vercel deployment logs).
  console.log("[order]", JSON.stringify({ ...order, photo: photo?.name }));

  if (!apiKey || !to) {
    return NextResponse.json(
      {
        error:
          "Order email is not configured yet. Set RESEND_API_KEY and ORDER_TO_EMAIL in your environment.",
      },
      { status: 503 },
    );
  }

  try {
    const resend = new Resend(apiKey);
    const attachments = photo
      ? [
          {
            filename: photo.name || "photo.jpg",
            content: Buffer.from(await photo.arrayBuffer()),
          },
        ]
      : undefined;

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: order.customer.email,
      subject: `New order: ${order.artName} — ${order.styleName} (${money(order.total)})`,
      html: buildHtml(order, !!photo),
      attachments,
    });

    if (error) {
      console.error("[order] resend error", error);
      return NextResponse.json(
        { error: "Email service rejected the order. Please email us directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[order] send failed", e);
    return NextResponse.json(
      { error: "Could not send the order. Please email us directly." },
      { status: 500 },
    );
  }
}
