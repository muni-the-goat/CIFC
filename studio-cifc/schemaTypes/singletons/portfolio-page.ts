import { defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

export const portfolioPage = defineType({
  name: "portfolioPage",
  title: "Portfolio page",
  type: "document",
  icon: CaseIcon,
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
    defineField({ name: "heroLede", title: "Hero lede", type: "text", rows: 3 }),
  ],
  preview: { prepare: () => ({ title: "Portfolio page" }) },
});
