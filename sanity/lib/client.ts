import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "../env";

/* @sanity/client, not next-sanity.

   next-sanity declares `sanity` as a peer, so npm installed the whole
   Studio package — and its CLI — into the app. That put a second,
   older `sanity` binary on the path ahead of studio-cifc's, which is
   how `npx sanity` in the repo root ended up reporting runtime 4.22.1
   and offering to downgrade the Studio's packages to match.

   Nothing here needs it. next-sanity earns its place when a project
   wants defineLive and Visual Editing; this is a static marketing site
   where Sanity's own guidance is time-based revalidation instead. */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  /* No token. The dataset is public-read, so the site fetches
     anonymously and drafts are invisible to it by construction. */
  perspective: "published",
  /* CDN for reads. Turn this off in any context that must see a draft
     or a just-published change immediately. */
  useCdn: true,
});
