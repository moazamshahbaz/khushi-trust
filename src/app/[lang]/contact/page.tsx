import { notFound } from "next/navigation";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { hasLocale } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { PageHero, SectionTitle } from "@/components/blocks";
import { WhatsAppForm } from "@/components/forms";
import { Reveal } from "@/components/motion";

export async function generateMetadata({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.contact.title };
}

export default async function Contact({ params }: PageProps<"/[lang]/contact">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.contact;
  const c = d.site.contact;
  const msg = p.sections.find((s) => s.id === "message");
  const cards = [
    { Icon: MapPin, label: d.ui.location, value: c.address },
    { Icon: Mail, label: d.ui.email, value: c.email, href: `mailto:${c.email}`, ltr: true },
    { Icon: Phone, label: d.ui.phone, value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}`, ltr: true },
    { Icon: ShieldCheck, label: d.ui.registration, value: d.site.registration.map((r) => r.number).join(" · "), ltr: true },
  ];
  return (
    <>
      <PageHero eyebrow={d.site.name} title={p.title} subtitle={p.subtitle} image={IMG.hero} />
      <section className="mx-auto grid max-w-7xl gap-14 px-4 py-24 sm:px-6 lg:grid-cols-[5fr_7fr]">
        <div className="space-y-4">
          <SectionTitle title={d.ui.contactInformation} center={false} />
          {cards.map(({ Icon, label, value, href, ltr }, i) => (
            <Reveal key={label} delay={i * 0.06} className="flex gap-4 rounded-2xl bg-plaster/70 p-5 ring-1 ring-mortar">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-kashi-900 text-clay"><Icon className="h-5 w-5" /></span>
              <div>
                <p className="text-sm text-muted">{label}</p>
                {href ? <a href={href} className="font-semibold text-kashi-950">{ltr ? <bdi dir="ltr">{value}</bdi> : value}</a>
                  : <p className="font-semibold text-kashi-950">{ltr ? <bdi dir="ltr">{value}</bdi> : value}</p>}
              </div>
            </Reveal>
          ))}
          <Reveal className="rounded-2xl p-5 ring-1 ring-mortar">
            <p className="font-display text-xl text-kashi-950">{d.ui.ourTeam}</p>
            {c.people.map((pp) => (
              <p key={pp.name} className="mt-3">
                <span className="font-semibold">{pp.name}</span> <span className="text-muted">· {pp.role}</span><br />
                <a href={`tel:${pp.phone.replace(/\s/g, "")}`} className="text-kashi-700"><bdi dir="ltr">{pp.phone}</bdi></a>
              </p>
            ))}
          </Reveal>
        </div>
        <Reveal delay={0.1} className="rounded-3xl bg-plaster/50 p-6 ring-1 ring-mortar sm:p-10">
          <h2 className="font-display text-3xl text-kashi-950">{msg?.heading ?? d.ui.sendUsMessage}</h2>
          <div className="mt-8">
            <WhatsAppForm fields={p.form.fields} submitLabel={p.form.submitLabel} whatsapp={c.whatsapp} heading={d.site.name} />
          </div>
        </Reveal>
      </section>
    </>
  );
}
