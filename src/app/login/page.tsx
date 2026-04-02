'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MOCK_USERS, setSession, Role } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import { Building2, ShieldCheck, Briefcase, UserCircle, Users } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const user = MOCK_USERS.find(u => u.email === email);
    
    setTimeout(() => {
      if (user && password === 'password') {
        setSession(user);
        toast({
          title: "Login Successful",
          description: `Welcome back, ${user.name}!`,
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials. Use a mock email and 'password'.",
        });
      }
      setLoading(false);
    }, 800);
  };

  const quickLogin = (role: Role) => {
    const user = MOCK_USERS.find(u => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword('password');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="relative w-24 h-24 overflow-hidden rounded-2xl bg-white shadow-lg p-2">
              <Image 
                src="https://www.banasdairy.coop/Content/assets/img/logo/banas_logo2.png" 
                alt="Banas Logo" 
                fill 
                className="object-contain"
              />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">WorkNest HR</h1>
          <p className="text-muted-foreground">The all-in-one HR Management System</p>
        </div>

        <Card className="shadow-xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@worknest.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Authenticating..." : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Demo Quick Access</span>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-2 w-full">
              <Button variant="outline" size="icon" title="Super Admin" onClick={() => quickLogin('SuperAdmin')}>
                <ShieldCheck className="w-4 h-4 text-primary" />
              </Button>
              <Button variant="outline" size="icon" title="Admin" onClick={() => quickLogin('Admin')}>
                <ShieldCheck className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" title="HR" onClick={() => quickLogin('HR')}>
                <Briefcase className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" title="Manager" onClick={() => quickLogin('Manager')}>
                <Users className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" title="Employee" onClick={() => quickLogin('Employee')}>
                <UserCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
