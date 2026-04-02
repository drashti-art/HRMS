'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Filter, 
  Download,
  XCircle,
  Loader2,
  Trash2,
  Edit,
  User as UserIcon
} from 'lucide-react';
import { MOCK_USERS, Role, User } from '@/lib/auth';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';

export default function EmployeesPage() {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    designation: '',
    department: 'Engineering',
    role: 'Employee' as Role
  });

  const allDepartments = [
    'Engineering', 
    'Design', 
    'Marketing', 
    'Human Resources', 
    'Sales', 
    'Executive', 
    'Finance', 
    'Legal', 
    'Operations', 
    'Customer Support',
    'IT'
  ].sort();

  const roles: Role[] = ['SuperAdmin', 'Admin', 'HR', 'Manager', 'Employee'];

  const filteredEmployees = employees.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = selectedDepartment === 'all' || user.department === selectedDepartment;
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDepartment('all');
    setSelectedRole('all');
  };

  const hasActiveFilters = searchTerm !== '' || selectedDepartment !== 'all' || selectedRole !== 'all';

  const handleExport = () => {
    toast({
      title: "Exporting PDF",
      description: "Preparing employee records for PDF download...",
    });
    
    setTimeout(() => {
      const printContent = `
        <html>
          <head>
            <title>Employee Directory - WorkNest HR</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
              .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #2E2E6B; padding-bottom: 20px; margin-bottom: 30px; }
              .logo-text { font-size: 24px; font-weight: bold; color: #2E2E6B; }
              .title { font-size: 18px; color: #666; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th { background-color: #f8f9fa; text-align: left; padding: 12px; border-bottom: 1px solid #dee2e6; color: #2E2E6B; text-transform: uppercase; font-size: 11px; letter-spacing: 0.05em; }
              td { padding: 12px; border-bottom: 1px solid #eee; font-size: 13px; }
              .meta { font-size: 10px; color: #999; margin-top: 40px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo-text">WorkNest HR</div>
              <div class="title">Employee Directory Report</div>
            </div>
            <p>Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
            <p>Total Records: ${filteredEmployees.length}</p>
            <table>
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Joining Date</th>
                </tr>
              </thead>
              <tbody>
                ${filteredEmployees.map(emp => `
                  <tr>
                    <td style="font-weight: 600;">${emp.name}</td>
                    <td>${emp.email}</td>
                    <td>${emp.department}</td>
                    <td>${emp.designation}</td>
                    <td style="font-family: monospace;">${emp.joiningDate}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <div class="meta">
              WorkNest HR Management System • Confidential Organizational Document
            </div>
          </body>
        </html>
      `;
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(printContent);
        printWindow.document.close();
        
        // Give browser a moment to render content before printing
        setTimeout(() => {
          printWindow.print();
          toast({
            title: "Export Complete",
            description: `${filteredEmployees.length} records exported to PDF successfully.`,
          });
        }, 500);
      }
    }, 1200);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email) return;

    const employee: User = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEmployee,
      joiningDate: new Date().toISOString().split('T')[0]
    };

    setEmployees([employee, ...employees]);
    setIsAddDialogOpen(false);
    setNewEmployee({
      name: '',
      email: '',
      designation: '',
      department: 'Engineering',
      role: 'Employee'
    });

    toast({
      title: "Employee Added",
      description: `${newEmployee.name} has been added to the organization.`,
    });
  };

  const handleDeleteEmployee = (id: string, name: string) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast({
      variant: "destructive",
      title: "Employee Removed",
      description: `${name} has been removed from the organization.`,
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Employee Management</h1>
          <p className="text-muted-foreground">View and manage all organization personnel records.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExport}>
            <Download className="w-4 h-4" /> Export PDF
          </Button>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 shadow-sm">
                <Plus className="w-4 h-4" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Enter the details of the new organizational member here.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEmployee} className="space-y-4 pt-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    placeholder="John Doe" 
                    value={newEmployee.name}
                    onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@worknest.com" 
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dept">Department</Label>
                    <Select 
                      value={newEmployee.department} 
                      onValueChange={(v) => setNewEmployee({...newEmployee, department: v})}
                    >
                      <SelectTrigger id="dept">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {allDepartments.map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Role</Label>
                    <Select 
                      value={newEmployee.role} 
                      onValueChange={(v: Role) => setNewEmployee({...newEmployee, role: v})}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map(r => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="designation">Designation</Label>
                  <Input 
                    id="designation" 
                    placeholder="Senior Developer" 
                    value={newEmployee.designation}
                    onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})}
                  />
                </div>
                <DialogFooter className="pt-4">
                  <Button type="submit">Add Employee</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="dashboard-card border-none shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search name, email..." 
                className="pl-9 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="w-[180px]">
                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {allDepartments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-[180px]">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {hasActiveFilters && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={resetFilters}
                  className="text-muted-foreground hover:text-primary gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-secondary/50 overflow-hidden">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="font-bold">Employee</TableHead>
                  <TableHead className="font-bold">Designation</TableHead>
                  <TableHead className="font-bold">Department</TableHead>
                  <TableHead className="font-bold">Role</TableHead>
                  <TableHead className="font-bold">Joining Date</TableHead>
                  <TableHead className="text-right font-bold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((emp) => (
                    <TableRow key={emp.id} className="hover:bg-accent/5 transition-colors">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">{emp.name}</span>
                          <span className="text-xs text-muted-foreground">{emp.email}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{emp.designation}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-medium px-2 py-0">
                          {emp.department}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className="bg-primary/5 text-primary border-primary/20 font-medium px-2 py-0"
                        >
                          {emp.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground font-mono">
                        {emp.joiningDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-secondary/50">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <UserIcon className="w-4 h-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer">
                              <Edit className="w-4 h-4" /> Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                              onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                            >
                              <Trash2 className="w-4 h-4" /> Delete Employee
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                      No employees found matching the filters.
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
