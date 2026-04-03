
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
import { cn } from '@/lib/utils';

const TEAM_PERFORMANCE_DATA = [
  { name: "Bharatbhai Chaudhary", rating: 92, goals: 12, productivity: 88, attendance: 98, status: 'Exceeding' },
  { name: "Rekhaben Chaudhary", rating: 88, goals: 10, productivity: 90, attendance: 100, status: 'Meeting' },
  { name: "Valabhai Chaudhary", rating: 98, goals: 15, productivity: 95, attendance: 99, status: 'Exceeding' },
  { name: "Karshanbhai Chaudhary", rating: 75, goals: 8, productivity: 70, attendance: 85, status: 'Improving' },
  { name: "Sitaben Chaudhary", rating: 82, goals: 9, productivity: 80, attendance: 92, status: 'Meeting' },
];

export default function PerformancePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getSession());
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
            Banas Dairy Analytics and AI-powered engagement insights.
          </p>
        </div>
      </div>

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
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Member Performance Breakdown</CardTitle>
          <CardDescription>Comprehensive metric tracking for the {user.department} department.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-bold">Team Member</TableHead>
                <TableHead className="font-bold">Overall Rating</TableHead>
                <TableHead className="font-bold">Goal Success</TableHead>
                <TableHead className="font-bold text-right">Productivity</TableHead>
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
                    <Progress value={member.rating} className="h-1" />
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
