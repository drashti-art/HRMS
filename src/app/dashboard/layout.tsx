
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, User } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Bell, Search, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session);
    }
  }, [router]);

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
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-foreground">{user.name}</p>
                <Badge variant="secondary" className="text-[10px] uppercase font-bold px-1.5 h-4">
                  {user.role}
                </Badge>
              </div>
              <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold">
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
