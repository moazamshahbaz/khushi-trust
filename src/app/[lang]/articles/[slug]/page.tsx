import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { hasLocale, href, locales } from "@/lib/i18n";
import { getDict, IMG, isPortrait } from "@/lib/content";
import en from "@/content/en.json";
import { PageHero } from "@/components/blocks";
import { ArchImage, Reveal } from "@/components/motion";
import ArticleBody from "@/components/ArticleBody";

export const generateStaticParams = () =>
  locales.flatMap((lang) => en.articles.map((a) => ({ lang, slug: a.slug })));

export async function generateMetadata({ params }: PageProps<"/[lang]/articles/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const a = (await getDict(lang)).articles.find((x) => x.slug === slug);
  return a ? { title: a.title, description: a.excerpt } : {};
}

export default async function ArticlePage({ params }: PageProps<"/[lang]/articles/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const a = d.articles.find((x) => x.slug === slug);
  if (!a) notFound();
  return (
    <>
      {isPortrait(IMG.file(a.image)) ? (
        <>
          <PageHero eyebrow={d.site.name} title={a.title} subtitle={a.subtitle || undefined} image={IMG.mosque} portrait={IMG.file(a.image)} portraitAlt={d.site.founderDisplayName} />
          <Reveal className="relative mx-auto mt-16 w-60 lg:hidden">
            <div className="absolute -inset-3 rounded-t-full border border-brick/40" />
            <ArchImage src={IMG.file(a.image)!} alt={d.site.founderDisplayName} className="aspect-[4/5] w-full" />
          </Reveal>
        </>
      ) : (
        <PageHero eyebrow={d.site.name} title={a.title} subtitle={a.subtitle || undefined} image={IMG.file(a.image) ?? IMG.mosque} />
      )}
      <ArticleBody
        body={a.body as never}
        images={isPortrait(IMG.file(a.image)) ? [IMG.mosque, IMG.hero, IMG.community] : [IMG.school, IMG.program("sports"), IMG.community]}
      />
      <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6">
        <Link href={href(lang, "/articles")} className="inline-flex items-center gap-2 font-semibold text-kashi-700">
          <ArrowLeft className="flip-rtl h-4 w-4" /> {d.ui.backToArticles}
        </Link>
      </div>
    </>
  );
}
