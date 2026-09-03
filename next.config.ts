import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    /* Sanity serves assets from its own CDN, and next/image refuses any
       remote host that is not declared. Scoped to this project's asset
       path rather than the whole domain. */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/4eid4gr5/**",
      },
    ],
  },
};

export default nextConfig;
