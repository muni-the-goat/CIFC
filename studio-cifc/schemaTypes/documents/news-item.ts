import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentTextIcon } from "@sanity/icons/DocumentText";

/* The live site had three of these written but the section was
   display:none, /news 404'd, and every "Learn More" pointed at "#".
   Body and slug are here so the stories can become real pages rather
   than headlines with nowhere to go. */
export const newsItem = defineType({
  name: "newsItem",
  title: "News item",
  type: "document",
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    /* A list, not a boolean — there are three kinds today and the
       newsroom will grow more. Radio layout keeps all options visible
       so an editor sees the taxonomy rather than discovering it. */
    defineField({
      name: "category",
      type: "string",
      options: {
        list: [
          { title: "Press Release", value: "press-release" },
          { title: "Story", value: "story" },
          { title: "CSR", value: "csr" },
        ],
        layout: "radio",
      },
      initialValue: "press-release",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    /* The standfirst under the headline. Apple's newsroom runs one on
       every release and it is the only summary the article has. */
    defineField({
      name: "excerpt",
      title: "Standfirst",
      type: "text",
      rows: 3,
      description: "One or two sentences under the headline.",
      validation: (rule) => rule.max(300),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
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
      name: "body",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        /* Images inline in the body. Without this member the Studio
           offers no way to place one mid-article. */
        defineArrayMember({ type: "captionedImage" }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Newest first",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      publishedAt: "publishedAt",
      media: "coverImage",
    },
    prepare: ({ title, category, publishedAt, media }) => ({
      title,
      subtitle: [category, publishedAt?.slice(0, 10)].filter(Boolean).join(" · "),
      media,
    }),
  },
});
