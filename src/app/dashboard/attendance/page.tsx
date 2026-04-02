'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { 
  Clock, 
  MapPin, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  AlertCircle,
  Timer,
  LogIn,
  LogOut,
  Coffee
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface AttendanceRecord {
  id: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  status: 'On Time' | 'Late' | 'Absent';
  totalHours: string;
}

const MOCK_HISTORY: AttendanceRecord[] = [
  { id: '1', date: '2024-03-14', clockIn: '08:55 AM', clockOut: '06:05 PM', status: 'On Time', totalHours: '9h 10m' },
  { id: '2', date: '2024-03-13', clockIn: '09:15 AM', clockOut: '06:15 PM', status: 'Late', totalHours: '9h 00m' },
  { id: '3', date: '2024-03-12', clockIn: '08:50 AM', clockOut: '05:30 PM', status: 'On Time', totalHours: '8h 40m' },
  { id: '4', date: '2024-03-11', clockIn: '09:05 AM', clockOut: '06:00 PM', status: 'On Time', totalHours: '8h 55m' },
  { id: '5', date: '2024-03-08', clockIn: '08:45 AM', clockOut: '06:30 PM', status: 'On Time', totalHours: '9h 45m' },
];

export default function AttendancePage() {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>(MOCK_HISTORY);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleClockAction = () => {
    if (!isClockedIn) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsClockedIn(true);
      setClockInTime(timeStr);
      toast({
        title: "Clocked In",
        description: `Successfully clocked in at ${timeStr}. Have a great day!`,
      });
    } else {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setIsClockedIn(false);
      
      const newRecord: AttendanceRecord = {
        id: Math.random().toString(36).substr(2, 9),
        date: now.toISOString().split('T')[0],
        clockIn: clockInTime || '--',
        clockOut: timeStr,
        status: 'On Time',
        totalHours: 'Working...'
      };
      
      setAttendanceHistory([newRecord, ...attendanceHistory]);
      setClockInTime(null);
      toast({
        title: "Clocked Out",
        description: `Successfully clocked out at ${timeStr}. See you tomorrow!`,
      });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Attendance Tracking</h1>
          <p className="text-muted-foreground">Manage your daily work hours and check-in logs.</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary font-mono">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-sm text-muted-foreground">
            {currentTime.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none shadow-lg overflow-hidden bg-primary text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" /> 
              {isClockedIn ? "Active Shift" : "Shift Management"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="py-4 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/10 border-4 border-white/20 mb-4">
                <Timer className={cn("w-10 h-10", isClockedIn && "animate-pulse text-accent")} />
              </div>
              <h3 className="text-2xl font-bold">
                {isClockedIn ? "Working..." : "Not Clocked In"}
              </h3>
              <p className="text-white/70 text-sm mt-1">
                {isClockedIn ? `Since ${clockInTime}` : "Ready to start your day?"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="secondary" 
                className={cn(
                  "w-full gap-2 h-12 font-bold",
                  isClockedIn ? "bg-white/20 hover:bg-white/30 text-white border-none cursor-not-allowed" : "bg-white text-primary hover:bg-white/90"
                )}
                onClick={handleClockAction}
                disabled={isClockedIn}
              >
                <LogIn className="w-4 h-4" /> Clock In
              </Button>
              <Button 
                variant="secondary" 
                className={cn(
                  "w-full gap-2 h-12 font-bold",
                  !isClockedIn ? "bg-white/10 text-white/50 border-none cursor-not-allowed" : "bg-accent text-white hover:bg-accent/90"
                )}
                onClick={handleClockAction}
                disabled={!isClockedIn}
              >
                <LogOut className="w-4 h-4" /> Clock Out
              </Button>
            </div>

            <div className="pt-4 border-t border-white/10">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/60 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Location Tracking
                </span>
                <Badge variant="outline" className="text-white border-white/30 bg-white/10">
                  Office - HQ
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="dashboard-card border-l-4 border-l-emerald-500">
            <CardHeader className="pb-2">
              <CardDescription>Working Hours</CardDescription>
              <CardTitle className="text-2xl">168.5h</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Current month performance
              </p>
            </CardContent>
          </Card>
          <Card className="dashboard-card border-l-4 border-l-accent">
            <CardHeader className="pb-2">
              <CardDescription>Days Present</CardDescription>
              <CardTitle className="text-2xl">22/24</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-accent" /> 2 days remaining this month
              </p>
            </CardContent>
          </Card>
          <Card className="dashboard-card border-l-4 border-l-primary">
            <CardHeader className="pb-2">
              <CardDescription>Late Arrivals</CardDescription>
              <CardTitle className="text-2xl">2</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1 text-rose-500">
                Keep it up! Lower than last month.
              </p>
            </CardContent>
          </Card>
          <Card className="dashboard-card border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardDescription>Overtime</CardDescription>
              <CardTitle className="text-2xl">12.4h</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Coffee className="w-3 h-3 text-amber-500" /> Eligible for compensatory leave
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="dashboard-card border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Your check-in/out logs for the past 30 days.</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarIcon className="w-4 h-4" /> Filter by Date
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-bold">Date</TableHead>
                <TableHead className="font-bold">Clock In</TableHead>
                <TableHead className="font-bold">Clock Out</TableHead>
                <TableHead className="font-bold">Total Hours</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceHistory.map((record) => (
                <TableRow key={record.id} className="hover:bg-accent/5 transition-colors">
                  <TableCell className="font-medium">{record.date}</TableCell>
                  <TableCell>{record.clockIn}</TableCell>
                  <TableCell>{record.clockOut || '--'}</TableCell>
                  <TableCell>{record.totalHours}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "font-medium",
                        record.status === 'On Time' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                        record.status === 'Late' && "bg-amber-50 text-amber-700 border-amber-200",
                        record.status === 'Absent' && "bg-rose-50 text-rose-700 border-rose-200"
                      )}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/5">
                      Details
                    </Button>
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