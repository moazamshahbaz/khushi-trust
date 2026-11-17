import Link from "next/link";
import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { href, type Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/content";
import { StarLattice } from "./ornament";

const PATHS: Record<string, string> = {
  home: "/", about: "/about", qariKhushi: "/qari-khushi", programs: "/programs", team: "/team",
  impact: "/impact", donate: "/donate", contact: "/contact", articles: "/articles", volunteer: "/volunteer",
};

export default function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const c = d.site.contact;
  const links = (d.site.footer.quickLinkKeys as string[]).filter((k) => PATHS[k]);
  const progs = d.programs.filter((p) => (d.site.footer.featuredProgramSlugs as string[]).includes(p.slug));
  return (
    <footer className="relative overflow-hidden bg-kashi-950 text-ivory/85">
      <StarLattice id="foot-lattice" stroke="#d08a6b" opacity={0.08} size={110} />
      <div className="relative mx-auto max-w-7xl px-4 pt-20 pb-10 sm:px-6">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-ivory">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/logo.png" alt="" className="h-13 w-13" />
              </span>
              <span className="font-display text-2xl text-ivory">{d.site.name}</span>
            </div>
            <p className="mt-5 max-w-xs text-ivory/70">{d.site.description}</p>
            <div className="mt-6 flex gap-3">
              {d.site.social.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noreferrer" className="rounded-full px-4 py-1.5 text-sm ring-1 ring-brick/40 transition-colors hover:bg-brick hover:text-ivory">
                  {s.name}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-display text-xl text-clay">{d.ui.quickLinks}</h3>
            <ul className="mt-5 space-y-2.5">
              {links.map((k) => (
                <li key={k}>
                  <Link href={href(lang, PATHS[k])} className="transition-colors hover:text-clay">
                    {(d.nav as Record<string, string>)[k] ?? k}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl text-clay">{d.ui.ourPrograms}</h3>
            <ul className="mt-5 space-y-2.5">
              {progs.map((p) => (
                <li key={p.slug}>
                  <Link href={href(lang, `/programs/${p.slug}`)} className="transition-colors hover:text-clay">{p.title}</Link>
                </li>
              ))}
              <li>
                <Link href={href(lang, "/programs")} className="text-clay">{d.ui.seeAllPrograms}</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl text-clay">{d.ui.contactUs}</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex gap-3"><MapPin className="mt-1 h-5 w-5 shrink-0 text-brick" />{c.address}</li>
              <li className="flex gap-3"><Mail className="mt-1 h-5 w-5 shrink-0 text-brick" /><a href={`mailto:${c.email}`}><bdi>{c.email}</bdi></a></li>
              <li className="flex gap-3"><Phone className="mt-1 h-5 w-5 shrink-0 text-brick" /><a href={`tel:${c.phone.replace(/\s/g, "")}`}><bdi dir="ltr">{c.phone}</bdi></a></li>
              <li className="flex gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-brick" />
                <span>{d.site.registration.map((r) => <span key={r.number} className="block">{r.act}: <bdi dir="ltr">{r.number}</bdi></span>)}</span>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-6 text-center text-sm text-ivory/55">{d.site.footer.copyright}</p>
      </div>
    </footer>
  );
}
