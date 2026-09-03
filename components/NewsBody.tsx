import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

/* Renderers for the block types the Studio can produce. Without these,
   an image placed in the body renders as nothing at all — Portable Text
   has no default for custom types.

   Body images deliberately sit at the text column's width, not the
   cover's. One image leads the article; the rest support the reading. */
const components: PortableTextComponents = {
  types: {
    captionedImage: ({ value }) => {
      const url: string | undefined = value?.url;
      if (!url) return null;
      return (
        <figure className="prose__figure">
          <Image
            src={url}
            alt={value.alt ?? ""}
            width={1400}
            height={933}
            sizes="(max-width: 800px) 100vw, 700px"
            className="prose__img"
            placeholder={value.lqip ? "blur" : "empty"}
            blurDataURL={value.lqip ?? undefined}
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

export default function NewsBody({ value }: { value: unknown[] }) {
  return (
    <div className="prose">
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <PortableText value={value as any} components={components} />
    </div>
  );
}
