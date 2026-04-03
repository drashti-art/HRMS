
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
  { id: 'p1', name: 'Hiteshbhai Chaudhary', dept: 'Sales', base: 45000, bonus: 5000, deductions: 2500, status: 'Paid', date: 'March 2024' },
  { id: 'p2', name: 'Manishaben Chaudhary', dept: 'Sales', base: 42000, bonus: 3000, deductions: 2200, status: 'Paid', date: 'March 2024' },
  { id: 'p3', name: 'Shankarbhai Chaudhary', dept: 'Sales', base: 65000, bonus: 0, deductions: 5000, status: 'Processing', date: 'March 2024' },
  { id: 'p4', name: 'Valabhai Chaudhary', dept: 'Finance', base: 55000, bonus: 4000, deductions: 3500, status: 'Paid', date: 'March 2024' },
  { id: 'p5', name: 'Sitaben Chaudhary', dept: 'Finance', base: 52000, bonus: 3500, deductions: 3200, status: 'Paid', date: 'March 2024' },
  { id: 'p6', name: 'Rekhaben Chaudhary', dept: 'Executive', base: 120000, bonus: 25000, deductions: 15000, status: 'Paid', date: 'March 2024' },
  { id: 'p7', name: 'Ashokbhai Chaudhary', dept: 'Finance', base: 40000, bonus: 1500, deductions: 2000, status: 'Processing', date: 'March 2024' },
];

export default function PayrollPage() {
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [payrollList, setPayrollList] = useState<PayrollRecord[]>(INITIAL_PAYROLL);
  
  const [isProcessOpen, setIsProcessOpen] = useState(false);
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  
  const [newEntry, setNewEntry] = useState({
    name: '',
    dept: 'Engineering',
    base: 50000,
    bonus: 0,
    deductions: 3000
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
    if (pendingCount === 0) return;

    setProcessing(true);
    setIsProcessOpen(false);
    
    toast({ title: "Step 1/3: Verifying bank accounts...", description: "Ensuring all compliance checks pass." });
    await new Promise(r => setTimeout(r, 1000));
    
    toast({ title: "Step 2/3: Calculating tax withholdings...", description: "Finalizing regional tax reports." });
    await new Promise(r => setTimeout(r, 1000));
    
    toast({ title: "Step 3/3: Initiating transfers...", description: "Securely disbursing funds to accounts." });
    await new Promise(r => setTimeout(r, 1000));

    setPayrollList(prev => prev.map(p => ({ ...p, status: 'Paid' })));
    setProcessing(false);
    
    toast({
      title: "Payroll Successful",
      description: `Disbursed ₹${totalProcessingNet.toLocaleString()} to ${pendingCount} employees.`,
    });
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
    setNewEntry({ name: '', dept: 'Engineering', base: 50000, bonus: 0, deductions: 3000 });
    
    toast({ title: "Salary Record Added", description: `Pending payroll created for ${newEntry.name}.` });
  };

  const deleteEntry = (id: string) => {
    setPayrollList(prev => prev.filter(p => p.id !== id));
    toast({ variant: "destructive", title: "Record Deleted" });
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

      <Card className="dashboard-card">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
          <div>
            <CardTitle>Disbursement Records</CardTitle>
            <CardDescription>March 2024 Financial Cycle (INR)</CardDescription>
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
                  <TableCell className="text-right text-sm font-mono">₹{record.base.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm font-mono text-emerald-600">+₹{record.bonus.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm font-mono text-rose-600">-₹{record.deductions.toLocaleString()}</TableCell>
                  <TableCell className="text-right text-sm font-bold font-mono">
                    ₹{(record.base + record.bonus - record.deductions).toLocaleString()}
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
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-primary">
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
    </div>
  );
}
