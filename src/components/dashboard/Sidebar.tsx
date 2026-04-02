
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Role } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  FileText, 
  CreditCard, 
  Search, 
  Settings, 
  LogOut,
  ShieldAlert,
  BarChart3,
  UserCircle,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { clearSession } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface SidebarProps {
  role: Role;
}

interface NavItem {
  title: string;
  href: string;
  icon: any;
  roles: Role[];
}

const navItems: NavItem[] = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['SuperAdmin', 'Admin', 'HR', 'Manager', 'Employee'] },
  { title: 'Employees', href: '/dashboard/employees', icon: Users, roles: ['SuperAdmin', 'Admin', 'HR'] },
  { title: 'My Team', href: '/dashboard/team', icon: Users, roles: ['Manager'] },
  { title: 'Attendance', href: '/dashboard/attendance', icon: CalendarCheck, roles: ['SuperAdmin', 'Admin', 'HR', 'Manager', 'Employee'] },
  { title: 'Activities', href: '/dashboard/activities', icon: History, roles: ['SuperAdmin', 'Admin', 'HR', 'Manager', 'Employee'] },
  { title: 'Leaves', href: '/dashboard/leaves', icon: FileText, roles: ['SuperAdmin', 'Admin', 'HR', 'Manager', 'Employee'] },
  { title: 'Recruitment', href: '/dashboard/recruitment', icon: Search, roles: ['SuperAdmin', 'Admin', 'HR', 'Manager'] },
  { title: 'Payroll', href: '/dashboard/payroll', icon: CreditCard, roles: ['SuperAdmin', 'Admin', 'HR', 'Employee'] },
  { title: 'Performance', href: '/dashboard/performance', icon: BarChart3, roles: ['Manager', 'Employee'] },
  { title: 'Profile', href: '/dashboard/profile', icon: UserCircle, roles: ['Employee', 'Manager', 'HR', 'Admin', 'SuperAdmin'] },
  { title: 'System Settings', href: '/dashboard/settings', icon: Settings, roles: ['SuperAdmin'] },
  { title: 'Audit Logs', href: '/dashboard/logs', icon: ShieldAlert, roles: ['SuperAdmin'] },
];

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  return (
    <div className="flex flex-col h-full bg-card border-r w-64 shadow-sm">
      <div className="p-6 flex items-center gap-3 border-b">
        <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white p-1">
          <Image 
            src="https://www.banasdairy.coop/Content/assets/img/logo/banas_logo2.png" 
            alt="Banas Logo" 
            fill 
            className="object-contain"
          />
        </div>
        <span className="font-bold text-xl text-primary tracking-tight">Banas Dairy</span>
      </div>
      
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {filteredNavItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group",
              pathname === item.href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground hover:bg-secondary hover:text-primary"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5",
              pathname === item.href ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
            )} />
            {item.title}
          </Link>
        ))}
      </div>

      <div className="p-4 border-t">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </div>
    </div>
  );
}
