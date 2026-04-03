
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
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setUser(getSession());
  }, []);

  const handleExploreInsights = () => {
    setAnalyzing(true);
    setIsInsightsOpen(true);
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
          <p className="text-muted-foreground">Hello {user.name}, here is your dashboard for Banas Dairy.</p>
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
            <StatsCard title="Monthly Payroll" value="₹8,45,20,000" trend={{ value: 2.5, isUp: true }} icon={DollarSign} />
            <StatsCard title="Wellness Index" value="94%" icon={Heart} className="bg-accent/5 border-accent/20" />
            <StatsCard title="Resource Utilization" value="88%" icon={BrainCircuit} />
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
                { user: "Rekhaben Chaudhary", action: "Updated HQ security protocols", time: "2 hours ago", type: 'Security' },
                { user: "AI Assistant", action: "Generated plant efficiency projections", time: "4 hours ago", type: 'AI' },
                { user: "Shankarbhai Chaudhary", action: "Posted a new team announcement", time: "6 hours ago", type: 'Communication' },
                { user: "Pinkiben Chaudhary", action: "Finalized candidate screening for Quality Control", time: "1 day ago", type: 'HR' },
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
                  ? "Based on your activity, you're most productive between 10 AM and 12 PM at the Palanpur plant. Try scheduling your deep work then!"
                  : "Team morale is up 12% this week. Great job on the recent recognition announcements!"}
              </p>
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

      <Dialog open={isInsightsOpen} onOpenChange={setIsInsightsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-accent" /> Deep Workspace Analysis
            </DialogTitle>
            <DialogDescription>
              Predictive AI insights based on Banas Dairy organizational behavior.
            </DialogDescription>
          </DialogHeader>

          {analyzing ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-primary animate-spin" />
              <p className="font-bold text-primary">Scanning System Modules...</p>
            </div>
          ) : (
            <div className="space-y-8 py-4 animate-in fade-in duration-700">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-xs font-bold text-emerald-600 uppercase">Retention Risk</span>
                  <h4 className="text-2xl font-bold text-emerald-700">Extremely Low</h4>
                </div>
                <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                  <span className="text-xs font-bold text-primary uppercase">Engagement Trend</span>
                  <h4 className="text-2xl font-bold text-primary">+18.4%</h4>
                </div>
              </div>
              <Button variant="secondary" className="w-full gap-2 font-bold" onClick={() => setIsInsightsOpen(false)}>
                Acknowledge & Sync <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
