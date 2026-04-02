
'use client';

import { useEffect, useState } from 'react';
import { getSession, User } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  ShieldCheck, 
  Bell, 
  Globe, 
  Lock, 
  Smartphone, 
  Mail,
  Save,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  const handleSave = (section: string) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Settings Saved",
        description: `Your ${section} preferences have been updated successfully.`,
      });
    }, 1000);
  };

  if (!user) return null;

  const isSuperAdmin = user.role === 'SuperAdmin';

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-primary">Account Settings</h1>
        <p className="text-muted-foreground">Manage your security, notifications, and platform preferences.</p>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mb-8">
          <TabsTrigger value="security" className="gap-2">
            <Lock className="w-4 h-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="general" className="gap-2">
            <Globe className="w-4 h-4" /> General
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Password Management</CardTitle>
              <CardDescription>Change your password to keep your account secure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="current">Current Password</Label>
                  <Input id="current" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new">New Password</Label>
                  <Input id="new" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input id="confirm" type="password" />
                </div>
              </div>
              <Button onClick={() => handleSave('password')} disabled={loading} className="mt-4">
                {loading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>Add an extra layer of security to your account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="bg-secondary p-2 rounded-lg h-fit">
                    <Smartphone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">SMS Authentication</p>
                    <p className="text-xs text-muted-foreground">Receive a code via SMS whenever you log in.</p>
                  </div>
                </div>
                <Switch />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="bg-secondary p-2 rounded-lg h-fit">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Authenticator App</p>
                    <p className="text-xs text-muted-foreground">Use an app like Google Authenticator or Authy.</p>
                  </div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Control which updates you receive via email.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="n-payroll" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-bold">Payroll Alerts</span>
                  <span className="font-normal text-xs text-muted-foreground">Get notified when salary is processed.</span>
                </Label>
                <Switch id="n-payroll" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="n-leave" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-bold">Leave Requests</span>
                  <span className="font-normal text-xs text-muted-foreground">Notifications about leave approval status.</span>
                </Label>
                <Switch id="n-leave" defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <Label htmlFor="n-system" className="flex flex-col gap-1 cursor-pointer">
                  <span className="font-bold">System Announcements</span>
                  <span className="font-normal text-xs text-muted-foreground">Important updates about the Banas Dairy platform.</span>
                </Label>
                <Switch id="n-system" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Platform Preferences</CardTitle>
              <CardDescription>Customize how you interact with the system.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Language</Label>
                  <Input placeholder="English (US)" disabled className="bg-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Input placeholder="(GMT+05:30) Mumbai, Kolkata" disabled className="bg-secondary/30" />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-bold">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sync your data to the cloud every 24 hours.
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              {isSuperAdmin && (
                <>
                  <Separator />
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" /> System Administrator Options
                    </h4>
                    <p className="text-xs text-muted-foreground mb-4">These settings affect the entire organization.</p>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Maintenance Mode</span>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Audit Log Retention (90 days)</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-4 flex justify-end">
                <Button onClick={() => handleSave('general')} className="gap-2">
                  <Save className="w-4 h-4" /> Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
