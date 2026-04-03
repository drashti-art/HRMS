
'use client';

import { useState, useEffect } from 'react';
import { getSession, User } from '@/lib/auth';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Calendar as CalendarIcon,
  User as UserIcon,
  Monitor,
  Activity,
  AlertTriangle,
  Lock,
  Info,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  module: string;
  ipAddress: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Success' | 'Failed';
}

const MOCK_LOGS: AuditLog[] = [
  { id: 'log-1', timestamp: '2024-03-15 10:45:22', user: 'Rekhaben Chaudhary', action: 'Modified System Security Policy', module: 'Settings', ipAddress: '192.168.1.45', severity: 'High', status: 'Success' },
  { id: 'log-2', timestamp: '2024-03-15 09:12:05', user: 'Bharatbhai Chaudhary', action: 'User Login Attempt', module: 'Auth', ipAddress: '10.0.0.12', severity: 'Low', status: 'Success' },
  { id: 'log-3', timestamp: '2024-03-14 23:55:10', user: 'System', action: 'Automated Database Backup', module: 'System', ipAddress: 'Localhost', severity: 'Low', status: 'Success' },
  { id: 'log-4', timestamp: '2024-03-14 18:30:45', user: 'Shankarbhai Chaudhary', action: 'Failed Payroll Approval', module: 'Payroll', ipAddress: '172.16.254.1', severity: 'Medium', status: 'Failed' },
  { id: 'log-5', timestamp: '2024-03-14 14:20:00', user: 'Pinkiben Chaudhary', action: 'Deleted Employee Record #882', module: 'Employees', ipAddress: '192.168.1.102', severity: 'Critical', status: 'Success' },
  { id: 'log-6', timestamp: '2024-03-13 11:15:33', user: 'Rekhaben Chaudhary', action: 'Bulk Permission Update', module: 'Security', ipAddress: '192.168.1.45', severity: 'High', status: 'Success' },
  { id: 'log-7', timestamp: '2024-03-13 08:00:12', user: 'Admin Account', action: 'API Key Rotated', module: 'Security', ipAddress: '45.76.12.99', severity: 'High', status: 'Success' },
  { id: 'log-8', timestamp: '2024-03-12 16:45:55', user: 'Karshanbhai Chaudhary', action: 'Accessed Personnel Files', module: 'HR', ipAddress: '192.168.1.15', severity: 'Medium', status: 'Success' },
];

export default function AuditLogsPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [logs, setLogs] = useState<AuditLog[]>(MOCK_LOGS);

  useEffect(() => {
    setUser(getSession());
  }, []);

  if (!user || user.role !== 'SuperAdmin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Lock className="w-12 h-12 text-destructive opacity-20" />
        <h2 className="text-xl font-bold">Access Restricted</h2>
        <p className="text-muted-foreground text-center max-w-sm">
          You do not have the required permissions to view system audit logs. This page is restricted to Super Administrators at Banas Dairy.
        </p>
      </div>
    );
  }

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDate = !selectedDate || log.timestamp.includes(format(selectedDate, "yyyy-MM-dd"));
    
    return matchesSearch && matchesDate;
  });

  const handleExport = () => {
    toast({
      title: "Generating Audit Report",
      description: "Compressing logs into CSV format for download...",
    });

    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Timestamp,User,Action,Module,IP Address,Severity,Status\n"
        + filteredLogs.map(l => `${l.timestamp},${l.user},${l.action},${l.module},${l.ipAddress},${l.severity},${l.status}`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Export Complete",
        description: `${filteredLogs.length} security events have been exported successfully.`,
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-3">
            <ShieldAlert className="w-8 h-8" /> System Audit Logs
          </h1>
          <p className="text-muted-foreground">Monitor and investigate all administrative actions across the Banas Dairy platform.</p>
        </div>
        <div className="flex gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className={cn("gap-2", selectedDate && "border-primary text-primary")}>
                <CalendarIcon className="w-4 h-4" /> 
                {selectedDate ? format(selectedDate, "PPP") : "Filter Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {selectedDate && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedDate(undefined)}
              className="text-muted-foreground hover:text-destructive"
              title="Clear Date Filter"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}

          <Button variant="default" className="gap-2" onClick={handleExport} disabled={filteredLogs.length === 0}>
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div className="space-y-1">
            <CardTitle>Security Events</CardTitle>
            <CardDescription>Real-time stream of authenticated system operations at HQ.</CardDescription>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search user, action or module..." 
              className="pl-9 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-bold">Timestamp</TableHead>
                <TableHead className="font-bold">User</TableHead>
                <TableHead className="font-bold">Action</TableHead>
                <TableHead className="font-bold">Module</TableHead>
                <TableHead className="font-bold">Severity</TableHead>
                <TableHead className="font-bold">Source IP</TableHead>
                <TableHead className="text-right font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-accent/5 transition-colors">
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-3 h-3 text-muted-foreground" />
                        <span className="font-medium text-sm">{log.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px] truncate" title={log.action}>
                      {log.action}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px] h-5">
                        {log.module}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[10px] font-bold uppercase h-5",
                          log.severity === 'Critical' && "bg-rose-500 text-white border-none",
                          log.severity === 'High' && "bg-rose-100 text-rose-700 border-rose-200",
                          log.severity === 'Medium' && "bg-amber-100 text-amber-700 border-amber-200",
                          log.severity === 'Low' && "bg-emerald-100 text-emerald-700 border-emerald-200"
                        )}
                      >
                        {log.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {log.status === 'Success' ? (
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        )}
                        <span className={cn(
                          "text-xs font-bold",
                          log.status === 'Success' ? "text-emerald-600" : "text-rose-600"
                        )}>
                          {log.status}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Info className="w-8 h-8 opacity-20" />
                      <p>No security events matching your criteria were found.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
