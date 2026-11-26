# YourEvent — Front-End Plan B

One-page landing (Next.js 16 + React 19 + Tailwind 4) used while the main customer app is offline.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

- **Google Form link:** `src/config.ts` → `GOOGLE_FORM_URL`. Until set, "Ας ξεκινήσουμε" scrolls to the contact section.
- **Review photos:** drop files in `public/reviews/` and list them in `src/app/_landing/Reviews.tsx` (`images: []`).
- **PostHog:** copy `.env.example` to `.env.local`. Runs only when `NEXT_PUBLIC_ENV=production` and a key is set; cookieless.
  Events: `landing_viewed`, `landing_section_viewed` `{ section }`, `landing_start_clicked` `{ placement, has_form }`, `landing_faq_opened`, `landing_contact_clicked` `{ method }`.
