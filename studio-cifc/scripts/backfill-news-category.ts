/**
 * One-off: sets `category` on news items created before that field
 * existed. `initialValue` only applies to newly created documents, so
 * without this the existing three are invalid in the Studio and render
 * no category chip on the site.
 *
 *   npx sanity exec scripts/backfill-news-category.ts --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2026-01-01" });

async function main() {
  const missing = await client.fetch<{ _id: string; title: string }[]>(
    `*[_type == "newsItem" && !defined(category)]{_id, title}`
  );

  if (!missing.length) {
    console.log("Nothing to backfill.");
    return;
  }

  for (const doc of missing) {
    await client.patch(doc._id).set({ category: "press-release" }).commit();
    console.log(`  press-release -> ${doc.title.slice(0, 60)}`);
  }
  console.log(`\nBackfilled ${missing.length}. Change any of them in the Studio.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
