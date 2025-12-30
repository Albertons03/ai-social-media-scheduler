/**
 * Robots.txt Generation
 * Configures search engine crawler behavior
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://landingbits.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/(auth)/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
