import { defineField, defineType } from "sanity";
import { UserIcon } from "@sanity/icons/User";

export const teamMember = defineType({
  name: "teamMember",
  title: "Team member",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({
      name: "name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "basedIn",
      title: "Based in",
      type: "string",
      initialValue: "Phnom Penh, Cambodia",
    }),
    defineField({
      name: "portrait",
      type: "image",
      options: { hotspot: true },
      description:
        "Cropped to 2:3 on the site. The hotspot decides what survives.",
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
    /* Explicit, because the running order is editorial — leadership
       first — and neither name nor date reproduces it. */
    defineField({
      name: "order",
      title: "Sort order",
      type: "number",
      description: "Lowest first.",
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
  preview: {
    select: { title: "name", subtitle: "role", media: "portrait" },
  },
});
