import * as React from "react";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Role } from "@generated/prisma/client";
import {
  toggleCourseApprovalAction,
  changeUserRoleAction,
  publishAnnouncementAction,
} from "@/features/admin/actions";
import {
  Shield,
  Users,
  BookOpen,
  Award,
  TrendingUp,
  CheckCircle,
  XCircle,
  Bell,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export const metadata = {
  title: "Admin Console & Analytics | IF/ELSE Intelligence LMS",
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== Role.ADMIN) {
    redirect("/dashboard?error=unauthorized_admin");
  }

  // Fetch Analytics & Entities
  const [
    totalUsers,
    allUsers,
    allCourses,
    totalEnrollments,
    completedEnrollments,
    totalCertificates,
  ] = await Promise.all([
    db.user.count(),
    db.user.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        streakCount: true,
        createdAt: true,
      },
    }),
    db.course.findMany({
      include: {
        instructor: { select: { name: true } },
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.enrollment.count(),
    db.enrollment.count({ where: { status: "COMPLETED" } }),
    db.certificate.count(),
  ]);

  const completionRate =
    totalEnrollments > 0
      ? Math.round((completedEnrollments / totalEnrollments) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-10">
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-wider font-semibold">
              <Shield className="w-3.5 h-3.5" />
              <span>PLATFORM GOVERNANCE // ADMIN CONSOLE</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Executive Administration & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Monitor platform metrics, approve curriculum releases, manage roles, and broadcast announcements.
            </p>
          </div>
        </div>

        {/* Real-time Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 font-mono">
          <div className="glass-card p-5 rounded-xl border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase">Total Users</span>
              <Users className="w-4 h-4 text-brand-blue" />
            </div>
            <div className="text-3xl font-bold text-foreground">{totalUsers}</div>
            <div className="text-[10px] text-emerald-400">● Real-time sync</div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase">Course Enrollments</span>
              <BookOpen className="w-4 h-4 text-brand-blue-light" />
            </div>
            <div className="text-3xl font-bold text-foreground">{totalEnrollments}</div>
            <div className="text-[10px] text-muted-foreground">Across all programs</div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase">Completion Rate</span>
              <TrendingUp className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-foreground">{completionRate}%</div>
            <div className="text-[10px] text-emerald-400">
              {completedEnrollments} completed courses
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-border/80 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-[11px] uppercase">Issued Certs</span>
              <Award className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-foreground">{totalCertificates}</div>
            <div className="text-[10px] text-muted-foreground">Verifiable credentials</div>
          </div>
        </div>

        {/* Course Approval Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">
              Course Approval & Governance
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              {allCourses.length} Courses Total
            </span>
          </div>

          <div className="glass-card rounded-2xl border border-border/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-border/60 bg-secondary/30 text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Course Title</th>
                    <th className="p-4">Instructor</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Level</th>
                    <th className="p-4">Enrollments</th>
                    <th className="p-4">Approval Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {allCourses.map((c) => (
                    <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-sans font-semibold text-foreground max-w-xs truncate">
                        {c.title}
                      </td>
                      <td className="p-4 text-muted-foreground">{c.instructor.name}</td>
                      <td className="p-4">
                        <Badge variant="logic" className="text-[9px]">
                          {c.category}
                        </Badge>
                      </td>
                      <td className="p-4 text-muted-foreground">{c.level}</td>
                      <td className="p-4">{c._count.enrollments}</td>
                      <td className="p-4">
                        {c.approved ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            Approved
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center gap-1 font-bold">
                            <XCircle className="w-3.5 h-3.5" />
                            Pending Review
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <form action={toggleCourseApprovalAction.bind(null, c.id)}>
                          <Button
                            type="submit"
                            variant={c.approved ? "outline" : "electric"}
                            size="sm"
                            className="h-7 text-[10px] font-mono"
                          >
                            {c.approved ? "Revoke" : "Approve Course"}
                          </Button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* User & Role Management */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-bold text-foreground">
              User & Role Management
            </h2>
            <span className="font-mono text-xs text-muted-foreground">
              Showing {allUsers.length} recent accounts
            </span>
          </div>

          <div className="glass-card rounded-2xl border border-border/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-border/60 bg-secondary/30 text-muted-foreground uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Streak</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right">Change Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {allUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="p-4 font-sans font-semibold text-foreground">
                        {u.name || "N/A"}
                      </td>
                      <td className="p-4 text-muted-foreground">{u.email}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            u.role === "ADMIN"
                              ? "amber"
                              : u.role === "INSTRUCTOR"
                              ? "emerald"
                              : "logic"
                          }
                          className="text-[9px]"
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="p-4">{u.streakCount}d</td>
                      <td className="p-4 text-muted-foreground">{formatDate(u.createdAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role !== "STUDENT" && (
                            <form action={changeUserRoleAction.bind(null, u.id, Role.STUDENT)}>
                              <button
                                type="submit"
                                className="px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-[10px] text-muted-foreground cursor-pointer"
                              >
                                Set Student
                              </button>
                            </form>
                          )}
                          {u.role !== "INSTRUCTOR" && (
                            <form action={changeUserRoleAction.bind(null, u.id, Role.INSTRUCTOR)}>
                              <button
                                type="submit"
                                className="px-2 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-[10px] cursor-pointer"
                              >
                                Set Instructor
                              </button>
                            </form>
                          )}
                          {u.role !== "ADMIN" && (
                            <form action={changeUserRoleAction.bind(null, u.id, Role.ADMIN)}>
                              <button
                                type="submit"
                                className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-[10px] cursor-pointer"
                              >
                                Set Admin
                              </button>
                            </form>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Global Announcement Publisher */}
        <div className="space-y-4">
          <h2 className="font-display text-xl font-bold text-foreground">
            Broadcast Lab Announcement
          </h2>

          <Card glass className="border-border/80 p-6">
            <form
              action={async (formData: FormData) => {
                "use server";
                const title = formData.get("title") as string;
                const content = formData.get("content") as string;
                const courseId = formData.get("courseId") as string;
                await publishAnnouncementAction(title, content, courseId);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-mono font-semibold">ANNOUNCEMENT TITLE</label>
                  <Input
                    name="title"
                    placeholder="e.g. System Update: New Evaluation Benchmarks Added"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-mono font-semibold">AUDIENCE TARGET</label>
                  <select
                    name="courseId"
                    className="w-full h-10 px-3 rounded-lg border border-border bg-background text-xs font-mono text-foreground"
                  >
                    <option value="global">All Platform Users (Global)</option>
                    {allCourses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono font-semibold">ANNOUNCEMENT MESSAGE</label>
                <Textarea
                  name="content"
                  placeholder="Draft your announcement to students and engineering fellows..."
                  className="h-24"
                  required
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" variant="electric" size="sm" className="font-mono text-xs">
                  <Bell className="w-3.5 h-3.5 mr-1.5" />
                  <span>Broadcast Announcement</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
