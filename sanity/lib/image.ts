/* v2 exports the type from the package root. The deep
   "@sanity/image-url/lib/types/types" path older scaffolds use no
   longer resolves. */
import createImageUrlBuilder, { type SanityImageSource } from "@sanity/image-url";

import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => builder.image(source);
