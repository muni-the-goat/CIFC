import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { schemaTypes, singletonTypes } from "./schemaTypes";
import { structure } from "./structure";

const singletons = new Set<string>(singletonTypes);

export default defineConfig({
  name: "cifc",
  title: "Canadia Impact Fund",

  projectId: "4eid4gr5",
  dataset: "production",

  plugins: [structureTool({ structure }), visionTool()],

  schema: {
    types: schemaTypes,
    /* Keep singletons out of the global "create" menu. Structure hides
       them from the list; this closes the other door in. */
    templates: (prev) => prev.filter((t) => !singletons.has(t.schemaType)),
  },

  document: {
    /* And remove duplicate/delete from the singleton documents
       themselves, so there is exactly one of each, always. */
    actions: (prev, { schemaType }) =>
      singletons.has(schemaType)
        ? prev.filter(
            ({ action }) =>
              action && ["publish", "discardChanges", "restore"].includes(action)
          )
        : prev,
  },
});
