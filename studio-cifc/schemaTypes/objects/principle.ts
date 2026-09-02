import { defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";

/* Nested, not a reference: a principle only means something inside the
   About page's approach section and is never reused elsewhere. */
export const principle = defineType({
  name: "principle",
  title: "Principle",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required().max(240),
    }),
  ],
  preview: { select: { title: "title", subtitle: "body" } },
});
