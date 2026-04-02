'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  CreditCard, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  FileText,
  Loader2
} from 'lucide-react';
import { getSession, User } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const MOCK_PAYROLL_DATA = [
  { id: 'p1', name: 'Jim Halpert', dept: 'Sales', base: 4500, bonus: 1200, deductions: 450, status: 'Paid', date: 'March 2024' },
  { id: 'p2', name: 'Pam Beesly', dept: 'Sales', base: 4200, bonus: 800, deductions: 420, status: 'Paid', date: 'March 2024' },
  { id: 'p3', name: 'Michael Scott', dept: 'Sales', base: 6500, bonus: 0, deductions: 650, status: 'Processing', date: 'March 2024' },
  { id: 'p4', name: 'Oscar Martinez', dept: 'Finance', base: 5500, bonus: 500, deductions: 550, status: 'Paid', date: 'March 2024' },
  { id: 'p5', name: 'Angela Martin', dept: 'Finance', base: 5200, bonus: 400, deductions: 520, status: 'Paid', date: 'March 2024' },
  { id: 'p6', name: 'Sarah Connor', dept: 'Executive', base: 12000, bonus: 5000, deductions: 1200, status: 'Paid', date: 'March 2024' },
];

export default function PayrollPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [payrollList, setPayrollList] = useState(MOCK_PAYROLL_DATA);

  useEffect(() => {
    setUser(getSession());
  }, []);

  if (!user) return null;

  const isAdminOrHR = user.role === 'SuperAdmin' || user.role === 'Admin' || user.role === 'HR';

  // Filter payroll based on role and search term
  const displayedPayroll = payrollList.filter(item => {
    const matchesRole = isAdminOrHR ? true : item.name === user.name;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.dept.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const handleProcessPayroll = () => {
    setProcessing(true);
    setTimeout(() => {
      setPayrollList(prev => prev.map(p => ({ ...p, status: 'Paid' })));
      setProcessing(false);
      toast({
        title: "Payroll Processed",
        description: "All pending salaries for the current month have been disbursed.",
      });
    }, 2000);
  };

  const downloadPayslip = (record: typeof MOCK_PAYROLL_DATA[0]) => {
    toast({
      title: "Generating Payslip",
      description: `Preparing professional payslip for ${record.name}...`,
    });

    setTimeout(() => {
      const payslipHtml = `
        <html>
          <head>
            <title>Payslip - ${record.name} - ${record.date}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; color: #333; }
              .header { display: flex; justify-content: space-between; border-bottom: 2px solid #2E2E6B; padding-bottom: 20px; }
              .logo { font-size: 24px; font-weight: bold; color: #2E2E6B; }
              .title { font-size: 18px; color: #666; }
              .details { margin-top: 30px; display: grid; grid-template-cols: 1fr 1fr; gap: 20px; }
              .section-title { font-weight: bold; text-transform: uppercase; font-size: 12px; color: #2E2E6B; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
              .total-row { background: #f8f9fa; font-weight: bold; }
              .footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">WorkNest HR</div>
              <div class="title">Payslip: ${record.date}</div>
            </div>
            <div class="details">
              <div>
                <div class="section-title">Employee Information</div>
                <p><strong>Name:</strong> ${record.name}</p>
                <p><strong>Department:</strong> ${record.dept}</p>
                <p><strong>Employee ID:</strong> EMP-${record.id.toUpperCase()}</p>
              </div>
              <div>
                <div class="section-title">Payment Details</div>
                <p><strong>Status:</strong> ${record.status}</p>
                <p><strong>Pay Period:</strong> 01-31 ${record.date}</p>
                <p><strong>Method:</strong> Bank Transfer</p>
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td style="text-align: right;">$${record.base.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Allowances / Bonus</td>
                  <td style="text-align: right;">$${record.bonus.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Deductions (Tax/Insurance)</td>
                  <td style="text-align: right; color: #e11d48;">-$${record.deductions.toLocaleString()}</td>
                </tr>
                <tr class="total-row">
                  <td>Net Payable</td>
                  <td style="text-align: right;">$${(record.base + record.bonus - record.deductions).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div class="footer">
              WorkNest HR Management System • Confidential Payroll Document • Generated on ${new Date().toLocaleDateString()}
            </div>
          </body>
        </html>
      `;
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(payslipHtml);
        win.document.close();
        setTimeout(() => win.print(), 500);
      }
    }, 1000);
  };

  const totalDisbursed = payrollList.reduce((acc, curr) => acc + curr.base + curr.bonus - curr.deductions, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary font-headline">Payroll Management</h1>
          <p className="text-muted-foreground">
            {isAdminOrHR 
              ? "Oversee organizational disbursements and financial records." 
              : "Review your salary history and download payslips."}
          </p>
        </div>
        {isAdminOrHR && (
          <Button className="gap-2 shadow-lg" onClick={handleProcessPayroll} disabled={processing}>
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
            Process Monthly Payroll
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase">Total Disbursed</p>
            <CardTitle className="text-2xl">${totalDisbursed.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-emerald-500 text-xs">
              <TrendingUp className="w-3 h-3" /> 4.2% from last month
            </div>
          </CardContent>
        </Card>
        
        <Card className="dashboard-card border-l-4 border-l-accent">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase">Taxes & Deductions</p>
            <CardTitle className="text-2xl">$4,280</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">March 2024 compliance</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase">Pending Payments</p>
            <CardTitle className="text-2xl">{payrollList.filter(p => p.status === 'Processing').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="dashboard-card border-l-4 border-l-emerald-500">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-muted-foreground uppercase">Net Pay (Avg)</p>
            <CardTitle className="text-2xl">$5,120</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Per employee average</p>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card border-none shadow-lg">
        <CardHeader className="pb-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>Records for the current financial cycle.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search records..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/20">
                <TableRow>
                  <TableHead className="font-bold">Employee</TableHead>
                  <TableHead className="font-bold">Department</TableHead>
                  <TableHead className="font-bold text-right">Base Salary</TableHead>
                  <TableHead className="font-bold text-right">Bonus</TableHead>
                  <TableHead className="font-bold text-right">Deductions</TableHead>
                  <TableHead className="font-bold text-right">Net Pay</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="text-right font-bold">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedPayroll.length > 0 ? (
                  displayedPayroll.map((record) => (
                    <TableRow key={record.id} className="hover:bg-accent/5 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                            {record.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{record.name}</p>
                            <p className="text-[10px] text-muted-foreground">{record.date}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] font-medium uppercase">{record.dept}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm font-mono">${record.base.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-mono text-emerald-600">+${record.bonus.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-mono text-rose-600">-${record.deductions.toLocaleString()}</TableCell>
                      <TableCell className="text-right text-sm font-bold font-mono">
                        ${(record.base + record.bonus - record.deductions).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "font-bold text-[10px] uppercase",
                            record.status === 'Paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                          )}
                        >
                          {record.status === 'Paid' ? <CheckCircle2 className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 text-xs text-primary gap-2 hover:bg-primary/5"
                          onClick={() => downloadPayslip(record)}
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Payslip
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                      No payroll records found matching your search.
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
