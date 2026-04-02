'use client';

import { useEffect, useState } from 'react';
import { getSession, User } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  UserCircle, 
  Mail, 
  Building2, 
  Briefcase, 
  Calendar, 
  Shield, 
  Edit3,
  Camera
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    designation: '',
    bio: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const sessionUser = getSession();
    if (sessionUser) {
      setUser(sessionUser);
      setFormData({
        name: sessionUser.name,
        department: sessionUser.department,
        designation: sessionUser.designation,
        bio: `I am a ${sessionUser.designation} in the ${sessionUser.department} department, focusing on organizational excellence and team collaboration.`
      });
    }
  }, []);

  const isAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-primary">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal information and account preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 dashboard-card overflow-hidden h-fit">
          <div className="h-32 bg-primary relative">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center text-primary text-3xl font-bold overflow-hidden">
                  {user.name.charAt(0)}
                </div>
                <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full w-8 h-8 shadow-md">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
          <CardContent className="pt-16 text-center space-y-4 pb-8">
            <div>
              <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.designation}</p>
            </div>
            <div className="flex justify-center gap-2">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                {user.role}
              </Badge>
              <Badge variant="secondary">
                {user.department}
              </Badge>
            </div>
            <Separator />
            <div className="text-left space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">{user.department} Department</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Joined {user.joiningDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Account Details</CardTitle>
              <p className="text-sm text-muted-foreground">
                Update your personal and professional profile details. 
                {isAdmin ? " (Admin Access: All fields editable)" : " (Some fields locked by Admin)"}
              </p>
            </div>
            <Edit3 className="w-5 h-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={user.email} disabled className="bg-secondary/30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input 
                    id="department" 
                    value={formData.department} 
                    disabled={!isAdmin}
                    className={!isAdmin ? "bg-secondary/30" : ""}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input 
                    id="designation" 
                    value={formData.designation} 
                    disabled={!isAdmin}
                    className={!isAdmin ? "bg-secondary/30" : ""}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">About You</Label>
                <textarea 
                  id="bio"
                  className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="Tell us a little about your role..."
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => window.location.reload()}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card border-l-4 border-l-amber-400">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Shield className="w-8 h-8 text-amber-500" />
              <div>
                <h4 className="font-bold text-sm">Security Level</h4>
                <p className="text-xs text-muted-foreground">Your account has {user.role === 'SuperAdmin' ? 'highest' : 'standard'} access permissions.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {!isAdmin && (
          <>
            <Card className="dashboard-card border-l-4 border-l-emerald-400">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <Briefcase className="w-8 h-8 text-emerald-500" />
                  <div>
                    <h4 className="font-bold text-sm">Employment Status</h4>
                    <p className="text-xs text-muted-foreground">Full-time Permanent</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="dashboard-card border-l-4 border-l-accent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <UserCircle className="w-8 h-8 text-accent" />
                  <div>
                    <h4 className="font-bold text-sm">Profile Verified</h4>
                    <p className="text-xs text-muted-foreground">Your HR record is up to date.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}