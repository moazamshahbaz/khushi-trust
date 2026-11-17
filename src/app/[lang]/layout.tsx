import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Amiri, Cormorant_Garamond, Noto_Naskh_Arabic, Noto_Nastaliq_Urdu, Source_Sans_3 } from "next/font/google";
import "../globals.css";
import { dirOf, hasLocale, locales } from "@/lib/i18n";
import { getDict } from "@/lib/content";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SmoothScroll } from "@/components/motion";
import { ArchDefs } from "@/components/ornament";
import WhatsAppFab from "@/components/WhatsAppFab";

const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-cormorant" });
const source = Source_Sans_3({ subsets: ["latin"], variable: "--font-source" });
const amiri = Amiri({ subsets: ["arabic", "latin"], weight: ["400", "700"], variable: "--font-amiri" });
const naskh = Noto_Naskh_Arabic({ subsets: ["arabic"], weight: ["400", "600"], variable: "--font-naskh" });
const nastaliq = Noto_Nastaliq_Urdu({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-nastaliq" });

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const d = await getDict(lang);
  return {
    metadataBase: new URL("https://thekhushitrust.org"),
    title: { default: `${d.site.name} | ${d.site.tagline}`, template: `%s | ${d.site.name}` },
    description: d.site.description,
    icons: { icon: "/images/logo.png" },
    alternates: { languages: { en: "/en", ur: "/ur", ar: "/ar" } },
    openGraph: { title: d.site.name, description: d.site.description, images: ["/images/gen/hero.jpg"], locale: lang },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const d = await getDict(lang);
  const fonts = [cormorant, source, amiri, naskh, nastaliq].map((f) => f.variable).join(" ");
  return (
    <html lang={lang} dir={dirOf(lang)} className={fonts}>
      <body className="min-h-screen bg-ivory">
        <ArchDefs />
        <SmoothScroll />
        <Header lang={lang} d={d} />
        <main>{children}</main>
        <Footer lang={lang} d={d} />
        <WhatsAppFab url={d.site.contact.whatsappCtaUrl} label={d.ui.whatsappCta} />
      </body>
    </html>
  );
}
