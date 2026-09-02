import { defineField, defineType } from "sanity";
import { TrendUpwardIcon } from "@sanity/icons/TrendUpward";

/* `value` is a string, not a number, on purpose: the figures are
   "17,500+" and "USD 15BN". Splitting them into amount/prefix/suffix
   would model the presentation, and the site's count-up already parses
   the display string it is given. */
export const stat = defineType({
  name: "stat",
  title: "Statistic",
  type: "object",
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: "value",
      type: "string",
      description: 'As it should read, e.g. "17,500+" or "USD 15BN".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: { select: { title: "value", subtitle: "label" } },
});
