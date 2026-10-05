import type { Block } from "@/lib/types";
import { mediaUrl } from "@/lib/strapi";

function Markdown({ text }: { text: string }) {
  const lines = text.split(/\n+/);

  return (
    <div className="space-y-4 text-[1.05rem] leading-8 text-cyan-50/85">
      {lines.map((line, i) => {
        const heading = line.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
          const Tag = (`h${heading[1].length + 1}` as "h2" | "h3" | "h4");
          return (
            <Tag
              key={i}
              className="font-[family-name:var(--font-display)] text-cyan-50"
            >
              {heading[2]}
            </Tag>
          );
        }
        return <p key={i}>{line}</p>;
      })}
    </div>
  );
}

export function Blocks({ blocks }: { blocks?: Block[] | null }) {
  if (!blocks?.length) {
    return null;
  }

  return (
    <div className="mt-10 space-y-10">
      {blocks.map((block, index) => {
        const key = `${block.__component}-${block.id ?? index}`;

        if (block.__component === "shared.rich-text" && block.body) {
          return <Markdown key={key} text={block.body} />;
        }

        if (block.__component === "shared.quote") {
          return (
            <blockquote
              key={key}
              className="border-l-2 border-cyan-300/70 pl-5 text-lg italic text-cyan-100/80"
            >
              {block.title ? (
                <p className="mb-2 not-italic text-xs uppercase tracking-[0.2em] text-cyan-300">
                  {block.title}
                </p>
              ) : null}
              <p>{block.body}</p>
            </blockquote>
          );
        }

        if (block.__component === "shared.media") {
          const src = mediaUrl(block.file);
          if (!src) return null;
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={key}
              src={src}
              alt={block.file?.alternativeText || ""}
              className="w-full rounded-xl"
            />
          );
        }

        if (block.__component === "shared.slider" && block.files?.length) {
          return (
            <div key={key} className="grid gap-3 sm:grid-cols-2">
              {block.files.map((file, i) => {
                const src = mediaUrl(file);
                if (!src) return null;
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={file.alternativeText || ""}
                    className="w-full rounded-xl"
                  />
                );
              })}
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
