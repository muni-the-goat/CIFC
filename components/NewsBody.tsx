import Image from "next/image";
import { PortableText, type PortableTextComponents } from "@portabletext/react";

import { urlFor } from "@/sanity/lib/image";

/* Renderers for the block types the Studio can produce. Without these,
   an image dropped into the body renders as nothing at all — Portable
   Text has no default for custom types. */
const components: PortableTextComponents = {
  types: {
    image: ({ value }) =>
      value?.asset ? (
        <figure className="prose__figure">
          <Image
            src={urlFor(value).width(1400).fit("max").url()}
            alt={value.alt ?? ""}
            width={1400}
            height={Math.round(1400 / 1.5)}
            sizes="(max-width: 760px) 100vw, 70ch"
            className="prose__img"
          />
          {value.caption && <figcaption>{value.caption}</figcaption>}
        </figure>
      ) : null,
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
