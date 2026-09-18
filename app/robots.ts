import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://www.jssinnovative.in";
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/portal", "/login", "/api"] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
