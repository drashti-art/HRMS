'use client';

import { useEffect, useState } from 'react';
import { getSession, User, MOCK_USERS } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Award, 
  Users, 
  Calendar,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  User as UserIcon
} from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer, Line, LineChart, Tooltip } from "recharts";
import { cn } from '@/lib/utils';

// Mock Performance Data
const TEAM_PERFORMANCE_DATA = [
  { name: "Jim Halpert", rating: 92, goals: 12, productivity: 88, attendance: 98, status: 'Exceeding' },
  { name: "Pam Beesly", rating: 88, goals: 10, productivity: 90, attendance: 100, status: 'Meeting' },
  { name: "Dwight Schrute", rating: 98, goals: 15, productivity: 95, attendance: 99, status: 'Exceeding' },
  { name: "Stanley Hudson", rating: 75, goals: 8, productivity: 70, attendance: 85, status: 'Improving' },
  { name: "Phyllis Vance", rating: 82, goals: 9, productivity: 80, attendance: 92, status: 'Meeting' },
];

const PRODUCTIVITY_TREND = [
  { month: "Jan", score: 78 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 85 },
  { month: "Apr", score: 84 },
  { month: "May", score: 88 },
  { month: "Jun", score: 92 },
];

const chartConfig = {
  score: {
    label: "Productivity",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function PerformancePage() {
  const [user, setUser] = useState<User | null>(null);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  useEffect(() => {
    const session = getSession();
    if (session) {
      setUser(session);
      const members = MOCK_USERS.filter(u => 
        u.department === session.department && u.id !== session.id
      );
      setTeamMembers(members);
    }
  }, []);

  if (!user) return null;

  const isManager = user.role === 'Manager' || user.role === 'SuperAdmin' || user.role === 'Admin' || user.role === 'HR';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <BarChart3 className="w-8 h-8" /> 
            {isManager ? `${user.department} Team Performance` : 'My Performance Insights'}
          </h1>
          <p className="text-muted-foreground">
            {isManager 
              ? `Comprehensive analysis of performance metrics for the ${user.department} team.` 
              : 'Track your growth, goal completion, and professional development.'}
          </p>
        </div>
        {!isManager && (
          <Button className="gap-2">
            <Calendar className="w-4 h-4" /> Request Feedback
          </Button>
        )}
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Average Rating</p>
                <h3 className="text-2xl font-bold mt-1">4.6 / 5.0</h3>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Award className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +0.2 from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Goals Completed</p>
                <h3 className="text-2xl font-bold mt-1">92%</h3>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> On track for yearly target
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Productivity</p>
                <h3 className="text-2xl font-bold mt-1">88.4</h3>
              </div>
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 text-emerald-600" /> Peak performance in June
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Next Review</p>
                <h3 className="text-2xl font-bold mt-1">14 Days</h3>
              </div>
              <div className="p-2 bg-amber-100 rounded-lg">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Quarter 3 Evaluation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Productivity Chart */}
        <Card className="lg:col-span-2 dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg">Productivity Trend</CardTitle>
            <CardDescription>Monthly team efficiency score analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <LineChart data={PRODUCTIVITY_TREND} margin={{ left: 12, right: 12, top: 12 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--color-score)"
                    strokeWidth={3}
                    dot={{ fill: "var(--color-score)", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        {/* Skill Distribution / Top Performers */}
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg">Team Recognition</CardTitle>
            <CardDescription>Highest rated members this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {TEAM_PERFORMANCE_DATA.sort((a, b) => b.rating - a.rating).slice(0, 3).map((performer, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {performer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold">{performer.name}</p>
                    <p className="text-xs text-muted-foreground">{performer.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{performer.rating}%</p>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <div key={s} className={cn("w-1.5 h-1.5 rounded-full", s <= 4 ? "bg-amber-400" : "bg-muted")} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <h4 className="text-xs font-bold text-primary uppercase mb-2">Manager Tip</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Focus on setting "SMART" goals for the next quarter to improve the team's average productivity score by 5%.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Member Table (Manager View) or My Goals (Employee View) */}
      {isManager ? (
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Member Metrics Breakdown</CardTitle>
              <CardDescription>Detailed performance values across key indicators.</CardDescription>
            </div>
            <Button variant="outline" size="sm">Download Report</Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="font-bold">Team Member</TableHead>
                  <TableHead className="font-bold">Overall Rating</TableHead>
                  <TableHead className="font-bold">Goal Completion</TableHead>
                  <TableHead className="font-bold text-right">Productivity</TableHead>
                  <TableHead className="font-bold text-right">Attendance</TableHead>
                  <TableHead className="font-bold text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TEAM_PERFORMANCE_DATA.map((member, i) => (
                  <TableRow key={i} className="hover:bg-accent/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold text-primary">
                          {member.name.charAt(0)}
                        </div>
                        <span className="font-medium text-sm">{member.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span>{member.rating}%</span>
                        </div>
                        <Progress value={member.rating} className="h-1" />
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{member.goals} / 15</TableCell>
                    <TableCell className="text-right font-mono text-sm">{member.productivity}%</TableCell>
                    <TableCell className="text-right font-mono text-sm">{member.attendance}%</TableCell>
                    <TableCell className="text-center">
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] font-bold uppercase",
                          member.status === 'Exceeding' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                          member.status === 'Meeting' && "bg-blue-50 text-blue-700 border-blue-200",
                          member.status === 'Improving' && "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>My Professional Goals</CardTitle>
              <CardDescription>Track your active development objectives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { title: 'Complete Advanced React Certification', progress: 75, deadline: 'Aug 15' },
                { title: 'Improve Team Code Review Speed', progress: 40, deadline: 'Sept 01' },
                { title: 'Publish Internal Engineering Blog', progress: 100, deadline: 'Done' },
              ].map((goal, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-bold">{goal.title}</p>
                    <span className="text-xs text-muted-foreground">{goal.deadline}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <p className="text-[10px] text-muted-foreground text-right">{goal.progress}% Complete</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle>Recent Feedback</CardTitle>
              <CardDescription>Comments from your direct manager.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent/5 rounded-lg border border-accent/20">
                <p className="text-sm italic">"Great work on the Q2 infrastructure migration. Your attention to detail in the security audit was exceptional."</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-accent">Michael Scott</span>
                  <span className="text-[10px] text-muted-foreground">2 days ago</span>
                </div>
              </div>
              <div className="p-4 bg-secondary/20 rounded-lg border">
                <p className="text-sm italic">"I'd like to see you take a more active role in the junior mentoring program next month."</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Michael Scott</span>
                  <span className="text-[10px] text-muted-foreground">1 week ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
