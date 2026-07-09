"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutDashboard,
  Upload,
  History,
  Settings,
  LogOut,
  Menu,
  ChevronLeft,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { AuthGuard } from "@/components/shared/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload Resume", icon: Upload },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className={cn("p-4 border-b", collapsed ? "flex justify-center" : "")}>
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          {!collapsed && <span className="font-bold">Resume Analyzer</span>}
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                {!collapsed && item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t space-y-1">
        <Link href="/">
          <div
            className={cn(
              "flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-muted-foreground hover:bg-muted hover:text-foreground",
              collapsed && "justify-center px-2"
            )}
          >
            <Home className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
            {!collapsed && "Back to Website"}
          </div>
        </Link>
        {!collapsed && user && (
          <div className="flex items-center space-x-3 mb-3 px-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          className={cn("w-full text-muted-foreground hover:text-destructive", collapsed ? "px-0" : "justify-start")}
          onClick={logout}
        >
          <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-2")} />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthGuard>
      <div className="flex h-screen overflow-hidden bg-background">
        {/* Desktop sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col border-r bg-card transition-all duration-300",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <div className="flex justify-end p-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", sidebarCollapsed && "rotate-180")} />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <Sidebar collapsed={sidebarCollapsed} />
          </div>
        </aside>

        {/* Mobile sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden fixed top-3 left-3 z-40">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-6">
            <div className="lg:hidden" /> {/* spacer for mobile menu button */}
            <div className="hidden lg:block" />
            <div className="flex items-center space-x-3">
              <ThemeToggle />
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
