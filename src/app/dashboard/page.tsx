'use client';

import { useEffect, useState } from 'react';
import { getSession, User } from '@/lib/auth';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { Users, CalendarClock, Briefcase, DollarSign, CheckCircle2, AlertCircle, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function DashboardOverview() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setUser(getSession());
  }, []);

  if (!user) return null;

  const isAdmin = user.role === 'SuperAdmin' || user.role === 'Admin';
  const isHR = user.role === 'HR';
  const isManager = user.role === 'Manager';

  const handleViewAllActivity = () => {
    if (user.role === 'SuperAdmin') {
      router.push('/dashboard/logs');
    } else if (user.role === 'HR') {
      router.push('/dashboard/recruitment');
    } else if (user.role === 'Manager') {
      router.push('/dashboard/team');
    } else {
      toast({
        title: "Activity History",
        description: "A detailed activity history feature for your role is coming soon.",
      });
    }
  };

  const handleReviewAllApprovals = () => {
    // For most roles, approvals are centered in the Leaves section
    router.push('/dashboard/leaves');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-primary">Overview Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.name}. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && (
          <>
            <StatsCard title="Total Employees" value="1,248" trend={{ value: 12, isUp: true }} icon={Users} />
            <StatsCard title="Monthly Payroll" value="$845,200" trend={{ value: 2.5, isUp: true }} icon={DollarSign} />
            <StatsCard title="Attendance Rate" value="94.2%" trend={{ value: 1.1, isUp: false }} icon={CalendarClock} />
            <StatsCard title="Open Positions" value="24" icon={Briefcase} />
          </>
        )}
        {isHR && (
          <>
            <StatsCard title="New Applicants" value="156" trend={{ value: 24, isUp: true }} icon={Users} />
            <StatsCard title="Active Jobs" value="12" icon={Briefcase} />
            <StatsCard title="Onboarding" value="8" description="Currently in progress" icon={CheckCircle2} />
            <StatsCard title="Leaves Pending" value="14" icon={AlertCircle} />
          </>
        )}
        {isManager && (
          <>
            <StatsCard title="Team Members" value="12" icon={Users} />
            <StatsCard title="Team Attendance" value="11/12" description="Today's presence" icon={CalendarClock} />
            <StatsCard title="Performance Review" value="4" description="Due this week" icon={CheckCircle2} />
            <StatsCard title="Leave Requests" value="3" description="Pending your approval" icon={AlertCircle} />
          </>
        )}
        {user.role === 'Employee' && (
          <>
            <StatsCard title="Days Present" value="22" description="Current month" icon={CalendarClock} />
            <StatsCard title="Leave Balance" value="14 Days" icon={FileText} />
            <StatsCard title="Net Salary" value="$5,400" description="Last month" icon={DollarSign} />
            <StatsCard title="Tasks Completed" value="85%" icon={CheckCircle2} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="outline" size="sm" onClick={handleViewAllActivity}>View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { user: "Sarah Connor", action: "Approved leave for John Smith", time: "2 hours ago" },
                { user: "Michael Scott", action: "Posted new job opening: Senior Developer", time: "4 hours ago" },
                { user: "Jim Halpert", action: "Clocked in successfully", time: "6 hours ago" },
                { user: "Jane Smith", action: "Updated payroll for March", time: "1 day ago" },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                    {activity.user.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span></p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Approvals</CardTitle>
            <Button variant="outline" size="sm" onClick={handleReviewAllApprovals}>Review All</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Alice Brown", type: "Annual Leave", status: "Pending" },
                  { name: "Bob Wilson", type: "Sick Leave", status: "Reviewing" },
                  { name: "Charlie Davis", type: "Reimbursement", status: "Pending" },
                ].map((row, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === "Pending" ? "default" : "secondary"}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-accent"
                        onClick={() => router.push('/dashboard/leaves')}
                      >
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
