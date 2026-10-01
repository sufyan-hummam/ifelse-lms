import { db } from "@/lib/db";
import { Level, Prisma } from "@generated/prisma/client";

export async function getPublishedCourses(filter?: {
  category?: string;
  level?: Level;
  search?: string;
}) {
  const where: Prisma.CourseWhereInput = {
    published: true,
    approved: true,
  };

  if (filter?.category && filter.category !== "all") {
    where.category = {
      contains: filter.category,
      mode: "insensitive",
    };
  }

  if (filter?.level) {
    where.level = filter.level;
  }

  if (filter?.search && filter.search.trim() !== "") {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { shortDescription: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
      { category: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  return await db.course.findMany({
    where,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          headline: true,
          image: true,
        },
      },
      modules: {
        include: {
          lessons: {
            select: {
              id: true,
              title: true,
              durationMinutes: true,
              contentType: true,
              isFreePreview: true,
            },
          },
        },
        orderBy: { order: "asc" },
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCourseBySlug(slug: string) {
  return await db.course.findUnique({
    where: { slug },
    include: {
      instructor: true,
      modules: {
        orderBy: { order: "asc" },
        include: {
          lessons: {
            orderBy: { order: "asc" },
          },
        },
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
              headline: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
  });
}

export async function getFeaturedCourses() {
  return await db.course.findMany({
    where: { published: true, approved: true },
    take: 3,
    include: {
      instructor: {
        select: {
          name: true,
          headline: true,
          image: true,
        },
      },
      modules: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function getLearningPaths() {
  return await db.learningPath.findMany({
    where: { published: true },
    include: {
      courses: {
        orderBy: { order: "asc" },
        include: {
          course: {
            include: {
              instructor: {
                select: { name: true, headline: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}
