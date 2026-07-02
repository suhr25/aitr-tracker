"use client";

import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  Settings,
  FileText,
  LogOut,
  Building,
  CheckSquare
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const { userData, logout } = useAuth();
  const pathname = usePathname();

  const adminLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Departments", href: "/dashboard/departments", icon: Building },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Criteria", href: "/dashboard/criteria", icon: CheckSquare },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const departmentLinks = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
  ];

  const links = userData?.role === "admin" ? adminLinks : departmentLinks;

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-muted/20">
      <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building className="h-6 w-6 text-primary" />
          <span className="">AITR</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                pathname === link.href ? "bg-muted text-primary" : ""
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-4 border-t">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
