import Link from "next/link";
import { notFound } from "next/navigation";
import { Landmark, Mail, Phone } from "lucide-react";
import { hasLocale, href } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { PageHero, SectionTitle } from "@/components/blocks";
import { CopyField } from "@/components/forms";
import { Reveal } from "@/components/motion";

export async function generateMetadata({ params }: PageProps<"/[lang]/donate">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.donate.title };
}

type Item = { title?: string; text?: string; programSlug?: string };

export default async function Donate({ params }: PageProps<"/[lang]/donate">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.donate;
  const sec = (id: string) => p.sections.find((s) => s.id === id) as { heading?: string; body?: string[]; items?: Item[] } | undefined;
  const why = sec("why-donate");
  const method = sec("donation-method");
  const sponsor = sec("sponsor-a-cause");
  const others = p.sections.filter((s) => !["why-donate", "donation-method", "sponsor-a-cause"].includes(s.id)) as { id: string; heading?: string; body?: string[] }[];
  const m = d.donate.methods[0];

  return (
    <>
      <PageHero eyebrow={d.site.name} title={p.title} subtitle={p.subtitle} image={IMG.program("food-assistance")} />

      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[6fr_5fr]">
        <div>
          {why && (
            <>
              <SectionTitle title={why.heading ?? ""} center={false} />
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {why.items?.map((it, i) => (
                  <Reveal key={i} delay={i * 0.06} className="rounded-2xl bg-plaster/70 p-6 ring-1 ring-mortar">
                    <h3 className="font-display mt-3 text-2xl text-kashi-950">{it.title}</h3>
                    <p className="mt-1.5 text-muted">{it.text}</p>
                  </Reveal>
                ))}
              </div>
            </>
          )}
          <Reveal className="mt-10 rounded-2xl p-6 ring-1 ring-mortar">
            <p className="font-semibold text-kashi-900">{d.donate.suggestedAmountsHeading}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {d.donate.suggestedAmounts.map((a) => (
                <span key={a} className="rounded-full bg-plaster px-5 py-2 font-semibold text-kashi-900 ring-1 ring-brick/40">
                  <bdi dir="ltr">{d.donate.currency} {a.toLocaleString("en-US")}</bdi>
                </span>
              ))}
            </div>
            <p className="mt-4 text-sm text-muted">{d.donate.amountSelectionNote}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative isolate overflow-hidden rounded-t-[12rem] rounded-b-3xl bg-kashi-950 px-8 pt-20 pb-8 text-ivory shadow-2xl ring-1 ring-brick/40 lg:sticky lg:top-28">
            <div className="relative">
              <Landmark className="mx-auto h-9 w-9 text-brick" />
              <h2 className="font-display mt-4 text-center text-3xl text-clay">{method?.heading ?? d.ui.bankTransferDetails}</h2>
              {d.donate.accounts.map((acc) => (
                <div key={acc.iban} className="mt-8">
                  <CopyField label={d.ui.accountTitle} value={acc.title} copyLabel="Copy" />
                  <CopyField label={d.ui.bank} value={acc.bankDisplay} copyLabel="Copy" />
                  <CopyField label={d.ui.accountNumber} value={acc.accountNo} copyLabel="Copy" />
                  <CopyField label={d.ui.iban} value={acc.iban} copyLabel="Copy" />
                  <CopyField label={d.ui.branchCode} value={acc.branchCode} copyLabel="Copy" />
                </div>
              ))}
              <p className="mt-6 text-sm text-ivory/75">{m.confirmation}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-brick/40 hover:bg-ivory/10"><Mail className="h-4 w-4" /><bdi>{m.email}</bdi></a>
                <a href={`tel:${m.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full px-4 py-2 ring-1 ring-brick/40 hover:bg-ivory/10"><Phone className="h-4 w-4" /><bdi dir="ltr">{m.phone}</bdi></a>
              </div>
              <p className="mt-6 text-xs text-ivory/55">{d.donate.receipts}</p>
            </div>
          </div>
        </Reveal>
      </section>

      {others.map((s) => (
        <section key={s.id} className="mx-auto max-w-3xl px-4 pb-16 text-center sm:px-6">
          {s.heading && s.heading !== p.title && <Reveal><h2 className="font-display text-3xl text-kashi-950">{s.heading}</h2></Reveal>}
          {s.body?.map((b, i) => <Reveal key={i}><p className="mt-4 text-lg text-ink/85">{b}</p></Reveal>)}
        </section>
      ))}

      {sponsor?.items && (
        <section className="bg-plaster py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionTitle title={sponsor.heading ?? d.ui.sponsorCause} />
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sponsor.items.map((it, i) => (
                <Reveal key={i} delay={(i % 3) * 0.06}>
                  <Link href={href(lang, `/programs/${it.programSlug}`)} className="group flex h-full gap-4 rounded-2xl bg-ivory p-4 ring-1 ring-mortar transition-colors hover:ring-brick/60">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={IMG.program(it.programSlug ?? "")} alt="" loading="lazy" className="arch h-24 w-20 shrink-0 object-cover" />
                    <div>
                      <h3 className="font-display text-xl text-kashi-950">{it.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">{it.text}</p>
                      <span className="mt-2 inline-block text-sm font-semibold text-kashi-700">{d.ui.sponsorThis}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
