
'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, MoreHorizontal, Filter, Download } from 'lucide-react';
import { MOCK_USERS } from '@/lib/auth';

export default function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Employee Management</h1>
          <p className="text-muted-foreground">View and manage all organization personnel records.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Add Employee
          </Button>
        </div>
      </div>

      <Card className="dashboard-card">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search name, email, department..." 
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="gap-2">
                <Filter className="w-4 h-4" /> Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joining Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">{emp.name}</span>
                      <span className="text-xs text-muted-foreground">{emp.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{emp.designation}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">{emp.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{emp.role}</Badge>
                  </TableCell>
                  <TableCell>{emp.joiningDate}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="w-4 h-4" />
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
