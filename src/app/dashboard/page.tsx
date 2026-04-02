'use client';

import { useEffect, useState } from 'react';
import { getSession, User } from '@/lib/auth';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { 
  Users, 
  CalendarClock, 
  Briefcase, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  BrainCircuit, 
  Activity, 
  Heart,
  Loader2,
  LineChart,
  Target,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

export default function DashboardOverview() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  
  // AI Insights States
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  const handleExploreInsights = () => {
    setAnalyzing(true);
    setIsInsightsOpen(true);
    
    // Simulate deep system analysis
    setTimeout(() => {
      setAnalyzing(false);
    }, 2000);
  };

  if (!user) return null;

  const isAdmin = user.role === 'SuperAdmin' || user.role === 'Admin';
  const isHR = user.role === 'HR';
  const isManager = user.role === 'Manager';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-accent animate-pulse" /> Workspace Intelligence
          </h1>
          <p className="text-muted-foreground">Hello {user.name}, here is your high-fidelity dashboard for today.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 bg-primary/5 p-2 rounded-xl border border-primary/10">
          <Activity className="w-4 h-4 text-primary animate-bounce" />
          <span className="text-xs font-bold text-primary uppercase">System Healthy</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isAdmin && (
          <>
            <StatsCard title="Total Employees" value="1,248" trend={{ value: 12, isUp: true }} icon={Users} />
            <StatsCard title="Monthly Payroll" value="$845,200" trend={{ value: 2.5, isUp: true }} icon={DollarSign} />
            <StatsCard title="AI Wellness Index" value="94%" icon={Heart} className="bg-accent/5 border-accent/20" />
            <StatsCard title="Resource Utilization" value="88%" icon={BrainCircuit} />
          </>
        )}
        {isHR && (
          <>
            <StatsCard title="New Applicants" value="156" trend={{ value: 24, isUp: true }} icon={Users} />
            <StatsCard title="Retention Risk" value="Low" description="AI Predicted" icon={BrainCircuit} className="bg-emerald-50 border-emerald-200" />
            <StatsCard title="Active Onboarding" value="8" icon={CheckCircle2} />
            <StatsCard title="Pending Approvals" value="14" icon={AlertCircle} />
          </>
        )}
        {isManager && (
          <>
            <StatsCard title="Team Engagement" value="9.2/10" description="Manager Pulse Score" icon={Heart} className="bg-rose-50 border-rose-200" />
            <StatsCard title="Present Today" value="11/12" icon={CalendarClock} />
            <StatsCard title="Metric Growth" value="+15%" icon={Sparkles} />
            <StatsCard title="Open Feedback" value="3" icon={AlertCircle} />
          </>
        )}
        {user.role === 'Employee' && (
          <>
            <StatsCard title="Attendance Rate" value="98%" description="Current month" icon={CalendarClock} />
            <StatsCard title="Skill Progress" value="Advanced" description="AI Evaluation" icon={BrainCircuit} className="bg-accent/10" />
            <StatsCard title="Leave Balance" value="14 Days" icon={Briefcase} />
            <StatsCard title="Next Evaluation" value="14 Days" icon={CheckCircle2} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 dashboard-card overflow-hidden">
          <CardHeader className="bg-secondary/10 border-b">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Recent Activity Stream</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">Real-time workspace synchronization</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard/activities')}>Details</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[
                { user: "Sarah Connor", action: "Updated System Security protocols", time: "2 hours ago", type: 'Security' },
                { user: "AI Assistant", action: "Generated monthly performance projections", time: "4 hours ago", type: 'AI' },
                { user: "Michael Scott", action: "Posted a new team announcement", time: "6 hours ago", type: 'Communication' },
                { user: "Jane Smith", action: "Finalized candidate screening for Senior Dev", time: "1 day ago", type: 'HR' },
              ].map((activity, i) => (
                <div key={i} className="flex gap-4 items-start group">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{activity.user} <span className="font-normal text-muted-foreground">{activity.action}</span></p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-muted-foreground">{activity.time}</span>
                      <Badge variant="secondary" className="text-[8px] h-3 px-1">{activity.type}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card bg-primary text-white border-none shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit className="w-24 h-24" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" /> AI Workspace Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Focus Suggestion</h4>
              <p className="text-sm leading-relaxed">
                {user.role === 'Employee' 
                  ? "Based on your activity, you're most productive between 10 AM and 12 PM. Try scheduling your deep work then!"
                  : "Team morale is up 12% this week. Great job on the recent recognition announcements!"}
              </p>
            </div>
            
            <div className="p-4 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm">
              <h4 className="text-xs font-bold uppercase tracking-widest text-accent mb-2">Upcoming Deadline</h4>
              <p className="text-sm">Quarterly Performance Reviews start in 14 days. Ensure all logs are finalized.</p>
            </div>

            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-primary font-bold shadow-lg"
              onClick={handleExploreInsights}
            >
              Explore AI Insights
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Dialog */}
      <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-accent" /> Deep Workspace Analysis
            </DialogTitle>
            <DialogDescription>
              Predictive AI insights based on current organizational behavior and historical data.
            </DialogDescription>
          </DialogHeader>

          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <div className="text-center">
                <p className="font-bold text-primary">Scanning System Modules...</p>
                <p className="text-sm text-muted-foreground italic">Running cross-departmental sentiment analysis</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8 py-4 animate-in fade-in duration-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-600 uppercase">Retention Risk</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-emerald-700">Extremely Low</h4>
                  <p className="text-[10px] text-emerald-600/70 mt-1">AI indicates 96% team stability for Q3.</p>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-primary uppercase">Engagement Trend</span>
                    <LineChart className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className="text-2xl font-bold text-primary">+18.4%</h4>
                  <p className="text-[10px] text-primary/70 mt-1">Growth in active internal communications.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-muted-foreground uppercase flex items-center gap-2">
                  <Target className="w-4 h-4" /> Priority Areas for {user.role}
                </h3>
                
                <div className="space-y-3">
                  <div className="p-3 border rounded-xl bg-card space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Team Morale optimization</span>
                      <Badge className="bg-accent text-primary">Active</Badge>
                    </div>
                    <Progress value={85} className="h-1.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      AI recommends scheduling a department-wide wellness workshop based on recent workload spikes.
                    </p>
                  </div>

                  <div className="p-3 border rounded-xl bg-card space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Resource Utilization</span>
                      <Badge variant="outline" className="text-emerald-600 border-emerald-200">Optimal</Badge>
                    </div>
                    <Progress value={92} className="h-1.5" />
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Departmental budget allocation is 92% efficient. No major reallocation needed this cycle.
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="bg-primary p-6 rounded-2xl text-white relative overflow-hidden">
                <Zap className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
                <h4 className="text-lg font-bold flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-accent" /> Proactive AI Action
                </h4>
                <p className="text-sm text-white/80 leading-relaxed mb-4">
                  "Based on the current trajectory, the {user.department} team is likely to meet all quarterly OKRs 12 days ahead of schedule. We recommend early-stage planning for Q4 initiatives."
                </p>
                <Button variant="secondary" className="w-full gap-2 font-bold" onClick={() => setIsInsightsOpen(false)}>
                  Acknowledge & Sync <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
