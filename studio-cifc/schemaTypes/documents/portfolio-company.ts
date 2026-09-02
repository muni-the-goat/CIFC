import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

export const portfolioCompany = defineType({
  name: "portfolioCompany",
  title: "Portfolio company",
  type: "document",
  icon: CaseIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sector",
      type: "string",
      description: 'What the company does, e.g. "Logistics".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    /* No width/height fields. The old data carried logoW/logoH so the
       grid could normalise wildly different aspect ratios on height;
       Sanity already stores real dimensions in the asset's metadata, so
       duplicating them here would be a second source of truth. */
    defineField({
      name: "logo",
      type: "image",
      options: { hotspot: false },
      fields: [
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
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
  preview: { select: { title: "name", subtitle: "sector", media: "logo" } },
});
