"use client";

import { NextStudio } from "next-sanity/studio";

import config from "../../../sanity.config";

/* The client boundary exists for a reason: next-sanity/studio has no
   "use client" of its own at the entry, so importing it (or the config,
   which pulls the whole Sanity runtime) from the server page evaluates
   it under the react-server condition, where createContext does not
   exist and the build dies collecting page data. */
export default function Studio() {
  return <NextStudio config={config} />;
}
