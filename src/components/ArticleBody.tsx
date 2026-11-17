import { ArchImage, Reveal } from "./motion";
import { StarGlyph } from "./ornament";

type Block = { type: string; text?: string; items?: string[] };

/**
 * Long-form reading layout for articles and the biography.
 * `images` are set as wide photographs between chapters (before every second heading after the first),
 * so a long text never runs as one unbroken column.
 */
export default function ArticleBody({ body, images = [] }: { body: Block[]; images?: string[] }) {
  // 1-based number of each heading, by block index
  const headingNo = body.map((_, i) => body.slice(0, i + 1).filter((x) => x.type === "h2").length);
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
      {body.map((b, i) => {
        if (b.type === "h2") {
          const heading = headingNo[i];
          const img = heading > 1 && heading % 2 === 0 ? images[heading / 2 - 1] : undefined;
          return (
            <div key={i}>
              {img && (
                <Reveal className="-mx-4 my-16 sm:-mx-16 lg:-mx-32">
                  <div className="overflow-hidden rounded-[2rem]">
                    <ArchImage src={img} alt="" className="aspect-[16/9] w-full [clip-path:none]" />
                  </div>
                </Reveal>
              )}
              <Reveal>
                <h2 className={`font-display text-3xl text-kashi-950 sm:text-4xl ${i === 0 ? "mt-3" : img ? "" : "mt-16"}`}>{b.text}</h2>
              </Reveal>
            </div>
          );
        }
        if (b.type === "quote")
          return (
            <Reveal key={i}>
              <blockquote className="font-display my-12 rounded-e-3xl border-s-4 border-brick bg-plaster/70 py-8 ps-8 pe-6 text-2xl leading-relaxed text-kashi-800 sm:text-3xl">{b.text}</blockquote>
            </Reveal>
          );
        if (b.type === "list")
          return (
            <ul key={i} className="mt-6 space-y-3">
              {b.items?.map((it, j) => (
                <li key={j} className="flex gap-3 text-lg text-ink/85">
                  <StarGlyph filled className="star-bullet h-3 w-3 shrink-0 text-brick" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
          );
        return <p key={i} className="mt-6 text-lg leading-[1.9] text-ink/85">{b.text}</p>;
      })}
    </div>
  );
}
