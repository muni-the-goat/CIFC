import { defineArrayMember, defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons/Cog";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "tagline", type: "string" }),
    /* Two unresolved conflicts carried over from lib/content.ts, both
       flagged for the client: the guideline prints
       canadiaimpactfund.com while the live site is canadiaimpact.com,
       and the guideline gives a Diamond Island address that does not
       match the Ang Doung Street one in use. */
    defineField({
      name: "url",
      title: "Canonical URL",
      type: "url",
      validation: (rule) => rule.required().uri({ scheme: ["https"] }),
    }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "address", type: "text", rows: 3 }),
    defineField({
      name: "linkedin",
      title: "LinkedIn URL",
      type: "url",
    }),
    defineField({
      name: "inquiryTypes",
      title: "Contact form inquiry types",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
  ],
  preview: { select: { title: "name", subtitle: "url" } },
});
