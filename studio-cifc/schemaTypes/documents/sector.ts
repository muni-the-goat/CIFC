import { defineField, defineType } from "sanity";
import { TagIcon } from "@sanity/icons/Tag";

/* A document rather than a nested object: sectors appear on both the
   home page grid and the portfolio gallery, and the two had already
   drifted apart once when they were separate copies. */
export const sector = defineType({
  name: "sector",
  title: "Sector",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      type: "string",
      validation: (rule) => rule.required().max(80),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  orderings: [
    {
      title: "Site order",
      name: "siteOrder",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "name", subtitle: "tagline", media: "image" } },
});
