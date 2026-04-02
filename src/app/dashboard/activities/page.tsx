'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, History, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MOCK_ACTIVITIES = [
  { id: '1', user: "Sarah Connor", action: "Approved leave for John Smith", time: "2 hours ago", type: "Leave", status: "Completed" },
  { id: '2', user: "Michael Scott", action: "Posted new job opening: Senior Developer", time: "4 hours ago", type: "Recruitment", status: "Active" },
  { id: '3', user: "Jim Halpert", action: "Clocked in successfully", time: "6 hours ago", type: "Attendance", status: "Success" },
  { id: '4', user: "Jane Smith", action: "Updated payroll for March", time: "1 day ago", type: "Payroll", status: "Completed" },
  { id: '5', user: "Sarah Connor", action: "Changed system settings", time: "1 day ago", type: "System", status: "Completed" },
  { id: '6', user: "Dwight Schrute", action: "Requested annual leave", time: "2 days ago", type: "Leave", status: "Pending" },
  { id: '7', user: "Pam Beesly", action: "Submitted performance review", time: "2 days ago", type: "Performance", status: "Submitted" },
  { id: '8', user: "Kevin Malone", action: "Clocked out successfully", time: "3 days ago", type: "Attendance", status: "Success" },
  { id: '9', user: "Angela Martin", action: "Validated expense reports", time: "3 days ago", type: "Finance", status: "Completed" },
  { id: '10', user: "Stanley Hudson", action: "Started training module", time: "4 days ago", type: "Training", status: "In Progress" },
];

export default function ActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredActivities = MOCK_ACTIVITIES.filter(activity => 
    activity.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-primary">Activity History</h1>
        <p className="text-muted-foreground">Detailed log of all actions performed across the platform.</p>
      </div>

      <Card className="dashboard-card border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Filter activities..." 
                className="pl-9 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" /> Filter by Type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-secondary/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="font-bold">User</TableHead>
                  <TableHead className="font-bold">Action</TableHead>
                  <TableHead className="font-bold">Type</TableHead>
                  <TableHead className="font-bold">Time</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredActivities.map((activity) => (
                  <TableRow key={activity.id} className="hover:bg-accent/5 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          {activity.user.charAt(0)}
                        </div>
                        <span className="font-medium">{activity.user}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{activity.action}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium">
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {activity.time}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        {activity.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
