'use client';

import { useEffect, useState } from 'react';
import { getSession, User, MOCK_USERS } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  Users, 
  UserCircle, 
  Mail, 
  MessageSquare, 
  TrendingUp, 
  CalendarCheck,
  MoreVertical,
  CheckCircle2,
  Clock,
  ShieldAlert,
  UserPlus,
  Plus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function MyTeamPage() {
  const [manager, setManager] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    designation: ''
  });
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      setManager(session);
      // Filter team members by department (simple logic for mock)
      const members = MOCK_USERS.filter(u => 
        u.department === session.department && u.id !== session.id
      );
      setTeamMembers(members);
    }
  }, []);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manager || !newMember.name || !newMember.email) return;

    const member: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name,
      email: newMember.email,
      role: 'Employee',
      department: manager.department,
      designation: newMember.designation || 'Team Member',
      joiningDate: new Date().toISOString().split('T')[0]
    };

    setTeamMembers([member, ...teamMembers]);
    setIsAddMemberOpen(false);
    setNewMember({ name: '', email: '', designation: '' });

    toast({
      title: "Team Member Added",
      description: `${member.name} has been added to the ${manager.department} team.`,
    });
  };

  if (!manager || (manager.role !== 'Manager' && manager.role !== 'SuperAdmin')) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <ShieldAlert className="w-12 h-12 text-destructive opacity-20" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          This dashboard is reserved for Managers to view their reporting team members.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">My Team</h1>
          <p className="text-muted-foreground">Managing {teamMembers.length} members in the {manager.department} department.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <UserPlus className="w-4 h-4" /> Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Enter details to add a new member to the {manager.department} department.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddMember} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={newMember.name}
                    onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@worknest.com" 
                    value={newMember.email}
                    onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input 
                    id="designation" 
                    placeholder="Software Engineer" 
                    value={newMember.designation}
                    onChange={(e) => setNewMember({...newMember, designation: e.target.value})}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit" className="w-full">Add to Team</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          <Button className="gap-2">
            <MessageSquare className="w-4 h-4" /> Team Announcement
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="dashboard-card border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Team Size</p>
                <h3 className="text-2xl font-bold">{teamMembers.length} Employees</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-full">
                <CalendarCheck className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Present Today</p>
                <h3 className="text-2xl font-bold">{teamMembers.length}/{teamMembers.length}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/10 rounded-full">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase">Avg. Performance</p>
                <h3 className="text-2xl font-bold">92%</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Direct Reports</CardTitle>
          <CardDescription>Overview of your team members and their current status.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-bold">Member</TableHead>
                <TableHead className="font-bold">Designation</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="font-bold">Performance</TableHead>
                <TableHead className="font-bold">Last Activity</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-accent/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{member.designation}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] uppercase font-bold">
                        Online
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary rounded-full h-1.5 overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: '85%' }} />
                        </div>
                        <span className="text-xs font-bold">85%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      Clocked in at 09:00 AM
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Member Options</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <UserCircle className="w-4 h-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <TrendingUp className="w-4 h-4" /> Performance Review
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 cursor-pointer">
                            <Mail className="w-4 h-4" /> Send Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No reporting team members found in your department.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" /> Recent Team Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.slice(0, 5).map((member, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border bg-secondary/10">
                <div className="flex items-center gap-3">
                   <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{member.name}</p>
                    <p className="text-[10px] text-muted-foreground">Submitted Weekly Report</p>
                  </div>
                </div>
                <span className="text-[10px] text-muted-foreground">2h ago</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> Pending Approvals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 opacity-20" />
              <p className="text-sm font-medium">All caught up!</p>
              <p className="text-xs text-muted-foreground">No pending leave or reimbursement requests from your team.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
