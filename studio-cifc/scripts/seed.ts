/**
 * Seeds the production dataset from lib/content.ts.
 *
 * Run from studio-cifc with the CLI's own auth:
 *   npx sanity exec scripts/seed.ts --with-user-token
 *
 * Two things worth knowing before editing:
 *
 * 1. It imports ../lib/content directly rather than restating the copy.
 *    That file is still what the site renders, so a transcription here
 *    would drift the moment either side changed.
 *
 * 2. It is re-runnable. Singletons are createOrReplace at fixed IDs.
 *    List documents are matched on a content field (name, question,
 *    title) and patched, never duplicated — Sanity's guidance is to let
 *    it generate _id values rather than deriving them from slugs.
 *    Image uploads dedupe on content hash, so re-running does not pile
 *    up assets.
 */
import { createReadStream } from "node:fs";
import { basename, join } from "node:path";
import { getCliClient } from "sanity/cli";

import {
  faq,
  heritage,
  hero,
  imagery,
  inquiryTypes,
  mission,
  news,
  portfolio,
  principles,
  sectors,
  site,
  stats,
  team,
  whoWeAre,
} from "../../lib/content";

const client = getCliClient({ apiVersion: "2026-01-01" });
const PUBLIC_DIR = join(__dirname, "..", "..", "public");

/* Upload once per file per run. Sanity dedupes on hash server-side, but
   there is no reason to send the same bytes twice. */
const uploads = new Map<string, Promise<string>>();

function uploadImage(src: string): Promise<string> {
  const existing = uploads.get(src);
  if (existing) return existing;

  const file = join(PUBLIC_DIR, src.replace(/^\//, ""));
  const pending = client.assets
    .upload("image", createReadStream(file), { filename: basename(file) })
    .then((asset) => {
      console.log(`  uploaded ${src} -> ${asset._id}`);
      return asset._id;
    });

  uploads.set(src, pending);
  return pending;
}

async function imageField(src: string, alt: string, caption?: string) {
  const _id = await uploadImage(src);
  return {
    _type: "image",
    asset: { _type: "reference", _ref: _id },
    alt,
    ...(caption ? { caption } : {}),
  };
}

async function captioned(src: string, alt: string, caption?: string) {
  return { ...(await imageField(src, alt, caption)), _type: "captionedImage" };
}

/* Match on a content field so re-runs update rather than duplicate. */
async function upsert(
  type: string,
  matchField: string,
  matchValue: string,
  doc: Record<string, unknown>
) {
  const existing = await client.fetch<{ _id: string } | null>(
    `*[_type == $type && ${matchField} == $value][0]{_id}`,
    { type, value: matchValue }
  );

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit();
    console.log(`  patched  ${type}: ${matchValue}`);
    return existing._id;
  }

  const created = await client.create({ _type: type, ...doc });
  console.log(`  created  ${type}: ${matchValue}`);
  return created._id;
}

async function singleton(id: string, doc: Record<string, unknown>) {
  await client.createOrReplace({ _id: id, _type: id, ...doc });
  console.log(`  singleton ${id}`);
}

async function main() {
  console.log(`Seeding ${client.config().dataset} on ${client.config().projectId}\n`);

  console.log("Images");
  const [
    kohPich,
    towerDusk,
    towerNight,
    monument,
    heritageImages,
  ] = await Promise.all([
    captioned(imagery.kohPich.src, imagery.kohPich.alt),
    captioned(imagery.towerDusk.src, imagery.towerDusk.alt),
    captioned(imagery.towerNight.src, imagery.towerNight.alt),
    captioned(imagery.independenceMonument.src, imagery.independenceMonument.alt),
    Promise.all(heritage.map((h) => captioned(h.src, h.alt, h.caption))),
  ]);

  console.log("\nSingletons");
  await singleton("siteSettings", {
    name: site.name,
    tagline: site.tagline,
    url: site.url,
    address: site.address,
    linkedin: site.linkedin,
    inquiryTypes: [...inquiryTypes],
  });

  await singleton("homePage", {
    heroTitleLead: [...hero.titleLead],
    heroTitleTail: [...hero.titleTail],
    heroBody: hero.body,
    whoWeAre,
    whoWeAreImage: kohPich,
  });

  await singleton("aboutPage", {
    heroLead: "Shaping Tomorrow through",
    heroTail: "Responsible Investment",
    heroLede:
      "We partner with visionary entrepreneurs and organizations to create lasting social, environmental, and economic impact. By combining rigorous investment strategies with purpose-driven projects, we turn capital into measurable change, empowering communities and shaping a sustainable future for Cambodia and beyond.",
    whoWeAre,
    whoWeAreImage: towerDusk,
    mission,
    principles: principles.map((p, i) => ({ _type: "principle", _key: `p${i}`, ...p })),
    stats: stats.map((s, i) => ({ _type: "stat", _key: `s${i}`, ...s })),
    statsImage: towerNight,
    heritageHeading: "Rooted in Cambodia",
    heritageLede:
      "Cambodia’s inheritance runs from the temples of Angkor to the Phnom Penh skyline. That continuity is what our investments are built on.",
    heritageImages: heritageImages.map((img, i) => ({ ...img, _key: `h${i}` })),
  });

  await singleton("portfolioPage", {
    heroLead: "Investments that deliver",
    heroTail: "measurable change",
    heroLede:
      "We back scalable solutions across healthcare, sustainable tech, AI, education, biotech and logistics.",
  });

  await singleton("teamPage", {
    heroLead: "Meet the people powering",
    heroTail: "Canadia Impact Fund",
    heroLede:
      "A team of investors, operators, and experts, united by purpose.",
  });

  await singleton("contactPage", {
    heroLead: "Let’s Build",
    heroTail: "Impact Together",
    heroLede:
      "We welcome partnerships, proposals, and conversations that drive meaningful change.",
    image: monument,
  });

  console.log("\nTeam");
  for (const [i, m] of team.entries()) {
    await upsert("teamMember", "name", m.name, {
      name: m.name,
      role: m.role,
      basedIn: m.basedIn,
      portrait: await imageField(m.photo, `Portrait of ${m.name}`),
      order: i,
    });
  }

  console.log("\nPortfolio");
  for (const [i, c] of portfolio.entries()) {
    await upsert("portfolioCompany", "name", c.name, {
      name: c.name,
      sector: c.sector,
      url: c.url,
      logo: await imageField(c.logo, `${c.name} logo`),
      order: i,
    });
  }

  console.log("\nSectors");
  for (const [i, s] of sectors.entries()) {
    await upsert("sector", "name", s.name, {
      name: s.name,
      tagline: s.tagline,
      order: i,
      ...(s.image ? { image: await imageField(s.image, s.alt ?? s.name) } : {}),
    });
  }

  console.log("\nFAQ");
  for (const [i, f] of faq.entries()) {
    await upsert("faqEntry", "question", f.q, {
      question: f.q,
      answer: f.a,
      order: i,
    });
  }

  console.log("\nNews");
  /* The live site never gave these a date. Seeded with a placeholder so
     the required field is satisfied and the ordering is stable; real
     dates should be set in the Studio. */
  for (const [i, n] of news.entries()) {
    await upsert("newsItem", "slug.current", n.slug, {
      title: n.title,
      slug: { _type: "slug", current: n.slug },
      publishedAt: new Date(Date.UTC(2026, 0, 1 + i)).toISOString(),
    });
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
