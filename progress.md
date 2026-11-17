# The Khushi Trust website: progress

**Last updated:** 16 Nov 2026

## Done
- New site built from scratch for thekhushitrust.org in `C:\Users\Moazam\Code\khushi-trust` (Next.js 16, Motion, Lenis). Production build passes: 96 pages, no type or lint errors. All routes return 200.
- Languages: `/en`, `/ur` (Nastaliq, RTL), `/ar` (Naskh/Amiri, RTL). `src/proxy.ts` sends `/` to the cookie or browser language.
- Content: `src/content/{en,ur,ar}.json`. Made by the Codex lane (gpt-6.1-sol over the OpenAI API, `Code\khushi-trust-tools\codex_content.mjs`) from a Firecrawl scrape (`scrape.mjs`). Raw scrape, original images and raw packs are in `Code\khushi-trust-source`.
- Photos: 12 generated scenes of rural Okara in `public/images/gen` (`gen_photos.mjs`, gpt-image-2.5-sunburst). The trust's real photos are kept (girls' school, ambulance, graveyard, cricket ground, founder portrait). Image map: `IMG` in `src/lib/content.ts`.
- Pages: home, about, qari-khushi, programs and 12 programme pages, impact, team, articles and 3 articles, donate (bank details with copy buttons), contact, volunteer. Contact and volunteer forms open WhatsApp with the message filled in.
- Articles thumbnails: a whole portrait in an arch; the intro card is a three-arch triptych of real photos (`ArticleThumb` in `src/components/blocks.tsx`).
- `CONTENT-FLAGS.md`: 35 figures and claims for the trust to confirm.
- 16 Nov: inner pages brought up to the home page's design. `PageHero` is now photo-led and start-aligned (rosette, or an arched portrait via `portrait`). About, Impact, programme detail, Qari Khushi and articles have bespoke layouts. `DonateBand` is light so pages end light before the dark footer. `ltr()` in blocks.tsx keeps digit runs (2026–27) LTR in Urdu and Arabic. `Sections` honours `renderOrder`. Headless QA: 3 languages × 12 pages × 2 widths: all 200, no console errors, no broken images, no overflow.

## Decisions (made by Moazam)
- No green-and-gold. Palette: kashi indigo, Okara brick, limewash, plaster (`src/app/globals.css`). No tracked uppercase labels, no star-and-rule dividers, star lattice on page heroes and footer only.
- Photos show honest need but not overdone: modest clothes and homes, no misery. No marigolds at the nikah; no bottles on the shop shelves.
- Build locally first. The live site is on Cloudflare with no access; DNS moves to Vercel later.
- Codex runs only through the OpenAI API, not the CLI.

## Open
- The trust to confirm the items in `CONTENT-FLAGS.md` (home figures, biography claims, the founder's age and Hijri date of death, honours).
- A native Urdu and Arabic reader to check the rendered pages.
- Real photos from the trust to replace the generated ones over time. Three old-site photos carry a Gemini mark.
- Form backend (email or database) if WhatsApp-only is not enough.

## Next
1. Moazam's go-ahead to `git commit` (nothing is committed yet; the repo was created by create-next-app).
2. Create the Vercel project, deploy, test the preview URL.
3. Add thekhushitrust.org to Vercel and give Moazam the DNS records to switch from Cloudflare.
4. Apply the trust's answers on the flags to `src/content/*.json` (keep all three packs in step: same keys).

## Gotchas
- Run the server as `node node_modules/next/dist/bin/next start -p 3210`. With `npx`, stopping the task leaves a child node process holding the port.
- Headless screenshots: Playwright's bundled browser is not installed; launch with `channel: 'chrome'`, and set `reducedMotion: 'reduce'` or Lenis smooth scrolling hijacks `scrollTo`. Install Playwright with `npm i --no-save playwright` so it never lands in package.json.
- Tailwind `text-*` classes set their own line-height; the Urdu overrides in `globals.css` use `!important` on purpose.
- Counters must stay in an LTR isolate (`Counter` in `src/components/motion.tsx`), or Urdu shows "+1,000".
