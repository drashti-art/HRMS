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
  BrainCircuit,
  Zap,
  Heart,
  Lightbulb
} from 'lucide-react';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { XAxis, Line, LineChart, CartesianGrid } from "recharts";
import { cn } from '@/lib/utils';

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
            {isManager ? `${user.department} Performance Hub` : 'My Growth & Performance'}
          </h1>
          <p className="text-muted-foreground">
            Advanced analytics and AI-powered engagement insights.
          </p>
        </div>
        {!isManager && (
          <Button className="gap-2 bg-accent text-white hover:bg-accent/90">
            <Zap className="w-4 h-4" /> AI Goal Setting
          </Button>
        )}
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card border-l-4 border-l-primary relative overflow-hidden">
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

        {/* AI Engagement Metric */}
        <Card className="dashboard-card border-l-4 border-l-accent bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">AI Engagement Score</p>
                <h3 className="text-2xl font-bold mt-1 text-accent">85 / 100</h3>
              </div>
              <div className="p-2 bg-accent/20 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-accent" />
              </div>
            </div>
            <p className="text-xs text-accent mt-2 flex items-center gap-1">
              <Heart className="w-3 h-3" /> High team morale detected
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
        <Card className="lg:col-span-2 dashboard-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" /> Team Productivity Analytics
            </CardTitle>
            <CardDescription>Monthly efficiency benchmarks vs industry standards</CardDescription>
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
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card bg-primary text-white border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BrainCircuit className="w-5 h-5" /> AI Retention Insights
            </CardTitle>
            <CardDescription className="text-white/60">Predictive analysis of team health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Burnout Risk</span>
                  <Badge variant="outline" className="text-white border-white/30 bg-emerald-500/20 text-[10px]">Low</Badge>
                </div>
                <Progress value={15} className="h-1 bg-white/20" />
              </div>
              
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider">Skill Growth</span>
                  <Badge variant="outline" className="text-white border-white/30 bg-accent/50 text-[10px]">High</Badge>
                </div>
                <Progress value={85} className="h-1 bg-white/20" />
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="text-xs leading-relaxed text-white/80 italic">
                  "The team shows high engagement in cross-departmental projects. Consider promoting a collaborative peer-review program to further boost productivity."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Member Performance Breakdown</CardTitle>
            <CardDescription>Comprehensive metric tracking for the {user.department} team.</CardDescription>
          </div>
          <Button variant="outline" size="sm">Export Analytics Report</Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-bold">Team Member</TableHead>
                <TableHead className="font-bold">Overall Rating</TableHead>
                <TableHead className="font-bold">Goal Success</TableHead>
                <TableHead className="font-bold text-right">Productivity</TableHead>
                <TableHead className="font-bold text-center">AI Mood Status</TableHead>
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
                  <TableCell className="text-sm font-semibold text-primary">{member.goals} / 15</TableCell>
                  <TableCell className="text-right font-mono text-sm">{member.productivity}%</TableCell>
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
    </div>
  );
}
