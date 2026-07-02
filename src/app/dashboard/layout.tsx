"use client";

import { useApp } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import {
  LayoutDashboard, LogOut, Moon, Sun, Menu, X,
  Building, ChevronRight, User,
} from "lucide-react";
import { DEPARTMENTS } from "@/lib/data";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  if (!user) return null;

  const isChairman = user.role === "chairman";
  const currentDept = DEPARTMENTS.find((d) => d.id === user.role);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r border-border bg-card transition-transform duration-200 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center gap-3 border-b border-border px-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">CPTMS</p>
              <p className="text-[10px] text-muted-foreground">Progress Tracker</p>
            </div>
            <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-3">
            <Link
              href="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                pathname === "/dashboard"
                  ? "bg-blue-600/10 text-blue-600 dark:text-blue-400"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>

            {isChairman && (
              <div className="pt-4">
                <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Departments
                </p>
                {DEPARTMENTS.map((dept) => (
                  <Link
                    key={dept.id}
                    href={`/dashboard/dept/${dept.id}`}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      pathname === `/dashboard/dept/${dept.id}`
                        ? "bg-blue-600/10 text-blue-600 dark:text-blue-400"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dept.color }} />
                    {dept.shortName}
                    <ChevronRight className="ml-auto h-3.5 w-3.5 opacity-40" />
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* User section */}
          <div className="border-t border-border p-3">
            <div className="mb-3 flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/20 text-blue-500">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{user.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">
                  {isChairman ? "Chairman" : currentDept?.shortName + " Coordinator"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
                {theme === "dark" ? "Light" : "Dark"}
              </button>
              <button
                onClick={handleLogout}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {isChairman ? "Chairman Dashboard" : `${currentDept?.name} Dashboard`}
            </h1>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
