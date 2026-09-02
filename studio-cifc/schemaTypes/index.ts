import type { SchemaTypeDefinition } from "sanity";

import { captionedImage } from "./objects/captioned-image";
import { principle } from "./objects/principle";
import { stat } from "./objects/stat";

import { faqEntry } from "./documents/faq-entry";
import { newsItem } from "./documents/news-item";
import { portfolioCompany } from "./documents/portfolio-company";
import { sector } from "./documents/sector";
import { teamMember } from "./documents/team-member";

import { aboutPage } from "./singletons/about-page";
import { contactPage } from "./singletons/contact-page";
import { homePage } from "./singletons/home-page";
import { portfolioPage } from "./singletons/portfolio-page";
import { siteSettings } from "./singletons/site-settings";
import { teamPage } from "./singletons/team-page";

/* Singletons are ordinary document types; what makes them singular is
   the Structure definition in structure.ts, which pins each to a fixed
   document ID and hides the "create new" affordance. */
export const singletonTypes = [
  "siteSettings",
  "homePage",
  "aboutPage",
  "portfolioPage",
  "teamPage",
  "contactPage",
] as const;

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  captionedImage,
  principle,
  stat,
  // Documents
  teamMember,
  portfolioCompany,
  sector,
  faqEntry,
  newsItem,
  // Singletons
  siteSettings,
  homePage,
  aboutPage,
  portfolioPage,
  teamPage,
  contactPage,
];
