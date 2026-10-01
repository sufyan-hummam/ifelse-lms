import { db } from "@/lib/db";

export async function getStudentDashboardData(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      streakCount: true,
      headline: true,
      image: true,
    },
  });

  const enrollments = await db.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          instructor: {
            select: { name: true, image: true },
          },
          modules: {
            orderBy: { order: "asc" },
            include: {
              lessons: {
                orderBy: { order: "asc" },
                include: {
                  progress: {
                    where: { userId },
                  },
                },
              },
            },
          },
        },
      },
    },
    orderBy: { enrolledAt: "desc" },
  });

  const certificates = await db.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          title: true,
          slug: true,
          instructor: { select: { name: true } },
        },
      },
    },
    orderBy: { issueDate: "desc" },
  });

  const bookmarkedLessons = await db.lessonProgress.findMany({
    where: {
      userId,
      isBookmarked: true,
    },
    include: {
      lesson: {
        include: {
          module: {
            include: {
              course: {
                select: { title: true, slug: true },
              },
            },
          },
        },
      },
    },
  });

  const announcements = await db.announcement.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      author: {
        select: { name: true, role: true },
      },
      course: {
        select: { title: true, slug: true },
      },
    },
  });

  // Recommended courses (courses user is not yet enrolled in)
  const enrolledCourseIds = enrollments.map((e) => e.courseId);
  const recommendedCourses = await db.course.findMany({
    where: {
      id: { notIn: enrolledCourseIds },
      published: true,
      approved: true,
    },
    take: 3,
    include: {
      instructor: { select: { name: true } },
      modules: {
        include: { lessons: { select: { id: true } } },
      },
    },
  });

  return {
    user,
    enrollments,
    certificates,
    bookmarkedLessons,
    announcements,
    recommendedCourses,
  };
}
