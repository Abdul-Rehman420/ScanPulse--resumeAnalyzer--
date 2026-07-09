"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/shared/page-transition";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { formatDate } from "@/utils/format-date";
import { User, Palette, Shield, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, logout } = useAuth();

  return (
    <PageTransition>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <User className="h-5 w-5 mr-2 text-primary" />
              Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary text-xl">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-lg">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Email</span>
                <span className="text-sm font-medium">{user?.email}</span>
              </div>
              <Separator />
              <div className="flex justify-between py-2">
                <span className="text-sm text-muted-foreground">Member Since</span>
                <span className="text-sm font-medium">
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Theme */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Palette className="h-5 w-5 mr-2 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize your theme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Toggle between dark and light mode</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Account
            </CardTitle>
            <CardDescription>Manage your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
