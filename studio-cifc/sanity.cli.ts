import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "4eid4gr5",
    dataset: "production",
  },
  /* Studio auto-updates: standalone Studios pull bugfixes without a
     dependency bump or a redeploy. This is one of the things embedding
     the Studio in Next ruled out. Nested under `deployment` — the
     top-level `autoUpdates` key is deprecated. */
  deployment: {
    autoUpdates: true,
    /* Hosting for the Studio, free from Sanity, at
       <studioHost>.sanity.studio. Set here so `sanity deploy` is one
       non-interactive command rather than a hostname prompt. Hostnames
       are globally unique across Sanity — if this one is taken the
       deploy says so, and changing this line is the whole fix. */
    studioHost: "canadia-impact-fund",
  },
});
