import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://lms.ifelseintelligence.com";

  const courses = await db.course.findMany({
    where: { published: true, approved: true },
    select: { slug: true, updatedAt: true },
  });

  const paths = await db.learningPath.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes = [
    "",
    "/catalog",
    "/paths",
    "/terms",
    "/privacy",
    "/auth/signin",
    "/auth/register",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const courseRoutes = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const pathRoutes = paths.map((path) => ({
    url: `${baseUrl}/paths`,
    lastModified: path.updatedAt,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...courseRoutes, ...pathRoutes];
}
