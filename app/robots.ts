/**
 * Robots.txt Generation
 * Configures search engine crawler behavior
 */

import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://landingbits.net";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/en", "/de", "/hu", "/blog/", "/login", "/signup"],
        disallow: ["/api/", "/dashboard/", "/(auth)/", "/admin/", "/app/"],
      },
      {
        userAgent: "*",
        disallow: "/", // Disallow root redirect page
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
