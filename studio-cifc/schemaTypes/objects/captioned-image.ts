import { defineField, defineType } from "sanity";
import { ImageIcon } from "@sanity/icons/Image";

/* Alt is required and separate from caption. The live site shipped
   template alt text on an investment site, or none at all; making it a
   required field is the fix that survives an editor in a hurry. */
export const captionedImage = defineType({
  name: "captionedImage",
  title: "Image",
  type: "image",
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alternative text",
      type: "string",
      description: "Describe what is in the frame, for screen readers.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "caption",
      type: "string",
      description: "Shown under the image. Optional.",
    }),
  ],
});
