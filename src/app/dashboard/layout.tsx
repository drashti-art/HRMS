'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, User, clearSession } from '@/lib/auth';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Bell, Search, User as UserIcon, Check, Clock, LogOut, Settings, UserCircle, Sparkles, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';
import { aiHrAssistant } from '@/ai/flows/ai-hr-assistant';
import { ScrollArea } from '@/components/ui/scroll-area';

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
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  
  // AI Assistant States
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessages, setAiMessages] = useState<{role: 'user' | 'ai', content: string}[]>([]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push('/login');
    } else {
      setUser(session);
    }

    const handleNewNotification = (event: any) => {
      if (event.detail) {
        setNotifications(prev => [event.detail, ...prev]);
      }
    };

    window.addEventListener('add-notification', handleNewNotification);
    return () => window.removeEventListener('add-notification', handleNewNotification);
  }, [router]);

  const handleAiAssistant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery || !user) return;

    const currentQuery = aiQuery;
    setAiQuery('');
    setAiMessages(prev => [...prev, { role: 'user', content: currentQuery }]);
    setAiLoading(true);

    try {
      const result = await aiHrAssistant({
        query: currentQuery,
        userRole: user.role,
        userName: user.name
      });
      setAiMessages(prev => [...prev, { role: 'ai', content: result.answer }]);
    } catch (error) {
      setAiMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting to the system right now. Please try again later." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleLogout = () => {
    clearSession();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
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
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={cn(
                        "p-4 border-b last:border-none hover:bg-secondary/10 cursor-pointer transition-colors flex gap-3",
                        !n.read && "bg-accent/5 border-l-4 border-l-accent"
                      )}
                      onClick={() => markAsRead(n.id)}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white",
                        n.type === 'success' && "bg-emerald-500",
                        n.type === 'info' && "bg-blue-500",
                        n.type === 'warning' && "bg-amber-500",
                      )}>
                        {n.read ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
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
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 pl-4 border-l cursor-pointer hover:bg-secondary/20 transition-colors py-1 px-2 rounded-lg">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold text-foreground leading-none">{user.name}</p>
                    <Badge variant="secondary" className="text-[9px] uppercase font-bold px-1.5 h-3.5 mt-1">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-white font-bold shrink-0 shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-1 rounded-xl shadow-xl" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => router.push('/dashboard/profile')}>
                  <UserCircle className="w-4 h-4" /> My Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 relative">
          {children}
        </main>
      </div>

      {/* AI Assistant Floating Interface */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isAiOpen && (
          <div className="w-[380px] h-[500px] bg-white rounded-2xl shadow-2xl border flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            <div className="p-4 bg-primary text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-white/20 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold leading-none">WorkNest AI</h4>
                  <p className="text-[10px] text-white/70">Always online Assistant</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={() => setIsAiOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="bg-secondary/40 p-3 rounded-2xl rounded-tl-none max-w-[85%]">
                    <p className="text-sm leading-relaxed">
                      Hello {user.name}! I'm your WorkNest AI assistant. How can I help you today?
                    </p>
                  </div>
                </div>

                {aiMessages.map((msg, i) => (
                  <div key={i} className={cn("flex gap-2", msg.role === 'user' && "flex-row-reverse")}>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                      msg.role === 'user' ? "bg-primary text-white" : "bg-secondary"
                    )}>
                      {msg.role === 'user' ? <UserIcon className="w-4 h-4" /> : <Sparkles className="w-4 h-4 text-primary" />}
                    </div>
                    <div className={cn(
                      "p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed",
                      msg.role === 'user' 
                        ? "bg-primary text-white rounded-tr-none" 
                        : "bg-secondary/40 rounded-tl-none"
                    )}>
                      {msg.content}
                    </div>
                  </div>
                ))}

                {aiLoading && (
                  <div className="flex gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="bg-secondary/40 p-3 rounded-2xl rounded-tl-none">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <form onSubmit={handleAiAssistant} className="p-4 border-t shrink-0">
              <div className="flex gap-2">
                <Input 
                  placeholder="Ask anything..." 
                  className="rounded-full bg-secondary/50 border-none px-4"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  disabled={aiLoading}
                />
                <Button type="submit" size="icon" className="rounded-full shrink-0" disabled={aiLoading || !aiQuery}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        )}
        
        <Button 
          size="lg" 
          className={cn(
            "rounded-full h-14 w-14 shadow-2xl transition-all duration-300 hover:scale-105",
            isAiOpen ? "rotate-90 bg-destructive hover:bg-destructive/90" : "bg-primary"
          )}
          onClick={() => setIsAiOpen(!isAiOpen)}
        >
          {isAiOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        </Button>
      </div>
    </div>
  );
}
