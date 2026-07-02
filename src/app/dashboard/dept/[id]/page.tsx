"use client";

import { useApp } from "@/contexts/AuthContext";
import { DEPARTMENTS } from "@/lib/data";
import { Criterion, Role } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowLeft,
} from "lucide-react";
import { useEffect } from "react";
import { SectionAccordion } from "@/components/dashboard/SectionAccordion";

function getStats(criteria: Criterion[], dept: Role) {
  const filtered = criteria.filter((c) => c.department === dept);
  const total = filtered.length;
  const completed = filtered.filter((c) => c.status === "Completed").length;
  const inProgress = filtered.filter((c) => c.status === "In Progress").length;
  const pending = filtered.filter((c) => c.status === "Pending").length;
  const blocked = filtered.filter((c) => c.status === "Blocked").length;
  const overdue = filtered.filter(
    (c) => c.status !== "Completed" && c.status !== "Not Applicable" && new Date(c.dueDate) < new Date()
  ).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  return { total, completed, inProgress, pending, blocked, overdue, progress };
}

function groupBySection(criteria: Criterion[]): Record<string, Criterion[]> {
  const groups: Record<string, Criterion[]> = {};
  criteria.forEach((c) => {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  });
  return groups;
}

export default function DeptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, criteria } = useApp();
  const deptId = params.id as Role;
  const dept = DEPARTMENTS.find((d) => d.id === deptId);

  useEffect(() => {
    // Only chairman can view other department pages
    if (user && user.role !== "chairman") {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!user || user.role !== "chairman" || !dept) return null;

  const deptCriteria = criteria.filter((c) => c.department === deptId);
  const stats = getStats(criteria, deptId);
  const sections = groupBySection(deptCriteria);

  return (
    <div className="space-y-6">
      {/* Back button + header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard")}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full" style={{ backgroundColor: dept.color }} />
          <h2 className="text-xl font-bold">{dept.name}</h2>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon={<TrendingUp />} label="Progress" value={`${stats.progress}%`} color="blue" />
        <StatCard icon={<CheckCircle2 />} label="Completed" value={stats.completed.toString()} color="green" />
        <StatCard icon={<Clock />} label="In Progress" value={stats.inProgress.toString()} color="blue" />
        <StatCard icon={<Clock />} label="Pending" value={stats.pending.toString()} color="amber" />
        <StatCard icon={<AlertTriangle />} label="Overdue" value={stats.overdue.toString()} color="red" />
      </div>

      {/* Progress bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">Overall Completion</span>
          <span className="font-bold" style={{ color: dept.color }}>{stats.progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${stats.progress}%`, backgroundColor: dept.color }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Coordinator: {dept.coordinator} • {stats.completed} of {stats.total} criteria completed
        </p>
      </div>

      {/* Criteria list */}
      <div>
        <h3 className="mb-3 text-lg font-semibold">NBA Criteria ({deptCriteria.length} items)</h3>
        <div className="space-y-3">
          {Object.entries(sections).map(([section, items]) => (
            <SectionAccordion
              key={section}
              section={section}
              criteria={items}
              onUpdate={() => {}}
              isChairman={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon, label, value, color,
}: {
  icon: React.ReactNode; label: string; value: string; color: "blue" | "green" | "amber" | "red";
}) {
  const colorMap = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    amber: "bg-amber-500/10 text-amber-500",
    red: "bg-red-500/10 text-red-500",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </div>
  );
}
