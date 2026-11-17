import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { getDict, IMG } from "@/lib/content";
import { DonateBand, PageHero } from "@/components/blocks";
import { ArchImage, Reveal } from "@/components/motion";
import ArticleBody from "@/components/ArticleBody";

export async function generateMetadata({ params }: PageProps<"/[lang]/qari-khushi">) {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return { title: (await getDict(lang)).pages.qariKhushi.title };
}

export default async function QariKhushi({ params }: PageProps<"/[lang]/qari-khushi">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const p = d.pages.qariKhushi;
  const art = d.articles.find((a) => a.slug === p.bodyArticleSlug) ?? d.articles[0];
  return (
    <>
      <PageHero
        eyebrow={d.site.name}
        title={p.title}
        subtitle={p.subtitle || undefined}
        image={IMG.mosque}
        portrait={IMG.founder}
        portraitAlt={d.site.founderDisplayName}
      />
      {/* On small screens the portrait stands at the head of the text instead of in the hero */}
      <Reveal className="relative mx-auto mt-16 w-60 lg:hidden">
        <div className="absolute -inset-3 rounded-t-full border border-brick/40" />
        <ArchImage src={IMG.founder} alt={d.site.founderDisplayName} className="aspect-[4/5] w-full" />
      </Reveal>
      <ArticleBody body={art.body as never} images={[IMG.mosque, IMG.hero, IMG.community]} />
      <DonateBand lang={lang} title={d.home.cta.title} body={d.home.cta.body} donate={d.ui.donateNow} volunteer={d.ui.volunteer} />
    </>
  );
}
