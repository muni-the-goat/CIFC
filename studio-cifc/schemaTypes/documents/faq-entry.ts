import { defineField, defineType } from "sanity";
import { HelpCircleIcon } from "@sanity/icons/HelpCircle";

export const faqEntry = defineType({
  name: "faqEntry",
  title: "FAQ",
  type: "document",
  icon: HelpCircleIcon,
  fields: [
    defineField({
      name: "question",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      type: "text",
      rows: 4,
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
  preview: { select: { title: "question", subtitle: "answer" } },
});
