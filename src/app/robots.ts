import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lms.ifelseintelligence.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/catalog", "/courses/", "/paths", "/certificates/"],
        disallow: ["/dashboard/", "/learn/", "/studio/", "/admin/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
