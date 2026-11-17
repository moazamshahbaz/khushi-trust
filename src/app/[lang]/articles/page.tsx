import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { hasLocale, href } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { ArticleThumb, PageHero } from "@/components/blocks";
import { Reveal } from "@/components/motion";

export async function generateMetadata({ params }: PageProps<"/[lang]/articles">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.articlesIndex.title };
}

export default async function Articles({ params }: PageProps<"/[lang]/articles">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.articlesIndex;
  return (
    <>
      <PageHero eyebrow={d.site.name} title={p.title} subtitle={p.subtitle} image={IMG.mosque} />
      <section className="mx-auto max-w-5xl space-y-8 px-4 py-24 sm:px-6">
        {d.articles.map((a, i) => (
          <Reveal key={a.slug} delay={i * 0.08}>
            <Link href={href(lang, `/articles/${a.slug}`)} className="group grid overflow-hidden rounded-2xl bg-ivory ring-1 ring-mortar transition-all duration-700 hover:-translate-y-1 hover:ring-brick/60 sm:grid-cols-[2fr_3fr]">
              <ArticleThumb src={IMG.article(a)} className="aspect-[4/3] sm:aspect-auto sm:min-h-72" />
              <div className="flex flex-col justify-center p-8 sm:p-10">
                <h2 className="font-display text-3xl leading-snug text-kashi-950">{a.title}</h2>
                <p className="mt-4 text-muted">{a.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-semibold text-brick">{d.ui.readMore} <ArrowRight className="flip-rtl h-4 w-4 transition-transform duration-500 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" /></span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}
