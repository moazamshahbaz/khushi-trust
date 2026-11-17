export const locales = ["en", "ur", "ar"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const hasLocale = (l: string): l is Locale =>
  (locales as readonly string[]).includes(l);

export const dirOf = (l: Locale) => (l === "en" ? "ltr" : "rtl");

export const localeLabel: Record<Locale, string> = {
  en: "English",
  ur: "اردو",
  ar: "العربية",
};

/** Prefix a site path with the locale: href("ur", "/programs") -> "/ur/programs" */
export const href = (l: Locale, path = "/") =>
  `/${l}${path === "/" ? "" : path}`;
