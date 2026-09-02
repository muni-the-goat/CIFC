import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  /* CDN for reads. Turn this off in any context that must see a draft
     or a just-published change immediately. */
  useCdn: true,
});
