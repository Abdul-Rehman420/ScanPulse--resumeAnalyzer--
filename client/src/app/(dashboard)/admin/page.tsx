"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  Users,
  FileText,
  BarChart3,
  Trash2,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/page-transition";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import {
  getAdminDashboard,
  getAdminUsers,
  updateUserRole,
  deleteUser,
} from "@/services/admin";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PAGE_SIZE = 20;

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (user && user.role !== "ADMIN") {
      router.push("/dashboard");
    }
  }, [user, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getAdminDashboard,
    enabled: user?.role === "ADMIN",
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin-users", page],
    queryFn: () => getAdminUsers(page, PAGE_SIZE),
    enabled: user?.role === "ADMIN",
  });

  const updateRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => updateUserRole(id, role),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success(`Role updated to ${vars.role}`);
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.error("Failed to update role");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      if (usersData && page > 1 && usersData.users.length === 1) {
        setPage((p) => p - 1);
      }
      setDeleteId(null);
      toast.success("User deleted");
    },
    onError: () => toast.error("Failed to delete user"),
  });

  if (isLoading) {
    return (
      <PageTransition>
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {[1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-28" />)}
          </div>
        </div>
      </PageTransition>
    );
  }

  const stats = data?.stats;
  const currentUserId = user?.id;
  const lastPage = usersData?.totalPages || 1;

  return (
    <PageTransition>
      <div className="space-y-6 max-w-6xl">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalResumes || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Analyses</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalAnalyses || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cover Letters</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.totalCoverLetters || 0}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Avg ATS Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stats?.avgAtsScore || 0}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage roles and accounts</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {usersLoading ? (
              <div className="p-6 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-14" />
                ))}
              </div>
            ) : usersData && usersData.users.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">User</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4 hidden sm:table-cell">Email</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4">Role</th>
                        <th className="text-left text-sm font-medium text-muted-foreground p-4 hidden md:table-cell">Joined</th>
                        <th className="text-right text-sm font-medium text-muted-foreground p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersData.users.map((u) => {
                        const isSelf = u.id === currentUserId;
                        return (
                          <tr key={u.id} className="border-b last:border-0 hover:bg-muted/50 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">{u.name || "—"}</span>
                                {isSelf && (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                                    You
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="p-4 hidden sm:table-cell">
                              <span className="text-sm text-muted-foreground">{u.email}</span>
                            </td>
                            <td className="p-4">
                              <Select
                                value={u.role}
                                onValueChange={(role) => updateRole.mutate({ id: u.id, role })}
                                disabled={isSelf || updateRole.isPending}
                              >
                                <SelectTrigger className="h-8 w-28">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="USER">USER</SelectItem>
                                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                                </SelectContent>
                              </Select>
                            </td>
                            <td className="p-4 hidden md:table-cell">
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(u.createdAt), "MMM d, yyyy")}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                disabled={isSelf || deleteUserMutation.isPending}
                                onClick={() => setDeleteId(u.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-center justify-between p-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    Page {usersData.page} of {usersData.totalPages} · {usersData.total} users
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <ChevronLeft className="h-4 w-4" /> Prev
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= lastPage}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-sm text-muted-foreground">No users found</div>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete User</DialogTitle>
              <DialogDescription>
                This permanently deletes the user, their auth account, and all of their resumes,
                analyses, cover letters and shared links. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteUserMutation.isPending}
                onClick={() => deleteId && deleteUserMutation.mutate(deleteId)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageTransition>
  );
}
