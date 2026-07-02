"use client";

import { useApp } from "@/contexts/AuthContext";
import { DEPARTMENTS } from "@/lib/data";
import { Role, Criterion, Status, HistoryEntry } from "@/lib/types";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell,
  PieChart, Pie, CartesianGrid, Legend
} from "recharts";
import {
  CheckCircle2, Clock, AlertTriangle, TrendingUp, ChevronRight, Activity,
} from "lucide-react";
import { SectionAccordion } from "@/components/dashboard/SectionAccordion";

// ── Helpers ──
function getStats(criteria: Criterion[], dept?: Role) {
  const filtered = dept ? criteria.filter((c) => c.department === dept) : criteria;
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

// ── Stat Card ──
function StatCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string;
  color: "blue" | "green" | "amber" | "red";
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
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colorMap[color]}`}>
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



// ══════════════════════════════════════════════════════
// CHAIRMAN DASHBOARD
// ══════════════════════════════════════════════════════
function ChairmanDashboard({ criteria, activityLog }: { criteria: Criterion[]; activityLog: HistoryEntry[] }) {
  const overall = getStats(criteria);

  const barData = DEPARTMENTS.map((d) => {
    const s = getStats(criteria, d.id);
    return { name: d.shortName, progress: s.progress, color: d.color };
  });

  const pieData = [
    { name: "Completed", value: overall.completed, color: "#22c55e" },
    { name: "In Progress", value: overall.inProgress, color: "#3b82f6" },
    { name: "Pending", value: overall.pending, color: "#f59e0b" },
    { name: "Blocked", value: overall.blocked, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Overall Progress" value={`${overall.progress}%`} color="blue" />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Completed" value={`${overall.completed}/${overall.total}`} color="green" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Pending" value={overall.pending.toString()} color="amber" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Overdue" value={overall.overdue.toString()} color="red" />
      </div>

      {/* Department Cards */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">Department Progress</h2>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {DEPARTMENTS.map((dept) => {
            const s = getStats(criteria, dept.id);
            return (
              <Link
                key={dept.id}
                href={`/dashboard/dept/${dept.id}`}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: dept.color }} />
                    <span className="font-semibold">{dept.shortName}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
                <p className="text-xs text-muted-foreground">{dept.name}</p>
                <p className="text-xs text-muted-foreground">Coordinator: {dept.coordinator}</p>
                <div className="mt-3">
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-bold">{s.progress}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${s.progress}%`, backgroundColor: dept.color }}
                    />
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1 text-[11px]">
                  <span className="text-green-500">{s.completed} done</span>
                  <span className="text-amber-500">{s.pending} pending</span>
                  <span className="text-blue-500">{s.inProgress} active</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold">Department-wise Completion %</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                <defs>
                  {barData.map((entry, index) => (
                    <linearGradient key={`gradient-${index}`} id={`colorUv-${index}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={entry.color} stopOpacity={0.8}/>
                      <stop offset="95%" stopColor={entry.color} stopOpacity={0.2}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} tick={{fill: "hsl(var(--muted-foreground))"}} dy={10} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tickFormatter={(v) => `${v}%`} domain={[0, 100]} tick={{fill: "hsl(var(--muted-foreground))"}} />
                <Tooltip 
                  cursor={{fill: 'hsl(var(--muted))', opacity: 0.2}}
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                  formatter={(value: any) => [`${value}%`, "Progress"]} 
                />
                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={`url(#colorUv-${i})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-semibold">Overall Task Status</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {pieData.map((entry, index) => (
                    <linearGradient key={`pieGrad-${index}`} id={`pieColor-${index}`} x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                      <stop offset="100%" stopColor={entry.color} stopOpacity={0.6}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={`url(#pieColor-${i})`} className="hover:opacity-80 transition-opacity outline-none" />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600 }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Activity log */}
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="mb-4 flex items-center gap-2 font-semibold">
          <Activity className="h-4 w-4 text-blue-500" />
          Recent Activity
        </h3>
        {activityLog.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No activity yet. Department coordinators will update criteria to track progress here.
          </p>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {activityLog.slice(0, 30).map((entry, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <div>
                  <p>{entry.action}</p>
                  <p className="text-xs text-muted-foreground">{new Date(entry.timestamp).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// DEPARTMENT DASHBOARD (for coordinators)
// ══════════════════════════════════════════════════════
function DepartmentView({ criteria, role, updateStatus }: {
  criteria: Criterion[];
  role: Role;
  updateStatus: (id: string, status: Status, remarks: string) => void;
}) {
  const dept = DEPARTMENTS.find((d) => d.id === role)!;
  const myCriteria = criteria.filter((c) => c.department === role);
  const stats = getStats(criteria, role);
  const sections = groupBySection(myCriteria);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={<TrendingUp className="h-5 w-5" />} label="Progress" value={`${stats.progress}%`} color="blue" />
        <StatCard icon={<CheckCircle2 className="h-5 w-5" />} label="Completed" value={`${stats.completed}/${stats.total}`} color="green" />
        <StatCard icon={<Clock className="h-5 w-5" />} label="Pending" value={stats.pending.toString()} color="amber" />
        <StatCard icon={<AlertTriangle className="h-5 w-5" />} label="Overdue" value={stats.overdue.toString()} color="red" />
      </div>

      {/* Overall progress bar */}
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-2 flex justify-between">
          <span className="font-semibold">{dept.name} – Overall Progress</span>
          <span className="font-bold" style={{ color: dept.color }}>{stats.progress}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${stats.progress}%`, backgroundColor: dept.color }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {stats.completed} of {stats.total} criteria completed • {stats.inProgress} in progress
        </p>
      </div>

      {/* Sections */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">NBA Criteria ({myCriteria.length} items)</h2>
        <div className="space-y-3">
          {Object.entries(sections).map(([section, items]) => (
            <SectionAccordion
              key={section}
              section={section}
              criteria={items}
              onUpdate={updateStatus}
              isChairman={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════
export default function DashboardPage() {
  const { user, criteria, updateCriterionStatus, activityLog } = useApp();
  if (!user) return null;

  if (user.role === "chairman") {
    return <ChairmanDashboard criteria={criteria} activityLog={activityLog} />;
  }

  return (
    <DepartmentView
      criteria={criteria}
      role={user.role}
      updateStatus={updateCriterionStatus}
    />
  );
}
