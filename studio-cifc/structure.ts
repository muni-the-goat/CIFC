import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { HomeIcon } from "@sanity/icons/Home";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { CaseIcon } from "@sanity/icons/Case";
import { UsersIcon } from "@sanity/icons/Users";
import { EnvelopeIcon } from "@sanity/icons/Envelope";

/* Pages are singletons: one document each, at a fixed ID, with no
   "create new". Everything else is a normal list. Without this the
   Studio would happily let someone make a second About page and the
   site would silently pick one. */
const singleton = (
  id: string,
  type: string,
  title: string,
  icon: React.ComponentType
) => ({ id, type, title, icon });

const singletons = [
  singleton("siteSettings", "siteSettings", "Site settings", CogIcon),
  singleton("homePage", "homePage", "Home page", HomeIcon),
  singleton("aboutPage", "aboutPage", "About page", InfoOutlineIcon),
  singleton("portfolioPage", "portfolioPage", "Portfolio page", CaseIcon),
  singleton("teamPage", "teamPage", "Team page", UsersIcon),
  singleton("contactPage", "contactPage", "Contact page", EnvelopeIcon),
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      ...singletons.map((s) =>
        S.listItem()
          .title(s.title)
          .icon(s.icon)
          .id(s.id)
          .child(S.document().schemaType(s.type).documentId(s.id).title(s.title))
      ),
      S.divider(),
      S.documentTypeListItem("teamMember").title("Team"),
      S.documentTypeListItem("portfolioCompany").title("Portfolio companies"),
      S.documentTypeListItem("sector").title("Sectors"),
      S.documentTypeListItem("faqEntry").title("FAQs"),
      S.documentTypeListItem("newsItem").title("News"),
    ]);
