import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // IMPORTANT: Remove trailing slash if it exists
  const baseUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "https://itechsolution.vercel.app").replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api", "/login", "/register"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
