import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons/Home";

export const homePage = defineType({
  name: "homePage",
  title: "Home page",
  type: "document",
  icon: HomeIcon,
  fields: [
    /* Two arrays rather than one headline string. The hero splits the
       title across the viewport, lead left and tail right, and each
       line break is deliberate — the site never lets the break depend
       on wrapping. One line per array item. */
    defineField({
      name: "heroTitleLead",
      title: "Hero title — lead (left)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "heroTitleTail",
      title: "Hero title — tail (right)",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "heroBody",
      title: "Hero body",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whoWeAre",
      title: "Who we are",
      type: "text",
      rows: 6,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "whoWeAreImage",
      title: "Who we are — background",
      type: "captionedImage",
    }),
  ],
  preview: { prepare: () => ({ title: "Home page" }) },
});
