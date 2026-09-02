import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact page",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "heroLead",
      title: "Hero — first line",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTail",
      title: "Hero — second line",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroLede",
      title: "Hero lede",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "image",
      title: "Photograph beside the form",
      type: "captionedImage",
    }),
  ],
  preview: { prepare: () => ({ title: "Contact page" }) },
});
