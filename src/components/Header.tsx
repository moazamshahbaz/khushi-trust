"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { Globe, Menu, X } from "lucide-react";
import { href, localeLabel, locales, type Locale } from "@/lib/i18n";
import type { Dict } from "@/lib/content";

/** Remember the chosen language so the bare domain opens in it next time */
function saveLang(l: Locale) {
  document.cookie = `lang=${l};path=/;max-age=31536000`;
}

export default function Header({ lang, d }: { lang: Locale; d: Pick<Dict, "nav" | "ui" | "site"> }) {
  const path = usePathname();
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setSolid(y > 40));

  const nav = [
    { k: "about", p: "/about" },
    { k: "programs", p: "/programs" },
    { k: "impact", p: "/impact" },
    { k: "team", p: "/team" },
    { k: "articles", p: "/articles" },
    { k: "contact", p: "/contact" },
  ] as const;
  const rest = path.replace(/^\/(en|ur|ar)/, "") || "/";
  const active = (p: string) => rest === p || rest.startsWith(p + "/");

  const setLang = saveLang;

  const light = !solid && !open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
        light ? "bg-gradient-to-b from-kashi-950/85 via-kashi-950/45 to-transparent text-ivory" :"bg-ivory/92 text-kashi-950 shadow-[0_1px_0_rgba(168,70,43,.25)] backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link href={href(lang)} className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className={`grid h-12 w-12 place-items-center rounded-full ${light ? "bg-ivory" : "bg-white"} ring-1 ring-brick/40`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="" className="h-11 w-11" />
          </span>
          <span className="font-display text-xl leading-tight sm:text-2xl">{d.site.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map((n) => (
            <Link key={n.k} href={href(lang, n.p)} className="group relative py-2 text-[0.95rem]">
              {d.nav[n.k]}
              <span
                className={`absolute inset-x-0 -bottom-0.5 h-px origin-center bg-brick transition-transform duration-500 ${
                  active(n.p) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`}
              />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="group relative hidden sm:block">
            <button className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm ring-1 ring-current/25" aria-label={d.nav.language}>
              <Globe className="h-4 w-4" /> {localeLabel[lang]}
            </button>
            <div className="invisible absolute end-0 top-full min-w-36 pt-2 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="overflow-hidden rounded-xl bg-ivory text-kashi-950 shadow-xl ring-1 ring-brick/30">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}${rest === "/" ? "" : rest}`}
                    onClick={() => setLang(l)}
                    lang={l}
                    className={`block px-4 py-2.5 text-start hover:bg-plaster ${l === lang ? "text-brick" : ""}`}
                  >
                    {localeLabel[l]}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            href={href(lang, "/donate")}
            className="hidden rounded-full bg-brick px-5 py-2.5 text-sm font-semibold text-ivory transition-colors duration-300 hover:bg-brick-deep sm:inline-block"
          >
            {d.ui.donateNow}
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label={open ? d.ui.closeMenu : d.ui.openMenu}>
            {open ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-brick/20 bg-ivory lg:hidden"
          >
            <div className="flex flex-col px-6 py-4">
              {nav.map((n) => (
                <Link key={n.k} href={href(lang, n.p)} onClick={() => setOpen(false)} className="border-b border-mortar/60 py-3 text-lg">
                  {d.nav[n.k]}
                </Link>
              ))}
              <div className="flex gap-2 py-4">
                {locales.map((l) => (
                  <Link
                    key={l}
                    href={`/${l}${rest === "/" ? "" : rest}`}
                    onClick={() => { setLang(l); setOpen(false); }}
                    className={`rounded-full px-4 py-1.5 ring-1 ${l === lang ? "bg-kashi-900 text-ivory ring-kashi-900" : "ring-brick/40"}`}
                  >
                    {localeLabel[l]}
                  </Link>
                ))}
              </div>
              <Link href={href(lang, "/donate")} onClick={() => setOpen(false)} className="rounded-full bg-brick py-3 text-center font-semibold text-ivory">
                {d.ui.donateNow}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
