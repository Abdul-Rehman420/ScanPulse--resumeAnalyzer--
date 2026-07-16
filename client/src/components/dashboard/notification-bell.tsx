"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Notification } from "@/types";
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from "@/services/notifications";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function load() {
    try {
      const [count, items] = await Promise.all([getUnreadCount(), getNotifications()]);
      setUnreadCount(count);
      setNotifications(items);
    } catch {}
  }

  async function handleMarkAllRead() {
    await markAllAsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  async function handleClick(n: Notification) {
    if (!n.read) {
      await markAsRead(n.id);
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotifications((prev) => prev.map((p) => (p.id === n.id ? { ...p, read: true } : p)));
    }
    if (n.link) {
      router.push(n.link);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative">
      <Button variant="ghost" size="icon" className="relative" onClick={() => setOpen(!open)}>
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-lg border bg-card shadow-lg z-50">
          <div className="flex items-center justify-between p-3 border-b">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={handleMarkAllRead} className="text-xs text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">No notifications</p>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={cn(
                    "w-full text-left p-3 border-b last:border-0 hover:bg-muted/50 transition-colors",
                    !n.read && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0", n.read ? "bg-transparent" : "bg-primary")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
