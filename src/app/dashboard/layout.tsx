'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, User } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Bell, Search, User as UserIcon, Check, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Leave Approved',
    message: 'Your annual leave request for April has been approved by HR.',
    time: '5m ago',
    read: false,
    type: 'success',
  },
  {
    id: '2',
    title: 'Payroll Updated',
    message: 'The payroll for March 2024 has been successfully processed.',
    time: '2h ago',
    read: false,
    type: 'info',
  },
  {
    id: '3',
    title: 'New Job Opening',
    message: 'A new Senior Frontend Developer position has been posted.',
    time: '1d ago',
    read: true,
    type: 'info',
  },
  {
    id: '4',
    title: 'Security Alert',
    message: 'Unusual login attempt detected on your account from a new device.',
    time: '2d ago',
    read: true,
    type: 'warning',
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session);
    }
  }, [router]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar role={user.role} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b bg-white px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search anything..." 
                className="pl-9 bg-secondary/50 border-none h-9 w-full md:w-[300px] lg:w-[400px]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative hover:bg-secondary/50 transition-colors">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-destructive rounded-full border-2 border-white animate-pulse" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0 mr-4 mt-2 shadow-2xl border-none rounded-xl overflow-hidden" align="end">
                <div className="p-4 bg-primary text-white flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-none text-[10px] h-4">
                        {unreadCount} New
                      </Badge>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-[10px] h-6 text-white hover:bg-white/10 p-1"
                      onClick={markAllAsRead}
                    >
                      Mark all read
                    </Button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground flex flex-col items-center gap-2">
                      <Bell className="w-8 h-8 opacity-20" />
                      <p className="text-xs">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className={cn(
                          "p-4 border-b last:border-none hover:bg-secondary/10 cursor-pointer transition-colors flex gap-3",
                          !n.read && "bg-accent/5 border-l-4 border-l-accent"
                        )}
                        onClick={() => markAsRead(n.id)}
                      >
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                          n.type === 'success' && "bg-emerald-100 text-emerald-600",
                          n.type === 'info' && "bg-blue-100 text-blue-600",
                          n.type === 'warning' && "bg-amber-100 text-amber-600",
                        )}>
                          {n.read ? <Check className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div className="space-y-1">
                          <p className={cn("text-xs font-bold leading-none", !n.read ? "text-primary" : "text-muted-foreground")}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-muted-foreground leading-snug">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-muted-foreground/60 pt-1">
                            {n.time}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {notifications.length > 0 && (
                  <div className="p-3 border-t bg-secondary/10 text-center">
                    <Button variant="ghost" size="sm" className="w-full text-[10px] h-6 text-primary font-bold hover:bg-secondary/50">
                      View Notification Center
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 h-4">
                  {user.role}
                </Badge>
              </div>
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:opacity-90 transition-opacity">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
