
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (session) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-full" />
        <p className="text-muted-foreground font-medium">Loading WorkNest HR...</p>
      </div>
    </div>
  );
}
