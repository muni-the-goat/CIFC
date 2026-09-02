import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons/Users";

export const teamPage = defineType({
  name: "teamPage",
  title: "Team page",
  type: "document",
  icon: UsersIcon,
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
  preview: { prepare: () => ({ title: "Team page" }) },
});
