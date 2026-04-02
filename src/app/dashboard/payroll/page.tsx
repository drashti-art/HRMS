
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
  Loader2,
  Plus,
  Trash2,
  Calculator,
  UserPlus
} from 'lucide-react';
import { getSession, User, MOCK_USERS } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PayrollRecord {
  id: string;
  name: string;
  dept: string;
  base: number;
  bonus: number;
  deductions: number;
  status: 'Paid' | 'Processing';
  date: string;
}

const INITIAL_PAYROLL: PayrollRecord[] = [
  { id: 'p1', name: 'Jim Halpert', dept: 'Sales', base: 4500, bonus: 1200, deductions: 450, status: 'Paid', date: 'March 2024' },
  { id: 'p2', name: 'Pam Beesly', dept: 'Sales', base: 4200, bonus: 800, deductions: 420, status: 'Paid', date: 'March 2024' },
  { id: 'p3', name: 'Michael Scott', dept: 'Sales', base: 6500, bonus: 0, deductions: 650, status: 'Processing', date: 'March 2024' },
  { id: 'p4', name: 'Oscar Martinez', dept: 'Finance', base: 5500, bonus: 500, deductions: 550, status: 'Paid', date: 'March 2024' },
  { id: 'p5', name: 'Angela Martin', dept: 'Finance', base: 5200, bonus: 400, deductions: 520, status: 'Paid', date: 'March 2024' },
  { id: 'p6', name: 'Sarah Connor', dept: 'Executive', base: 12000, bonus: 5000, deductions: 1200, status: 'Paid', date: 'March 2024' },
  { id: 'p7', name: 'Kevin Malone', dept: 'Finance', base: 4000, bonus: 200, deductions: 400, status: 'Processing', date: 'March 2024' },
];

export default function PayrollPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [payrollList, setPayrollList] = useState<PayrollRecord[]>(INITIAL_PAYROLL);
  
  // Dialog States
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  
  // Add Entry Form State
  const [newEntry, setNewEntry] = useState({
    name: '',
    dept: 'Engineering',
    base: 5000,
    bonus: 0,
    deductions: 500
  });

  useEffect(() => {
    setUser(getSession());
  }, []);

  if (!user) return null;

  const isAdminOrHR = user.role === 'SuperAdmin' || user.role === 'Admin' || user.role === 'HR';

  const displayedPayroll = payrollList.filter(item => {
    const matchesRole = isAdminOrHR ? true : item.name === user.name;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.dept.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const pendingCount = payrollList.filter(p => p.status === 'Processing').length;
  const totalProcessingNet = payrollList
    .filter(p => p.status === 'Processing')
    .reduce((acc, curr) => acc + (curr.base + curr.bonus - curr.deductions), 0);

  const handleProcessSalaries = async () => {
    if (pendingCount === 0) {
      toast({
        title: "No pending salaries",
        description: "Everything for this month has been processed.",
      });
      return;
    }

    setProcessing(true);
    setIsProcessOpen(false);
    
    toast({ title: "Step 1/3: Verifying bank accounts...", description: "Ensuring all compliance checks pass." });
    await new Promise(r => setTimeout(r, 1500));
    
    toast({ title: "Step 2/3: Calculating tax withholdings...", description: "Finalizing regional tax reports." });
    await new Promise(r => setTimeout(r, 1500));
    
    toast({ title: "Step 3/3: Initiating transfers...", description: "Securely disbursing funds to accounts." });
    await new Promise(r => setTimeout(r, 1500));

    setPayrollList(prev => prev.map(p => ({ ...p, status: 'Paid' })));
    setProcessing(false);
    
    toast({
      title: "Payroll Successful",
      description: `Disbursed $${totalProcessingNet.toLocaleString()} to ${pendingCount} employees.`,
    });

    // Notify Dashboard
    const event = new CustomEvent('add-notification', {
      detail: {
        id: Math.random().toString(36).substr(2, 9),
        title: 'Payroll Completed',
        message: `Total disbursement of $${totalProcessingNet.toLocaleString()} finalized for March.`,
        time: 'Just now',
        read: false,
        type: 'success'
      }
    });
    window.dispatchEvent(event);
  };

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.name) return;

    const record: PayrollRecord = {
      id: 'p' + Math.random().toString(36).substr(2, 9),
      name: newEntry.name,
      dept: newEntry.dept,
      base: Number(newEntry.base),
      bonus: Number(newEntry.bonus),
      deductions: Number(newEntry.deductions),
      status: 'Processing',
      date: 'March 2024'
    };

    setPayrollList([record, ...payrollList]);
    setIsAddEntryOpen(false);
    setNewEntry({ name: '', dept: 'Engineering', base: 5000, bonus: 0, deductions: 500 });
    
    toast({ title: "Salary Record Added", description: `Pending payroll created for ${newEntry.name}.` });
  };

  const deleteEntry = (id: string) => {
    setPayrollList(prev => prev.filter(p => p.id !== id));
    toast({ variant: "destructive", title: "Record Deleted" });
  };

  const downloadPayslip = (record: PayrollRecord) => {
    toast({ title: "Generating Payslip", description: `Preparing document for ${record.name}...` });
    setTimeout(() => {
      const payslipHtml = `
        <html>
          <head>
            <title>Payslip - ${record.name}</title>
            <style>
              body { font-family: sans-serif; padding: 40px; }
              .header { border-bottom: 2px solid #2E2E6B; padding-bottom: 20px; margin-bottom: 30px; }
              .logo { font-size: 24px; font-weight: bold; color: #2E2E6B; }
              .details { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
              table { width: 100%; border-collapse: collapse; }
              th, td { text-align: left; padding: 12px; border-bottom: 1px solid #eee; }
              .total { background: #f8f9fa; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="logo">Banas Dairy</div>
              <h1>Salary Slip: ${record.date}</h1>
            </div>
            <div class="details">
              <div><strong>Name:</strong> ${record.name}</div>
              <div><strong>Dept:</strong> ${record.dept}</div>
            </div>
            <table>
              <tr><th>Description</th><th style="text-align: right;">Amount</th></tr>
              <tr><td>Base Salary</td><td style="text-align: right;">$${record.base.toLocaleString()}</td></tr>
              <tr><td>Bonus</td><td style="text-align: right;">$${record.bonus.toLocaleString()}</td></tr>
              <tr><td>Deductions</td><td style="text-align: right; color: red;">-$${record.deductions.toLocaleString()}</td></tr>
              <tr class="total"><td>Net Payable</td><td style="text-align: right;">$${(record.base + record.bonus - record.deductions).toLocaleString()}</td></tr>
            </table>
          </body>
        </html>
      `;
      const win = window.open('', '_blank');
      if (win) {
        win.document.write(payslipHtml);
        win.document.close();
        setTimeout(() => win.print(), 500);
      }
    }, 800);
  };

  const totalDisbursed = payrollList.reduce((acc, curr) => acc + (curr.base + curr.bonus - curr.deductions), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Payroll Management</h1>
          <p className="text-muted-foreground">Manage Banas Dairy salary cycles and individual payslips.</p>
        </div>
        {isAdminOrHR && (
          <div className="flex gap-3">
             <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => setIsAddEntryOpen(true)}
            >
              <UserPlus className="w-4 h-4" /> Add Salary Entry
            </Button>
            <Button 
              className="gap-2 shadow-lg" 
              onClick={() => setIsProcessOpen(true)}
              disabled={processing || pendingCount === 0}
            >
              {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              Process Monthly Payroll ({pendingCount})
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="dashboard-card border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase">Total Expenditure</p>
            <h3 className="text-2xl font-bold mt-1">${totalDisbursed.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2.4% from last month
            </p>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase">Avg Salary</p>
            <h3 className="text-2xl font-bold mt-1">$5,240</h3>
            <p className="text-[10px] text-muted-foreground mt-1">Based on {payrollList.length} employees</p>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase">Pending Disbursement</p>
            <h3 className="text-2xl font-bold mt-1">${totalProcessingNet.toLocaleString()}</h3>
            <p className="text-[10px] text-amber-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {pendingCount} records awaiting action
            </p>
          </CardContent>
        </Card>
        <Card className="dashboard-card border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <p className="text-xs font-bold text-muted-foreground uppercase">Compliance Status</p>
            <h3 className="text-2xl font-bold mt-1">100%</h3>
            <p className="text-[10px] text-emerald-600 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Tax reports generated
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle>Disbursement Records</CardTitle>
            <CardDescription>March 2024 Financial Cycle</CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search employee..." 
              className="pl-9 h-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow>
                <TableHead className="font-bold">Employee</TableHead>
                <TableHead className="font-bold">Dept</TableHead>
                <TableHead className="text-right font-bold">Base Pay</TableHead>
                <TableHead className="text-right font-bold">Bonus</TableHead>
                <TableHead className="text-right font-bold">Deduction</TableHead>
                <TableHead className="text-right font-bold">Net Payable</TableHead>
                <TableHead className="font-bold">Status</TableHead>
                <TableHead className="text-right font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedPayroll.map((record) => (
                <TableRow key={record.id} className="hover:bg-accent/5 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                        {record.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{record.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-[10px] h-5">{record.dept}</Badge>
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
                        "text-[10px] font-bold uppercase",
                        record.status === 'Paid' ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-primary" onClick={() => downloadPayslip(record)}>
                        <FileText className="w-3 h-3 mr-1" /> Slip
                      </Button>
                      {isAdminOrHR && record.status === 'Processing' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-600" onClick={() => deleteEntry(record.id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Entry Dialog */}
      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Add Salary Record
            </DialogTitle>
            <DialogDescription>
              Create a new payroll entry for the current cycle.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddEntry} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Employee Name</Label>
              <Input 
                placeholder="Full Name" 
                value={newEntry.name}
                onChange={(e) => setNewEntry({...newEntry, name: e.target.value})}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department</Label>
                <Input 
                  value={newEntry.dept}
                  onChange={(e) => setNewEntry({...newEntry, dept: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Base Salary</Label>
                <Input 
                  type="number"
                  value={newEntry.base}
                  onChange={(e) => setNewEntry({...newEntry, base: Number(e.target.value)})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bonus</Label>
                <Input 
                  type="number"
                  value={newEntry.bonus}
                  onChange={(e) => setNewEntry({...newEntry, bonus: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <Label>Deductions</Label>
                <Input 
                  type="number"
                  value={newEntry.deductions}
                  onChange={(e) => setNewEntry({...newEntry, deductions: Number(e.target.value)})}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" className="w-full">Save Entry</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Process Payroll Dialog */}
      <Dialog open={isProcessOpen} onOpenChange={setIsProcessOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-6 h-6 text-primary" />
              Process Monthly Payroll Run
            </DialogTitle>
            <DialogDescription>
              Review the total disbursement summary before initiating bank transfers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 overflow-hidden py-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase">Total Count</p>
                <p className="text-xl font-bold">{pendingCount} Staff</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                <p className="text-[10px] font-bold text-emerald-600 uppercase">Total Net Pay</p>
                <p className="text-xl font-bold text-emerald-700">${totalProcessingNet.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200 text-center">
                <p className="text-[10px] font-bold text-rose-600 uppercase">Tax Retention</p>
                <p className="text-xl font-bold text-rose-700">$1,050</p>
              </div>
            </div>

            <ScrollArea className="h-[250px] border rounded-lg">
              <Table>
                <TableHeader className="bg-secondary/30">
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead className="text-right">Net Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payrollList.filter(p => p.status === 'Processing').map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="text-sm font-medium">{record.name}</TableCell>
                      <TableCell className="text-right font-mono text-sm">
                        ${(record.base + record.bonus - record.deductions).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <Separator className="my-2" />
          
          <div className="bg-amber-50 p-3 rounded-lg flex items-start gap-2 border border-amber-200 mb-4">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              Once initiated, funds will be locked for disbursement. Ensure all bank details are verified in the System Settings.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessOpen(false)}>Cancel Run</Button>
            <Button className="gap-2" onClick={handleProcessSalaries}>
              Confirm & Disburse Funds
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
