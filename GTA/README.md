# WANTED LEVEL

Turn any photo into custom **GTA-style character art** — solo, duo, or the whole
crew — with add-ons (cigar, baddies, exotic cars, your city) and a premium
printed-tee upsell. Built as a fast, captivating marketing site + live order
builder, ready to deploy on Vercel.

- **Home** (`/`) — animated hero slider, gallery carousel, add-ons, tee offer,
  pricing, testimonials, FAQ.
- **Order builder** (`/order`) — pick a style, set crew size, upload a photo,
  choose add-ons + premium options, watch a **live total**, and submit. Orders
  are emailed to you.

Stack: **Next.js 16** (App Router) · **React 19** · **Tailwind CSS v4** ·
Embla carousels · Framer Motion · Resend (email).

---

## Run it locally

```bash
cd GTA
npm install
npm run dev
# open http://localhost:3000
```

Build for production:

```bash
npm run build && npm start
```

---

## Configure order emails (Resend)

Orders submitted on `/order` are emailed to you (with the customer's photo
attached). Until this is set up, the form shows an "email us" fallback so no
order is ever lost.

1. Create a free account + API key at <https://resend.com/api-keys>.
2. Copy `.env.example` → `.env.local` and fill in:

   ```bash
   RESEND_API_KEY=re_xxxxxxxx
   ORDER_TO_EMAIL=you@example.com
   ORDER_FROM_EMAIL=WANTED LEVEL <orders@yourdomain.com>   # optional
   ```

   For real sending, verify a domain in Resend and use it in
   `ORDER_FROM_EMAIL`. If you leave it blank, Resend's onboarding sender is used
   (it can only deliver to the email on your Resend account — fine for testing).

3. Add the same variables in **Vercel → Project → Settings → Environment
   Variables** for production.

---

## Deploy to Vercel

1. Push this repo to GitHub (already on branch
   `claude/gta-character-photo-site-2h9d7s`).
2. In Vercel, **New Project → Import** this repo.
3. **Important:** set the **Root Directory** to `GTA` (the app lives in a
   subfolder). Framework preset auto-detects Next.js.
4. Add the environment variables above.
5. Deploy. Update `SITE.url` in `lib/config.ts` to your final domain for correct
   SEO/OpenGraph URLs.

---

## The artwork

All showcase images are generated in the GTA loading-screen style and referenced
from one file: **`lib/art.ts`**. They currently load from the fal.ai CDN.

**To make them permanent (recommended before launch):**

1. Open each URL in `lib/art.ts` in your browser and *Save image as…* into
   `GTA/public/art/` (e.g. `public/art/hero.jpg`).
2. Replace the URL string with the local path, e.g. `"/art/hero.jpg"`.

Every component reads from `lib/art.ts`, and a neon poster-frame fallback shows
automatically if any image is ever missing — the layout never breaks.

To generate more art, reuse the fal.ai connector with prompts like the ones in
`lib/art.ts`'s originals (cel-shaded, thick black outlines, flat saturated
colors, Vice City backdrop, "no text, no watermark").

---

## Customize the business

Everything you'll want to tweak lives in `lib/`:

| File             | What it controls                                             |
| ---------------- | ----------------------------------------------------------- |
| `lib/config.ts`  | Brand name, tagline, contact email, socials, currency       |
| `lib/pricing.ts` | Packages, per-person prices, add-ons, premium options       |
| `lib/art.ts`     | Every showcase image + the gallery lineup                   |

Change a price or add-on in `lib/pricing.ts` and both the homepage and the live
order calculator update together.

Other things to personalize before launch:

- Replace the placeholder testimonials in `components/site/Testimonials.tsx`.
- Update social links + contact in `lib/config.ts`.

---

## Notes

- Uploaded photos are compressed client-side (max 1600px) before submission so
  they stay under serverless request limits.
- This is an independent art studio project. It is **not** affiliated with or
  endorsed by Rockstar Games; "GTA" is a trademark of its respective owner.
