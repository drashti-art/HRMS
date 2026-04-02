'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter,
  Calendar,
  User as UserIcon,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getSession, User } from '@/lib/auth';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const INITIAL_LEAVES = [
  { id: '1', employee: "John Smith", type: "Annual Leave", start: "2024-03-20", end: "2024-03-25", days: 5, status: "Pending", reason: "Family vacation" },
  { id: '2', employee: "Alice Brown", type: "Sick Leave", start: "2024-03-15", end: "2024-03-16", days: 1, status: "Pending", reason: "Medical appointment" },
  { id: '3', employee: "Bob Wilson", type: "Personal Leave", start: "2024-03-10", end: "2024-03-10", days: 1, status: "Approved", reason: "Personal work" },
  { id: '4', employee: "Charlie Davis", type: "Annual Leave", start: "2024-04-05", end: "2024-04-12", days: 7, status: "Pending", reason: "Home renovation" },
  { id: '5', employee: "Diana Prince", type: "Maternity Leave", start: "2024-05-01", end: "2024-08-01", days: 90, status: "Approved", reason: "Maternity" },
  { id: '6', employee: "Edward Norton", type: "Sick Leave", start: "2024-03-01", end: "2024-03-03", days: 2, status: "Rejected", reason: "Insufficient notice" },
];

export default function LeavesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [user, setUser] = useState<User | null>(null);
  const [leaves, setLeaves] = useState(INITIAL_LEAVES);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newLeave, setNewLeave] = useState({
    type: 'Annual Leave',
    start: '',
    end: '',
    reason: ''
  });

  useEffect(() => {
    setUser(getSession());
  }, []);

  const filteredLeaves = leaves.filter(leave => {
    const matchesSearch = leave.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         leave.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = activeTab === 'all' || leave.status.toLowerCase() === activeTab;
    return matchesSearch && matchesStatus;
  });

  const handleAction = (id: string, action: 'Approved' | 'Rejected') => {
    setLeaves(prev => prev.map(leave => 
      leave.id === id ? { ...leave, status: action } : leave
    ));

    toast({
      title: `Request ${action}`,
      description: `Leave request for employee has been ${action.toLowerCase()}.`,
    });
  };

  const handleRequestLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.start || !newLeave.end || !newLeave.reason) return;

    // Simple day calculation (difference between dates)
    const startDate = new Date(newLeave.start);
    const endDate = new Date(newLeave.end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const request = {
      id: Math.random().toString(36).substr(2, 9),
      employee: user?.name || "Current User",
      type: newLeave.type,
      start: newLeave.start,
      end: newLeave.end,
      days: diffDays,
      status: "Pending",
      reason: newLeave.reason
    };

    setLeaves([request, ...leaves]);
    setIsDialogOpen(false);
    setNewLeave({ type: 'Annual Leave', start: '', end: '', reason: '' });

    toast({
      title: "Request Submitted",
      description: "Your leave request has been sent for approval.",
    });
  };

  const isAdminOrSuperAdmin = user?.role === 'SuperAdmin' || user?.role === 'Admin';

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Leaves & Approvals</h1>
          <p className="text-muted-foreground">Manage and review employee time-off requests.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Calendar className="w-4 h-4" /> Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Request Time Off</DialogTitle>
              <DialogDescription>
                Fill in the details below to submit a new leave request.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleRequestLeave} className="space-y-4 pt-4">
              <div className="grid gap-2">
                <Label htmlFor="leaveType">Leave Type</Label>
                <Select 
                  value={newLeave.type} 
                  onValueChange={(v) => setNewLeave({...newLeave, type: v})}
                >
                  <SelectTrigger id="leaveType">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Personal Leave">Personal Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Study Leave">Study Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start">Start Date</Label>
                  <Input 
                    id="start" 
                    type="date" 
                    value={newLeave.start}
                    onChange={(e) => setNewLeave({...newLeave, start: e.target.value})}
                    required 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end">End Date</Label>
                  <Input 
                    id="end" 
                    type="date" 
                    value={newLeave.end}
                    onChange={(e) => setNewLeave({...newLeave, end: e.target.value})}
                    required 
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <textarea 
                  id="reason"
                  className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  placeholder="e.g. Family vacation, medical appointment..."
                  value={newLeave.reason}
                  onChange={(e) => setNewLeave({...newLeave, reason: e.target.value})}
                  required
                />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!isAdminOrSuperAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending</p>
                  <h3 className="text-2xl font-bold">14</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-full">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Approved</p>
                  <h3 className="text-2xl font-bold text-emerald-700">85</h3>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-rose-50 border-rose-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-rose-100 rounded-full">
                  <XCircle className="w-6 h-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rejected</p>
                  <h3 className="text-2xl font-bold text-rose-700">12</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="dashboard-card border-none shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full md:w-auto">
              <TabsList>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="all">All Requests</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search employee..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="font-bold">Employee</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Duration</TableHead>
                  <TableHead className="font-bold">Days</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeaves.length > 0 ? (
                  filteredLeaves.map((leave) => (
                    <TableRow key={leave.id} className="hover:bg-accent/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {leave.employee.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{leave.employee}</p>
                            <p className="text-xs text-muted-foreground">{leave.reason}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{leave.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm font-mono text-muted-foreground">
                        {leave.start} to {leave.end}
                      </TableCell>
                      <TableCell className="font-semibold">{leave.days}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "font-medium",
                            leave.status === 'Pending' && "bg-amber-50 text-amber-700 border-amber-200",
                            leave.status === 'Approved' && "bg-emerald-50 text-emerald-700 border-emerald-200",
                            leave.status === 'Rejected' && "bg-rose-50 text-rose-700 border-rose-200"
                          )}
                        >
                          {leave.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {leave.status === 'Pending' ? (
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => handleAction(leave.id, 'Approved')}
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                              onClick={() => handleAction(leave.id, 'Rejected')}
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button variant="ghost" size="sm" disabled>
                            Finalized
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No leave requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
