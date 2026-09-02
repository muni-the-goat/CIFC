import { type SchemaTypeDefinition } from "sanity";

/* Empty by design — this is the `clean` template. Site copy still lives
   in lib/content.ts and nothing reads from Sanity yet; adding a type
   here is the first step of an actual migration. */
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
};
